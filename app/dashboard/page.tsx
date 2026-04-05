import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import UserDashboard from "@/components/dashboard/UserDashboard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <UserDashboard />;
}
