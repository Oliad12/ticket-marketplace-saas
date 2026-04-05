import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  sub?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "teal";
  className?: string;
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color = "blue",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4",
        className
      )}
    >
      <div className={cn("p-3 rounded-xl flex-shrink-0", colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
