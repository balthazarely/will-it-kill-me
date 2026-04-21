const API_URL = "https://i9bha5wbmb.execute-api.us-east-2.amazonaws.com";

export interface Product {
  name: string;
  ingredients: string;
  nova_group: number;
  additives: string[];
  nutriments: {
    "energy-kcal_100g": number;
    fat_100g: number;
    "saturated-fat_100g": number;
    carbohydrates_100g: number;
    sugars_100g: number;
    proteins_100g: number;
    salt_100g: number;
    fiber_100g: number;
  };
  analysis: {
    score: number;
    verdict: string;
    flags: string[];
    suggestion: string;
  };
}

export const scanBarcode = async (barcode: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/scan/${barcode}`);
  if (!response.ok) {
    throw new Error("Product not found");
  }
  const data = await response.json();
  return data;
};
