import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="md:ml-64 min-h-screen transition-all duration-300">
                <div className="p-4 mx-auto">{children}</div>
            </main>
        </div>
    );
}
