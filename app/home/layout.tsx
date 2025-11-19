import Sidebar from "@/components/sidebar/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
     
      <Sidebar />

      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
