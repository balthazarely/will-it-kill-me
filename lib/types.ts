export interface Product {
  name: string;
  brand?: string;
  image?: string;
  ingredients: string;
  nova_group: number;
  additives: string[];
  nutriments: {
    [key: string]: number | undefined;
    "energy-kcal_100g"?: number;
    fat_100g?: number;
    "saturated-fat_100g"?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
  };
  analysis: {
    score: number;
    verdict: string;
    flags: string[];
    suggestion: string;
  };
}
