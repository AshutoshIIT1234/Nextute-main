import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../Navbar";
import SidePanel from "./SidePanel";

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/admin/all`);
        const data = await res.json();
        setAdmins(data.admins || []);
      } catch (err) {
        toast.error("Failed to fetch admins");
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [apiUrl]);

  // const handleDelete = async (email) => {
  //   if (!window.confirm("Are you sure you want to delete this admin?")) return;
  //   try {
  //     const res = await fetch(`${apiUrl}/api/admin/${email}`, {
  //       method: "DELETE",
  //     });
  //     if (!res.ok) throw new Error("Failed to delete admin");
  //     setAdmins((prev) => prev.filter((a) => a.email !== email));
  //     toast.success("Admin deleted successfully!");
  //   } catch (err) {
  //     toast.error("Failed to delete admin");
  //   }
  // };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <SidePanel />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto"
        >
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#144E53] mb-6">All Admins</h1>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full text-left bg-white rounded-xl shadow-md">
              <thead>
                <tr className="text-[#144E53] border-b border-[#2D7A66]/20">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Created At</th>
                  {/* <th className="p-3">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.email} className="border-b border-[#2D7A66]/10">
                    <td className="p-3">{admin.name || '-'}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{new Date(admin.created_at || admin.createdAt).toLocaleString()}</td>
                    {/* <td className="p-3">
                      <button
                        onClick={() => handleDelete(admin.email)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AllAdmins;
