import { Outlet, useLocation } from "react-router-dom";
import SidePanel from "../components/SidePanel";
import Header from "../components/Header";

export default function AdminLayout() {
  const location = useLocation();
  const title = location.pathname.split("/").slice(-1)[0] || "dashboard";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="flex">
        <SidePanel />
        <main className="flex-1 min-h-screen ml-0 md:ml-64">
          <Header title={title} />
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
