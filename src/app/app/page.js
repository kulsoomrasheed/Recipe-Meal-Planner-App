"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useRecipes } from "../../context/RecipesContext";
import { AiAPI } from "../../lib/api";
import Logo from "../../components/Logo";
import Spinner from "../../components/Spinner";
import TabNavigation from "../../components/TabNavigation";
import FormModal from "../../components/FormModal";
import InputChips from "../../components/InputChips";
import RecipeCard from "../../components/RecipeCard";

const tabs = [
  { key: "recipes", label: "My Recipes" },
  { key: "ai", label: "AI Suggestions" },
  { key: "planner", label: "AI Meal Planner" },
];

export default function AppPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { recipes, loading: recipesLoading, addRecipe, updateRecipe, deleteRecipe } = useRecipes();

  const [current, setCurrent] = useState("recipes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [formIngredients, setFormIngredients] = useState([]);
  const [formSteps, setFormSteps] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [aiInput, setAiInput] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [planPrefs, setPlanPrefs] = useState({ days: 5, calories: 2000, diet: "Balanced" });
  const [planLoading, setPlanLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [refetchingAfterDelete, setRefetchingAfterDelete] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  function openCreate() {
    setEditing(null);
    setFormTitle("");
    setFormIngredients([]);
    setFormSteps("");
    setModalOpen(true);
  }

  function openEdit(recipe) {
    setEditing(recipe);
    setFormTitle(recipe.title || "");
    const ing = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map((i) => (typeof i === "string" ? i : i.name))
      : [];
    setFormIngredients(ing);
    const steps = Array.isArray(recipe.steps) ? recipe.steps.join("\n") : recipe.steps || "";
    setFormSteps(steps);
    setModalOpen(true);
  }

  async function saveRecipe(e) {
    e.preventDefault();
    try {
      setActionLoadingId(editing ? (editing._id || editing.id) : "new");
      if (editing) {
        await updateRecipe(editing._id || editing.id, { title: formTitle, ingredients: formIngredients, steps: formSteps });
      } else {
        await addRecipe({ title: formTitle, ingredients: formIngredients, steps: formSteps });
      }
      setModalOpen(false);
    } catch (err) {
      const msg = err?.data?.error || err?.data?.msg || err?.message || "Something went wrong";
      if (typeof window !== "undefined") alert(msg);
      setModalOpen(false);
    }
    finally {
      setActionLoadingId(null);
    }
  }

  // Track refetching state specifically after delete to show alternate skeleton
  useEffect(() => {
    if (!recipesLoading && refetchingAfterDelete) {
      setRefetchingAfterDelete(false);
    }
  }, [recipesLoading, refetchingAfterDelete]);

  async function generateAiRecipe() {
    setAiLoading(true);
    try {
      const res = await AiAPI.suggest(aiInput);
      // Backend returns text. Show it simply for now.
      setAiResult({ title: "AI Suggestions", ingredients: aiInput, steps: res.suggestions });
    } catch (err) {
      // handle silently or add inline error UI
    } finally {
      setAiLoading(false);
    }
  }

  async function generatePlan() {
    setPlanLoading(true);
    try {
      const res = await AiAPI.mealPlan({ days: Number(planPrefs.days) || 5, preferences: `${planPrefs.diet}, ${planPrefs.calories} kcal` });
      setPlanResult(String(res.mealPlan || "").split("\n").filter(Boolean));
    } catch (err) {
      // handle silently or add inline error UI
    } finally {
      setPlanLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(180deg, #FFF7F7 0%, #FFFDF5 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <button onClick={logout} className="text-sm underline" style={{ color: "#6b4a52" }}>Log out</button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <TabNavigation tabs={tabs} current={current} onChange={setCurrent} />
          {current === "recipes" ? (
            <div className="flex justify-end">
              <button onClick={openCreate} className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium" style={{ background: "#B7EDC8", color: "#1f3a2c" }}>Add Recipe</button>
            </div>
          ) : null}
        </div>

        {current === "recipes" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-52 rounded-2xl" style={{ background: "#fff", border: "1px solid #ffe0e0" }} />
                ))
              : recipes.map((r) => (
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
                      } catch (err) {
                        const msg = err?.data?.error || err?.data?.msg || err?.message || "Failed to delete";
                        if (typeof window !== "undefined") alert(msg);
                      } finally {
                        setActionLoadingId(null);
                      }
                    }}
                  />
                ))}
            {recipesLoading && refetchingAfterDelete ? (
              <div className="col-span-full space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-10 rounded-lg" style={{ background: "#fff", border: "1px solid #ffe0e0" }} />
                ))}
              </div>
            ) : null}
            {!recipesLoading && recipes.length === 0 ? (
              <div className="col-span-full text-center text-sm space-y-3" style={{ color: "#6b4a52" }}>
                <div className="mx-auto w-24 h-24 rounded-full" style={{ background: "#FFE8EF" }} />
                <div>No recipes yet. Create your first recipe!</div>
                <button onClick={openCreate} className="px-4 py-2 rounded-lg font-medium" style={{ background: "#B7EDC8", color: "#1f3a2c" }}>➕ Add a Recipe</button>
              </div>
            ) : null}
          </div>
        ) : null}

        {current === "ai" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#333" }}>Ingredients</h3>
              <InputChips value={aiInput} onChange={setAiInput} />
              <button onClick={generateAiRecipe} disabled={aiLoading} className="mt-4 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2" style={{ background: "#FFB3C7", color: "#40282c" }}>
                {aiLoading ? <Spinner size={16} /> : null}
                {aiLoading ? "Generating..." : "Generate Recipe"}
              </button>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#333" }}>AI Output</h3>
              {aiLoading ? (
                <div className="animate-pulse h-40 rounded-xl" style={{ background: "#FFF7F7" }} />
              ) : aiResult ? (
                <div>
                  <h4 className="font-semibold" style={{ color: "#333" }}>{aiResult.title}</h4>
                  <p className="text-sm mt-2 whitespace-pre-wrap" style={{ color: "#6b4a52" }}>{aiResult.steps}</p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#6b4a52" }}>Your recipe will appear here.</p>
              )}
            </div>
          </div>
        ) : null}

        {current === "planner" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
              <h3 className="font-semibold" style={{ color: "#333" }}>Preferences</h3>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#555" }}>Diet</label>
                <input className="w-full rounded-lg border p-3 outline-none" style={{ borderColor: "#ffd6e0" }} value={planPrefs.diet} onChange={(e) => setPlanPrefs({ ...planPrefs, diet: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: "#555" }}>Days</label>
                  <input type="number" className="w-full rounded-lg border p-3 outline-none" style={{ borderColor: "#ffd6e0" }} value={planPrefs.days} onChange={(e) => setPlanPrefs({ ...planPrefs, days: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: "#555" }}>Calories</label>
                  <input type="number" className="w-full rounded-lg border p-3 outline-none" style={{ borderColor: "#ffd6e0" }} value={planPrefs.calories} onChange={(e) => setPlanPrefs({ ...planPrefs, calories: e.target.value })} />
                </div>
              </div>
              <button onClick={generatePlan} disabled={planLoading} className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2" style={{ background: "#FFE28C", color: "#4a3e1f" }}>
                {planLoading ? <Spinner size={16} /> : null}
                {planLoading ? "Generating..." : "Generate Plan"}
              </button>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
              <h3 className="font-semibold mb-2" style={{ color: "#333" }}>Meal Plan</h3>
              {planLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse h-16 rounded-xl" style={{ background: "#FFF7F7" }} />
                  ))}
                </div>
              ) : planResult && planResult.length > 0 ? (
                <pre className="text-sm whitespace-pre-wrap" style={{ color: "#6b4a52" }}>{planResult.join("\n")}</pre>
              ) : (
                <div className="text-sm space-y-3" style={{ color: "#6b4a52" }}>
                  <div className="mx-auto w-24 h-24 rounded-full" style={{ background: "#FFE8EF" }} />
                  <div>No plan available yet. Try generating one!</div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <FormModal open={modalOpen} title={editing ? "Edit Recipe" : "Add Recipe"} onClose={() => setModalOpen(false)}>
        <form onSubmit={saveRecipe} className="space-y-3">
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Title</label>
            <input className="w-full rounded-lg border p-3 outline-none" style={{ borderColor: "#ffd6e0" }} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Ingredients</label>
            <InputChips value={formIngredients} onChange={setFormIngredients} placeholder="Add ingredient and press Enter" />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Steps</label>
            <textarea className="w-full rounded-lg border p-3 outline-none min-h-24" style={{ borderColor: "#ffd6e0" }} value={formSteps} onChange={(e) => setFormSteps(e.target.value)} />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg" style={{ background: "#FFF2F7", color: "#6b4a52" }}>Cancel</button>
            <button type="submit" disabled={Boolean(actionLoadingId)} className="px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2" style={{ background: "#B7EDC8", color: "#1f3a2c" }}>
              {actionLoadingId ? <Spinner size={16} /> : null}
              {editing ? (actionLoadingId ? "Saving..." : "Save") : (actionLoadingId ? "Adding..." : "Add")}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}


