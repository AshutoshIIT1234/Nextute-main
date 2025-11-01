import { useMemo, useState } from "react";
import Table from "../../../components/Table";
import SearchBar from "../../../components/SearchBar";
import Pagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const groups = ["CEO", "Founder", "Tech", "Marketing", "UI/UX"];
const dummyTeam = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  name: `Member ${i + 1}`,
  role: groups[i % groups.length],
  email: `m${i + 1}@nextute.com`,
}));

export default function TeamList() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      dummyTeam.filter(
        (m) =>
          m.name.toLowerCase().includes(q.toLowerCase()) ||
          m.role.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "name", title: "Name" },
    { key: "role", title: "Team" },
    { key: "email", title: "Email" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={q} onChange={setQ} placeholder="Search team" />
        <button
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
          onClick={() => navigate("/admin/team/new")}
        >
          Add Member
        </button>
      </div>

      <Table
        columns={columns}
        data={pageData}
        onRowClick={(row) => navigate(`/admin/team/${row.id}`)}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
