"use client";

export default function TabNavigation({ tabs, current, onChange }) {
  return (
    <div className="flex gap-2 p-1 rounded-xl" style={{ background: "#fff2f7", border: "1px solid #ffd6e5" }}>
      {tabs.map((tab) => {
        const active = current === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition"
            style={{
              background: active ? "#FFB3C7" : "transparent",
              color: active ? "#40282c" : "#6b4a52",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}


