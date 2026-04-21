export const FOODS = [
  {
    id: 'cheetos',
    name: "Flamin' Hot Cheetos",
    emoji: '🔥',
    tagline: "Chester's finest creation",
    ingredients:
      "Enriched Corn Meal, Vegetable Oil (Corn, Canola, and/or Sunflower Oil), Flamin' Hot Seasoning (Maltodextrin, Salt, Sugar, Monosodium Glutamate, Yeast Extract, Citric Acid, Artificial Color [Red 40 Lake, Yellow 6 Lake, Yellow 6], Sunflower Oil, Cheddar Cheese [Milk, Cheese Cultures, Salt, Enzymes], Onion Powder, Whey, Garlic Powder, Natural Flavor, Buttermilk, Sodium Diacetate, Disodium Inosinate, Disodium Guanylate)",
  },
  {
    id: 'yogurt',
    name: 'Chobani Greek Yogurt',
    emoji: '🥛',
    tagline: 'Trying to be healthy, huh?',
    ingredients:
      'Cultured Nonfat Milk, Water, Evaporated Cane Sugar, Fruit Pectin, Locust Bean Gum, Natural Flavors, Vitamin D3. Live and Active Cultures: S. Thermophilus, L. Bulgaricus, L. Acidophilus, Bifidus, L. Casei',
  },
  {
    id: 'dietcoke',
    name: 'Diet Coke',
    emoji: '🥤',
    tagline: 'Zero calories, zero regrets?',
    ingredients:
      'Carbonated Water, Caramel Color, Aspartame, Phosphoric Acid, Potassium Benzoate, Natural Flavors, Citric Acid, Caffeine. PHENYLKETONURICS: CONTAINS PHENYLALANINE.',
  },
  {
    id: 'nutella',
    name: 'Nutella',
    emoji: '🍫',
    tagline: 'Technically contains hazelnuts',
    ingredients:
      'Sugar, Palm Oil, Hazelnuts (13%), Cocoa Solids (7.4%), Skimmed Milk Powder (6.6%), Whey Permeate (Milk), Lecithin (Soy), Vanillin (Artificial Flavour). May contain traces of other tree nuts and peanuts.',
  },
];

export const VERDICT_CONFIG = {
  safe: {
    label: "You'll survive",
    textColor: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
    dotColor: 'bg-green-400',
    tagBg: 'bg-green-400/15',
    tagBorder: 'border-green-400/30',
    tagText: 'text-green-400',
    icon: '✓',
  },
  caution: {
    label: 'Proceed with caution',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
    dotColor: 'bg-amber-400',
    tagBg: 'bg-amber-400/15',
    tagBorder: 'border-amber-400/30',
    tagText: 'text-amber-400',
    icon: '⚠',
  },
  bad: {
    label: 'Questionable life choice',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    dotColor: 'bg-orange-400',
    tagBg: 'bg-orange-400/15',
    tagBorder: 'border-orange-400/30',
    tagText: 'text-orange-400',
    icon: '⚡',
  },
  danger: {
    label: 'Absolutely not',
    textColor: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30',
    dotColor: 'bg-red-400',
    tagBg: 'bg-red-400/15',
    tagBorder: 'border-red-400/30',
    tagText: 'text-red-400',
    icon: '☠',
  },
};
