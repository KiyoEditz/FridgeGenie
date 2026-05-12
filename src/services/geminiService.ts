import { RecipeProphecy } from "../types";

export async function generateRecipeProphecy(
  ingredients: string[],
  imageB64?: string
): Promise<RecipeProphecy> {
  const response = await fetch("/api/prophesize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients, imageB64 }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "The stars are cloudy. Please try again.");
  }

  return response.json();
}
