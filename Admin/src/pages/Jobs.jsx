import { useMemo, useState } from "react";
import Table from "../../../components/Table";
import SearchBar from "../../../components/SearchBar";
import Pagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const dummyJobs = Array.from({ length: 14 }).map((_, i) => ({
  id: String(i + 1),
  title: `Job ${i + 1}`,
  company: ["Nextute", "Innotech"][i % 2],
  location: ["Remote", "On-site"][i % 2],
}));

export default function JobsList() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      dummyJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q.toLowerCase()) ||
          j.company.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "title", title: "Title" },
    { key: "company", title: "Company" },
    { key: "location", title: "Location" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={q} onChange={setQ} placeholder="Search jobs" />
        <button
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
          onClick={() => navigate("/admin/job/new")}
        >
          Post Job
        </button>
      </div>

      <Table
        columns={columns}
        data={pageData}
        onRowClick={(row) => navigate(`/admin/job/${row.id}`)}
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
