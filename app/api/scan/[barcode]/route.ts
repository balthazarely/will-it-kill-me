import Anthropic from "@anthropic-ai/sdk";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { progressManager } from "@/lib/progressManager";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const db = new DynamoDBClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> },
) {
  const { barcode } = await params;
  const startTime = Date.now();

  progressManager.emit(barcode, {
    status: "checking_cache",
    message: "Checking our database...",
  });

  // Check cache first
  try {
    const cached = await db.send(
      new GetItemCommand({
        TableName: "food-scanner-cache",
        Key: { barcode: { S: barcode } },
      }),
    );

    if (cached.Item) {
      // console.log(`[${new Date().toISOString()}] ✅ CACHE HIT! Found cached product: ${cached.Item?.name?.S}`);
      // Increment scan count in background
      db.send(
        new UpdateItemCommand({
          TableName: "food-scanner-cache",
          Key: { barcode: { S: barcode } },
          UpdateExpression: "SET scan_count = scan_count + :inc",
          ExpressionAttributeValues: { ":inc": { N: "1" } },
        }),
      ).catch((err) =>
        console.log("❌ scan_count increment failed:", err.message),
      );

      if (cached.Item?.data?.S) {
        progressManager.emit(barcode, {
          status: "complete",
          message: "Found in database!",
        });
        progressManager.clear(barcode);
        return Response.json(JSON.parse(cached.Item.data.S));
      }
    }
    // console.log(`[${new Date().toISOString()}] ❌ CACHE MISS - Product not in cache`);
  } catch (err) {
    console.log(`[${new Date().toISOString()}] ⚠️ Cache read error:`, err);
  }

  progressManager.emit(barcode, {
    status: "fetching_product",
    message: "Looking up product details...",
  });

  let offData;
  try {
    const offRes = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
      {
        headers: {
          "User-Agent": "WillThisKillMe/1.0 (contact@willthiskillme.com)",
        },
      },
    );
    // console.log(`[${new Date().toISOString()}] 📡 OpenFoodFacts response: ${offRes.status}`);
    offData = await offRes.json();
  } catch (err) {
    // console.log(`[${new Date().toISOString()}] ❌ OpenFoodFacts fetch failed:`, err);
    return Response.json(
      { error: "Failed to reach product database" },
      { status: 503 },
    );
  }

  if (offData.status === 0) {
    // console.log(`[${new Date().toISOString()}] ❌ Product not found in OpenFoodFacts`);
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const product = offData.product;
  const ingredients = product.ingredients_text ?? "No ingredients listed";
  const novaGroup = product.nova_group;
  const additives = product.additives_tags ?? [];
  // console.log(`[${new Date().toISOString()}] ✅ Product fetched: ${product.product_name}`);

  progressManager.emit(barcode, {
    status: "analyzing",
    message: "Analyzing with AI...",
  });

  let analysis;
  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `You are a brutally honest food analyst for an app called "Will This Kill Me?". Your job is to tell people straight whether the food they're eating is slowly killing them or not. Be direct, a little dramatic, but accurate.

            Product: ${product.product_name}
            Ingredients: ${ingredients}
            NOVA processing group: ${novaGroup} (1=unprocessed, 4=ultra-processed)
            Additives: ${additives.join(", ")}

            Scoring guide:
            - 5 = excellent (whole/unprocessed food, no additives — you will not die from this)
            - 4 = good (minimally processed, few clean ingredients — probably fine)
            - 3 = moderate (some processing or additives — not great, not terrible)
            - 2 = poor (ultra-processed, high sugar/salt/fat — yeah this isn't good for you)
            - 1 = bad (junk food, heavily processed — this is absolutely killing you slowly)

            Return JSON only, no markdown, in this exact format:
            {
            "score": 1-5,
            "verdict": "one punchy sentence with some personality about whether this will kill you",
            "flags": ["concerning ingredient 1", "concerning ingredient 2"],
            "suggestion": "a healthier alternative, or null if score is 4 or 5"
            }`,
        },
      ],
    });

    const text = (message.content[0] as { text: string }).text;
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    return Response.json(
      { error: "Failed to reach Anthropic" },
      { status: 503 },
    );
  }

  const responseBody = JSON.stringify({
    name: product.product_name_en_imported || product.product_name,
    brand: product.brands ?? null,
    image: product.image_front_url ?? null,
    ingredients,
    nova_group: novaGroup,
    additives,
    ecoscore: product.ecoscore_grade ?? null,
    nutriments: product.nutriments,
    analysis,
  });

  progressManager.emit(barcode, {
    status: "caching",
    message: "Saving results...",
  });

  // Write to cache
  try {
    await db.send(
      new PutItemCommand({
        TableName: "food-scanner-cache",
        ConditionExpression: "attribute_not_exists(barcode)",
        Item: {
          barcode: { S: barcode },
          data: { S: responseBody },
          name: {
            S:
              product.product_name_en_imported ||
              product.product_name ||
              "Unknown",
          },
          brand: { S: product.brands ?? "Unknown" },
          image: { S: product.image_front_url ?? "" },
          score: { N: String(analysis.score) },
          verdict: { S: analysis.verdict },
          flags: analysis.flags?.length
            ? { SS: analysis.flags }
            : { SS: ["none"] },
          scan_count: { N: "1" },
          nova_group: { N: String(product.nova_group ?? 0) },
          additives_count: { N: String(additives.length) },
          sugar_per_100g: { N: String(product.nutriments?.sugars_100g ?? 0) },
          sat_fat_per_100g: {
            N: String(product.nutriments?.["saturated-fat_100g"] ?? 0),
          },
          ecoscore: { S: product.ecoscore_grade ?? "unknown" },
          ttl: { N: String(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30) },
        },
      }),
    );
  } catch (err: any) {
    if (err.name === "ConditionalCheckFailedException") {
      db.send(
        new UpdateItemCommand({
          TableName: "food-scanner-cache",
          Key: { barcode: { S: barcode } },
          UpdateExpression: "SET scan_count = scan_count + :inc",
          ExpressionAttributeValues: { ":inc": { N: "1" } },
        }),
      ).catch((err) =>
        console.log("scan_count increment failed:", err.message),
      );
    } else {
      console.log("Cache write failed:", err.message);
    }
  }

  progressManager.emit(barcode, {
    status: "complete",
    message: "Done!",
  });
  progressManager.clear(barcode);

  return Response.json(JSON.parse(responseBody));
}
