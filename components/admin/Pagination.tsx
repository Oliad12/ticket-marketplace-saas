"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisible = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const visible = getVisible();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
      <p className="text-xs text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {visible[0] > 1 && (
          <>
            <button onClick={() => onChange(1)} className="w-8 h-8 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">1</button>
            {visible[0] > 2 && <span className="px-1 text-gray-400 text-xs">…</span>}
          </>
        )}

        {visible.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "w-8 h-8 rounded-lg border text-xs font-medium transition-colors",
              p === page
                ? "bg-[#026CDF] border-[#026CDF] text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {p}
          </button>
        ))}

        {visible[visible.length - 1] < totalPages && (
          <>
            {visible[visible.length - 1] < totalPages - 1 && <span className="px-1 text-gray-400 text-xs">…</span>}
            <button onClick={() => onChange(totalPages)} className="w-8 h-8 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
