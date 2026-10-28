import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Header />

        <main className="p-8">
          {children}
        </main>
      </div>

    </div>
  );
}