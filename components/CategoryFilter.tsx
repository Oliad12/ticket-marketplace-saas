"use client";

const CATEGORIES = [
  { value: "all", label: "All Events", emoji: "🎪" },
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "sports", label: "Sports", emoji: "⚽" },
  { value: "comedy", label: "Comedy", emoji: "😂" },
  { value: "theatre", label: "Theatre", emoji: "🎭" },
  { value: "conference", label: "Conference", emoji: "🎤" },
  { value: "festival", label: "Festival", emoji: "🎉" },
  { value: "other", label: "Other", emoji: "📌" },
];

export default function CategoryFilter({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selected === cat.value
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
