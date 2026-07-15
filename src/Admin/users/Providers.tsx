import { useState } from "react";
import type { Rider, SortState } from "../../types/rider";
import { riders } from "../../data/riderdata";
import RidersTable from "./riderstable";

const Providers = () => {
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  const [sort, setSort] = useState<SortState>({
    column: "name",
    direction: "asc",
  });

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleToggleAll = () => {
    if (selectedIds.size === riders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(riders.map((r) => r.id)));
    }
  };

  const handleSort = (column: keyof Rider) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <RidersTable
   
      selectedIds={selectedIds}
      onToggleRow={handleToggleRow}
      onToggleAll={handleToggleAll}
      sort={sort}
      onSort={handleSort}
      title="All Chauffeur Riders"
      description="All Chauffeur riders providing transportation services."
      ridesMode
    />
  );
};

export default Providers;