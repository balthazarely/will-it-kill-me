import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return Response.json({ error: "Image data required" }, { status: 400 });
    }

    // Extract base64 data and detect media type from data URL
    let imageData = image;
    let mediaType = "image/jpeg";

    if (image.startsWith("data:")) {
      const mimeMatch = image.match(/^data:([^;]+)/);
      if (mimeMatch) {
        mediaType = mimeMatch[1];
      }
      imageData = image.split(",")[1];
    }

    const message = await anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageData,
              },
            },
            {
              type: "text",
              text: `You are a brutally honest nutritionist for an app called "Will This Kill Me?". Your job is to analyze nutrition labels and tell people straight whether the food is slowly killing them or not. Be direct, a little dramatic, but accurate.

Analyze the nutrition label in this image and return a JSON response (no markdown, just JSON).

First extract the key nutritional info you can see. Then score the product based on:
- Overall calorie density
- Sugar content (especially added sugars)
- Saturated fat and trans fat
- Sodium levels
- Ingredient quality (if visible)
- Fiber and protein content

Scoring guide:
- 5 = excellent (low sugar, reasonable calories, good macros — you will not die from this)
- 4 = good (moderate sugar, decent nutrition — probably fine)
- 3 = moderate (some concerning nutrients — not great, not terrible)
- 2 = poor (high sugar/salt/fat or many processed ingredients — yeah this isn't good for you)
- 1 = bad (extremely high sugar/fat, clearly unhealthy — this is absolutely killing you slowly)

Return ONLY valid JSON in this exact format:
{
  "product_name": "product name from label or null",
  "score": 1-5,
  "verdict": "one punchy sentence with personality about whether this will kill you",
  "flags": ["concerning nutrient 1", "concerning nutrient 2"],
  "suggestion": "a healthier alternative, or null if score is 4 or 5",
  "key_nutrients": {
    "calories": "value or null",
    "sugars": "value or null",
    "saturated_fat": "value or null",
    "sodium": "value or null"
  },
  "confidence": "high/medium/low - your confidence in this analysis"
}`,
            },
          ],
        },
      ],
    });

    const text = (message.content[0] as { text: string }).text;
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const analysis = JSON.parse(cleaned);

    return Response.json(analysis);
  } catch (err) {
    console.error("Nutrition label analysis error:", err);
    return Response.json(
      { error: "Failed to analyze nutrition label" },
      { status: 500 },
    );
  }
}
