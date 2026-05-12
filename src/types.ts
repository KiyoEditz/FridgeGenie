export interface RecipeProphecy {
  title: string;
  prophecy: string; // The mystical introduction
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  difficulty: 'Novice' | 'Alchemist' | 'Grand Master';
  wasteSavedApprox: string; // e.g. "400g of potential void"
}

export interface Ingredient {
  id: string;
  name: string;
}
