"use client";

export default function SearchSuggestions({ suggestions, isSuggesting, onSelect }) {
  if (suggestions.length === 0 || isSuggesting) return null;

  return (
    <ul className="hidden md:block absolute left-0 right-0 z-50 mt-2 bg-[#0f1629]/95 border border-white/10 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden max-h-60 sm:max-h-72 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/20">
      {suggestions.map((s, i) => (
        <li
          key={i}
          tabIndex={0}
          className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:outline-none active:bg-white/15 transition-colors text-white min-h-[56px]"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(s.title);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSelect(s.title);
          }}
        >
          {s.cover ? (
            <img 
              src={s.cover} 
              className="w-7 h-9 sm:w-8 sm:h-10 rounded object-cover flex-shrink-0" 
              alt={s.title} 
            />
          ) : (
            <div className="w-7 h-9 sm:w-8 sm:h-10 rounded bg-white/10 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-xs sm:text-sm truncate sm:whitespace-normal sm:line-clamp-2">{s.title}</p>
            <p className="text-[10px] sm:text-xs text-white/60 truncate">{s.author}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
