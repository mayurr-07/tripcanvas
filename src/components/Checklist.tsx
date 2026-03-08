import { CheckSquare2, Plus } from "lucide-react";
import { useState } from "react";
import type { ChecklistItem } from "../types/app";
import { cn } from "../utils/cn";

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle: (itemId: string) => void;
  onAddItem: (label: string) => void;
}

export function Checklist({ items, onToggle, onAddItem }: ChecklistProps) {
  const [label, setLabel] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!label.trim()) {
      return;
    }

    onAddItem(label.trim());
    setLabel("");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
          <CheckSquare2 className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Packing checklist</h3>
          <p className="text-sm text-slate-500">Keep essentials shared across the group.</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition",
              item.packed ? "bg-[var(--accent)]/12 text-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            )}
          >
            <span>{item.label}</span>
            <span className={cn("text-xs font-semibold", item.packed ? "text-[var(--accent)]" : "text-slate-400")}>{item.packed ? "Packed" : "Pending"}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Add checklist item"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
        />
        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
    </section>
  );
}