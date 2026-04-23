import { progressManager, type ProgressUpdate } from "@/lib/progressManager";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  // Create a readable stream for SSE
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send initial SSE header comment
      controller.enqueue(
        new TextEncoder().encode(": SSE connection established\n\n")
      );

      // Subscribe to progress updates
      const unsubscribe = progressManager.subscribe(
        barcode,
        (update: ProgressUpdate) => {
          const data = `data: ${JSON.stringify(update)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        }
      );

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
