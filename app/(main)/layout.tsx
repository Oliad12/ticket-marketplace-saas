import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SyncUserWithConvex />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
