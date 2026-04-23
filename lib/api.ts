import { Product } from "./types";

// const API_URL = "https://i9bha5wbmb.execute-api.us-east-2.amazonaws.com";

export class ScanError extends Error {
  constructor(
    message: string,
    readonly type: "not_found" | "server" | "network" | "abort",
  ) {
    super(message);
    this.name = "ScanError";
  }
}

export const scanBarcode = async (
  barcode: string,
  signal?: AbortSignal,
): Promise<Product> => {
  try {
    const response = await fetch(`/api/scan/${barcode}`, { signal });
    if (response.status === 404) {
      throw new ScanError("Product not found", "not_found");
    }
    if (!response.ok) {
      throw new ScanError("Server error", "server");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof ScanError) {
      throw err;
    }
    if (err instanceof TypeError) {
      throw new ScanError("Network error", "network");
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ScanError("Request cancelled", "abort");
    }
    throw err;
  }
};
