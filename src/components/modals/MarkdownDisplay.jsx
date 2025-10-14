"use client"
import ReactMarkdown from "react-markdown";

export default function MarkdownDisplay({recipeIngredients}) {

  return (
    <div className="p-6">
<ReactMarkdown>{recipeIngredients.join("\n\n")}</ReactMarkdown>
    </div>
  );
}
