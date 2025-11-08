"use client";
import { BookOpen, Pencil, CheckCircle, List } from "lucide-react";

export const STATUS_DETAILS = {
  reading: { label: "Currently Reading" },
  want: { label: "Want to Read" },
  read: { label: "Finished Reading" },
};

const FILTERS = [
  { value: "all", label: "All", Icon: List },
  { value: "reading", label: STATUS_DETAILS.reading.label, Icon: BookOpen },
  { value: "want", label: STATUS_DETAILS.want.label, Icon: Pencil },
  { value: "read", label: STATUS_DETAILS.read.label, Icon: CheckCircle },
];

export default function FilterSection({ filter, setFilter, filterCounts }) {
  return (
    <section aria-labelledby="filter-heading" className="mb-8">
      <h2 id="filter-heading" className="sr-only">
        Filter books by status
      </h2>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {FILTERS.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full border backdrop-blur-md transition
              ${
                filter === value
                  ? "bg-white/20 border-white/50 text-white shadow"
                  : "bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10"
              }`}
          >
            <Icon className="inline h-4 w-4 mr-1" />
            {label} ({filterCounts[value]})
          </button>
        ))}
      </div>
    </section>
  );
}
