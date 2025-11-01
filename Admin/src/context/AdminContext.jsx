import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  const logout = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setAdmin(null);
    toast.success("Logged out");
  };

  const value = useMemo(() => ({ admin, setAdmin, logout }), [admin]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
export { AdminContext };