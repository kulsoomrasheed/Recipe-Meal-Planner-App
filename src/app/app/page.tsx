"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "../../context/AuthContext";
import { useRecipes } from "../../context/RecipesContext";
import { AiAPI } from "../../lib/api";
import Logo from "../../components/Logo";
import Spinner from "../../components/Spinner";
import TabNavigation from "../../components/TabNavigation";
import FormModal from "../../components/FormModal";
import InputChips from "../../components/InputChips";
import RecipeCard from "../../components/RecipeCard";
import { Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { UserButton } from "@clerk/nextjs";

const tabs = [
  { key: "recipes", label: "My Recipes" },
  { key: "ai", label: "AI Suggestions" },
  { key: "planner", label: "AI Meal Planner" },
];

export default function AppPage() {
  const router = useRouter();
  // const { isAuthenticated, logout, isLoading: isAuthLoading } = useAuth();
  const { user } = useAuthentication();
  const {
    recipes,
    loading: recipesLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();
  const [current, setCurrent] = useState("recipes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formIngredients, setFormIngredients] = useState<string[]>([]);
  const [formSteps, setFormSteps] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const aiChipsRef = useRef<HTMLDivElement | null>(null);

  const [aiInput, setAiInput] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [planPrefs, setPlanPrefs] = useState({
    days: 5 as number | string,
    calories: 2000 as number | string,
    diet: "Balanced",
  });
  const [planLoading, setPlanLoading] = useState(false);
  const [planResult, setPlanResult] = useState<string[] | null>(null);
  const [refetchingAfterDelete, setRefetchingAfterDelete] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticated && !isAuthLoading) router.replace("/login");
  // }, [isAuthenticated, router, isAuthLoading]);

  function openCreate() {
    setEditing(null);
    setFormTitle("");
    setFormIngredients([]);
    setFormSteps("");
    setModalOpen(true);
  }

  function openEdit(recipe: any) {
    setEditing(recipe);
    setFormTitle(recipe.title || "");
    const ing = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((i: any) => (typeof i === "string" ? i : i.name))
      : [];
    setFormIngredients(ing);
    const steps = Array.isArray(recipe.steps)
      ? recipe.steps.join("\n")
      : recipe.steps || "";
    setFormSteps(steps);
    setModalOpen(true);
  }

  async function saveRecipe(e: React.FormEvent) {
    e.preventDefault();
    // Merge any pending, not-yet-entered ingredient from the InputChips input
    const pendingInput =
      (
        chipsRef.current?.querySelector("input") as HTMLInputElement | null
      )?.value?.trim() || "";
    const mergedIngredients = Array.from(
      new Set([
        ...(formIngredients || []),
        ...(pendingInput ? [pendingInput] : []),
      ])
    );

    // Block submission if no ingredients are provided
    if (mergedIngredients.length === 0) {
      toast.warning("Please add at least one ingredient.");
      return;
    }

    try {
      setActionLoadingId(editing ? editing._id || editing.id : "new");
      if (editing) {
        await updateRecipe(editing._id || editing.id, {
          title: formTitle,
          ingredients: mergedIngredients,
          steps: formSteps,
        });
        toast.success("Recipe updated successfully!");
      } else {
        await addRecipe({
          title: formTitle,
          ingredients: mergedIngredients,
          steps: formSteps,
        });
        toast.success("Recipe added successfully!");
      }
      setModalOpen(false);
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.msg ||
        err?.message ||
        "Something went wrong";
      if (typeof window !== "undefined") toast.error(msg);
      setModalOpen(false);
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    if (!recipesLoading && refetchingAfterDelete) {
      setRefetchingAfterDelete(false);
    }
  }, [recipesLoading, refetchingAfterDelete]);

  async function generateAiRecipe() {
    if (aiLoading) return;

    // Merge any pending, not-yet-entered ingredient from the InputChips input
    const pendingInput =
      (
        aiChipsRef.current?.querySelector("input") as HTMLInputElement | null
      )?.value?.trim() || "";
    const mergedIngredients = Array.from(
      new Set([...(aiInput || []), ...(pendingInput ? [pendingInput] : [])])
    );

    // Validation: must have at least one ingredient
    if (mergedIngredients.length === 0) {
      toast.warning("Please add at least one ingredient for AI suggestions.");
      return;
    }

    // Reflect merged state in UI and clear the pending input box so it's not duplicated
    setAiInput(mergedIngredients);
    if (pendingInput) {
      const inputEl = aiChipsRef.current?.querySelector(
        "input"
      ) as HTMLInputElement | null;
      if (inputEl) inputEl.value = "";
    }

    setAiLoading(true);
    try {
      const res = await AiAPI.suggest(mergedIngredients as any);
      setAiResult({
        title: "AI Suggestions",
        ingredients: mergedIngredients,
        steps: (res as any).suggestions,
      });
      toast.success("AI recipe suggestions generated successfully!");
    } catch (err: any) {
      const errorMsg =
        err?.data?.error ||
        err?.data?.msg ||
        err?.message ||
        "Failed to generate AI suggestions. Please try again.";
      toast.error(errorMsg);
    } finally {
      setAiLoading(false);
    }
  }

  async function generatePlan() {
    if (planLoading) return;

    // Basic validation
    const daysNum = Number(planPrefs.days);
    const dietStr = String(planPrefs.diet || "").trim();
    if (!dietStr) {
      toast.warning(
        "Please provide a diet preference (e.g., Balanced, Vegetarian)."
      );
      return;
    }
    if (!Number.isFinite(daysNum) || daysNum < 1) {
      toast.warning("Please enter a valid number of days (at least 1).");
      return;
    }

    setPlanLoading(true);
    try {
      const res = await AiAPI.mealPlan({
        days: daysNum,
        preferences: `${dietStr}, ${planPrefs.calories} kcal`,
      });
      setPlanResult(
        String((res as any).mealPlan || "")
          .split("\n")
          .filter(Boolean)
      );
      toast.success("Meal plan generated successfully!");
    } catch (err: any) {
      const errorMsg =
        err?.data?.error ||
        err?.data?.msg ||
        err?.message ||
        "Failed to generate meal plan. Please try again.";
      toast.error(errorMsg);
    } finally {
      setPlanLoading(false);
    }
  }
  // Local AI generator for modal — reuses same logic
  const generateAiStepsForForm = async () => {
    if (aiLoading) return;
    if (!formIngredients?.length) {
      toast.warning("Please add at least one ingredient to generate steps.");
      return;
    }

    setAiLoading(true);
    try {
      // ✅ Reuse the same backend API as generateAiRecipe
      const res = await AiAPI.suggest(formIngredients as any);
      const steps = (res as any).suggestions;
      setFormSteps(steps); // directly fill textarea
      toast.success("AI-generated steps added successfully!");
    } catch (err: any) {
      const msg =
        err?.data?.error ||
        err?.data?.msg ||
        err?.message ||
        "Failed to generate steps.";
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #FFF7F7 0%, #FFFDF5 100%)",
      }}
    >
      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto">
        {user &&  <div className="flex items-center justify-between mb-6">
            <Logo />
            <button
              // onClick={logout}
              className="text-sm underline"
              style={{ color: "#6b4a52" }}
            >
            <UserButton/>
            </button>
          </div>
}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <TabNavigation
              tabs={tabs}
              current={current}
              onChange={setCurrent}
            />
            {current === "recipes" && recipes?.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={openCreate}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium"
                  style={{ background: "#B7EDC8", color: "#1f3a2c" }}
                >
                  Add Recipe
                </button>
              </div>
            )}
          </div>

          {current === "recipes" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipesLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-52 rounded-2xl"
                      style={{
                        background: "#fff",
                        border: "1px solid #ffe0e0",
                      }}
                    />
                  ))
                : recipes
                    ?.slice() // make a shallow copy so original isn't mutated
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ) // newest first
                    .map((r: any) => (
                      <RecipeCard
                        key={r._id || r.id}
                        recipe={r}
                        busy={actionLoadingId === (r._id || r.id)}
                        onEdit={openEdit}
                        onDelete={async (rec) => {
                          setActionLoadingId(rec._id || rec.id);
                          try {
                            setRefetchingAfterDelete(true);
                            await deleteRecipe(rec._id || rec.id);
                            toast.success("Recipe deleted successfully!");
                          } catch (err: any) {
                            const msg =
                              err?.data?.error ||
                              err?.data?.msg ||
                              err?.message ||
                              "Failed to delete";
                            if (typeof window !== "undefined") toast.error(msg);
                          } finally {
                            setActionLoadingId(null);
                          }
                        }}
                      />
                    ))}
              {recipesLoading && refetchingAfterDelete ? (
                <div className="col-span-full space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-10 rounded-lg"
                      style={{
                        background: "#fff",
                        border: "1px solid #ffe0e0",
                      }}
                    />
                  ))}
                </div>
              ) : null}
              {!recipesLoading && recipes.length === 0 ? (
                <div
                  className="col-span-full text-center text-sm space-y-3"
                  style={{ color: "#6b4a52" }}
                >
                  <div
                    className="mx-auto w-24 h-24 rounded-full"
                    style={{ background: "#FFE8EF" }}
                  />
                  <div>No recipes yet. Create your first recipe!</div>
                  <button
                    onClick={openCreate}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{ background: "#B7EDC8", color: "#1f3a2c" }}
                  >
                    ➕ Add a Recipe
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {current === "ai" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="rounded-2xl p-6"
                style={{ background: "#fff", border: "1px solid #ffe0e0" }}
              >
                <h3 className="font-semibold mb-2" style={{ color: "#333" }}>
                  Ingredients
                </h3>
                <div ref={aiChipsRef}>
                  <InputChips value={aiInput} onChange={setAiInput} />
                </div>
                <button
                  onClick={generateAiRecipe}
                  disabled={aiLoading}
                  className="mt-4 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                  style={{ background: "#FFB3C7", color: "#40282c" }}
                >
                  {aiLoading ? <Spinner size={16} /> : null}
                  {aiLoading ? "Generating..." : "Generate Recipe"}
                </button>
                {aiLoading && (
                  <p className=" text-xs mt-3" style={{ color: "#555" }}>
                    This might take 1-2 minutes
                  </p>
                )}
              </div>
              <div
                className="rounded-2xl p-6 h-[500px] overflow-y-auto scrollbar-hide"
                style={{ background: "#fff", border: "1px solid #ffe0e0" }}
              >
                <h3 className="font-semibold mb-2" style={{ color: "#333" }}>
                  AI Output
                </h3>
                {aiLoading ? (
                  <div
                    className="animate-pulse h-40 rounded-xl"
                    style={{ background: "#FFF7F7" }}
                  />
                ) : aiResult ? (
                  <div>
                    <h4 className="font-semibold" style={{ color: "#333" }}>
                      {aiResult.title}
                    </h4>
                    <p
                      className="text-sm mt-2 whitespace-pre-wrap"
                      style={{ color: "#6b4a52" }}
                    >
                      {aiResult.steps}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "#6b4a52" }}>
                    Your AI recipes will appear here.✨
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {current === "planner" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="rounded-2xl p-6 space-y-4"
                style={{ background: "#fff", border: "1px solid #ffe0e0" }}
              >
                <h3 className="font-semibold" style={{ color: "#333" }}>
                  Preferences
                </h3>
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: "#555" }}
                  >
                    Diet
                  </label>
                  <input
                    className="w-full rounded-lg border p-3 outline-none"
                    style={{ borderColor: "#ffd6e0" }}
                    value={String(planPrefs.diet)}
                    onChange={(e) =>
                      setPlanPrefs({ ...planPrefs, diet: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm mb-1"
                      style={{ color: "#555" }}
                    >
                      Days
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg border p-3 outline-none"
                      style={{ borderColor: "#ffd6e0" }}
                      value={Number(planPrefs.days)}
                      onChange={(e) =>
                        setPlanPrefs({ ...planPrefs, days: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={generatePlan}
                  disabled={planLoading}
                  className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                  style={{ background: "#FFE28C", color: "#4a3e1f" }}
                >
                  {planLoading ? <Spinner size={16} /> : null}
                  {planLoading ? "Generating..." : "Generate Plan"}
                </button>
                {planLoading && (
                  <p className=" text-xs " style={{ color: "#555" }}>
                    This might take 2-3 minutes
                  </p>
                )}
              </div>
              <div
                className="rounded-2xl p-6 h-[500px] overflow-y-auto scrollbar-hide"
                style={{ background: "#fff", border: "1px solid #ffe0e0" }}
              >
                <h3 className="font-semibold mb-2" style={{ color: "#333" }}>
                  Meal Plan
                </h3>
                {planLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse h-16 rounded-xl"
                        style={{ background: "#FFF7F7" }}
                      />
                    ))}
                  </div>
                ) : planResult && planResult.length > 0 ? (
                  <pre
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: "#6b4a52" }}
                  >
                    {planResult.join("\n")}
                  </pre>
                ) : (
                  <div
                    className="text-sm space-y-3"
                    style={{ color: "#6b4a52" }}
                  >
                    <div>No meal plan yet. Try generating one!✨</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <FormModal
          open={modalOpen}
          title={editing ? "Edit Recipe" : "Add Recipe"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={saveRecipe} className="space-y-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: "#555" }}>
                Title
              </label>
              <input
                className="w-full rounded-lg border p-3 outline-none"
                style={{ borderColor: "#ffd6e0" }}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#555" }}>
                Ingredients <span className="text-red-500">*</span>
              </label>
              <div ref={chipsRef} aria-required="true" role="group">
                <InputChips
                  value={formIngredients}
                  onChange={setFormIngredients}
                  placeholder="Add ingredient and press Enter"
                />
              </div>
              {!formIngredients.length && (
                <p className="text-red-500 text-sm mt-1">
                  At least one ingredient is required
                </p>
              )}

              {formIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={generateAiStepsForForm}
                  disabled={aiLoading}
                  className="mt-4 px-4 py-1 rounded-lg bg-amber-100 font-medium inline-flex items-center gap-2"
                  style={{ color: "#40282c" }}
                >
                  {aiLoading ? <Spinner size={16} /> : null}
                  {aiLoading ? "Generating..." : "✨ Generate Steps with AI"}
                </button>
              )}
              
              {aiLoading && (
                <p className="text-xs mt-2" style={{ color: "#555" }}>
                  Generating steps...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#555" }}>
                Steps
              </label>
              <textarea
                className="w-full rounded-lg border p-3 outline-none min-h-24"
                style={{ borderColor: "#ffd6e0" }}
                value={formSteps}
                onChange={(e) => setFormSteps(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg"
                style={{ background: "#FFF2F7", color: "#6b4a52" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Boolean(actionLoadingId)}
                className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                style={{ background: "#B7EDC8", color: "#1f3a2c" }}
              >
                {actionLoadingId ? <Spinner size={16} /> : null}
                {editing
                  ? actionLoadingId
                    ? "Saving..."
                    : "Save"
                  : actionLoadingId
                  ? "Adding..."
                  : "Add"}
              </button>
            </div>
          </form>
        </FormModal>
      </div>
      <footer className="w-full text-xs pb-4 text-gray-600 flex items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} Kulsoom Rasheed</span>
        <a
          href="https://github.com/kulsoomrasheed"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kulsoom Rasheed GitHub profile"
          className="inline-flex items-center gap-1 hover:text-gray-800"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/kulsoom-rasheed-a5b5a0278/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kulsoom Rasheed LinkedIn profile"
          className="inline-flex items-center gap-1 hover:text-gray-800"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </footer>
    </div>
  );
}
