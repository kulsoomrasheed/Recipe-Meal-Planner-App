import mongoose from 'mongoose'  

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: String, required: false },
      },
    ],
    steps: {
      type: [String], // array of steps
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userID: String, // for ownership/auth checks
    username: String, // who created it
  },
  {
    versionKey: false,
  }
);
const RecipesModel = mongoose.models.User || mongoose.model("recipes", recipeSchema);

export default RecipesModel 
