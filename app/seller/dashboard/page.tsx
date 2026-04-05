import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SellerDashboardFull from "@/components/seller/SellerDashboardFull";

export default async function SellerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <SellerDashboardFull />;
}
