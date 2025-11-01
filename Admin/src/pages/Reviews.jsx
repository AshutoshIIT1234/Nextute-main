import { useMemo, useState } from "react";
import Table from "../../../components/Table";
import SearchBar from "../../../components/SearchBar";
import Pagination from "../../../components/Pagination";
import ConfirmDialog from "../../../components/ConfirmDialog";

const dummyReviews = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  author: `User ${i + 1}`,
  rating: (i % 5) + 1,
  text: `This is review #${i + 1}`,
}));

export default function ReviewsList() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(
    () =>
      dummyReviews.filter(
        (r) =>
          r.text.toLowerCase().includes(q.toLowerCase()) ||
          r.author.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: "author", title: "Author" },
    { key: "rating", title: "Rating" },
    { key: "text", title: "Review" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchBar value={q} onChange={setQ} placeholder="Search reviews" />
        <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white">
          Add Review
        </button>
      </div>

      <Table
        columns={columns}
        data={pageData}
        renderActions={(row) => (
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border">Edit</button>
            <button
              className="px-3 py-1 rounded-lg bg-red-600 text-white"
              onClick={() => setToDelete(row)}
            >
              Delete
            </button>
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete review?"
        message={`This will remove review #${toDelete?.id}.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          setToDelete(null);
        }}
      />
    </div>
  );
}
