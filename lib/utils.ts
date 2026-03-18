import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useStorageUrl(storageId: Id<"_storage"> | undefined) {
  return useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");
}

export function formatPrice(
  price: number,
  currency?: string | null
): string {
  const c = currency ?? "etb";
  if (c === "etb") return `ETB ${price.toFixed(2)}`;
  if (c === "usd") return `$${price.toFixed(2)}`;
  return `£${price.toFixed(2)}`;
}
