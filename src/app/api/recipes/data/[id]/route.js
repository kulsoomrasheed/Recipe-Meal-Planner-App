import connectDB from "../../../../../../config/db";
import RecipesModel from "../../../../../../model/recipes.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 📌 DELETE — Delete a recipe (only by owner)
export async function DELETE(request, { params }) {
  const { userId } = getAuth(request);
  const { id } = params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const recipe = await RecipesModel.findById(id);
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userID !== userId) {
      console.log("Unauthorized delete attempt by:", userId);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    console.log("Deleting recipe:", id, "by user:", userId);
    await RecipesModel.findByIdAndDelete(id);

    return NextResponse.json(
      { msg: `Recipe with id ${id} is deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Error deleting recipe" },
      { status: 500 }
    );
  }
}

// 📌 PATCH — Update a recipe (only by owner)
export async function PATCH(request, { params }) {
  const { userId } = getAuth(request);
  const { id } = params;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const body = await request.json();
    const recipe = await RecipesModel.findById(id);

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userID !== userId) {
      console.log("Unauthorized update attempt by:", userId);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    console.log("Updating recipe:", id, "by user:", userId);
    await RecipesModel.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(
      { msg: `Recipe with id ${id} is updated successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Error updating recipe" },
      { status: 500 }
    );
  }
}
