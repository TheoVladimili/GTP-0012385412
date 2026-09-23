import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#191c20] flex">
      <Sidebar />
      <div className="pl-64 flex-1 flex flex-col min-w-0">
        <Header />
        <main className="w-full pt-16 px-6 pb-12 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
