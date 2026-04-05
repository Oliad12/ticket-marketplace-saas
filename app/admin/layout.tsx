import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { SidebarProvider } from "@/components/admin/SidebarContext";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ??
    (await currentUser())?.publicMetadata?.role;

  if (role !== "admin") redirect("/");

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-100 overflow-hidden">
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
