import connectDB from "../../../../../config/db";
import RecipesModel from "../../../../../model/recipes.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    console.log("Fetching recipes for user:", userId);

    const recipes = await RecipesModel.find({ userID: userId });

    return NextResponse.json({ msg: "Success", recipes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { userId, sessionClaims } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const body = await request.json();
    const { title, description, ingredients, steps } = body;

    console.log("Adding recipe for user:", userId);

    const recipe = new RecipesModel({
      title,
      description,
      ingredients,
      steps,
      userID: userId, // ✅ Clerk user ID
      username: sessionClaims?.username || "Unknown", // optional Clerk field
    });

    await recipe.save();

    return NextResponse.json(
      { msg: "A new recipe has been added", recipe },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving recipe:", error);
    return NextResponse.json(
      { msg: "Error saving recipe", error: error.message },
      { status: 500 }
    );
  }
}

