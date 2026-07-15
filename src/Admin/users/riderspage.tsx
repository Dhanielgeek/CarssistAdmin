// Admin/users/RidersPage.tsx

import RidersTable from "./riderstable";

export default function RidersPage() {
  return (
    <RidersTable
   
      selectedIds={new Set()}
      onToggleRow={() => {}}
      onToggleAll={() => {}}
      sort={{
        column: "name",
        direction: "asc",
      }}
      onSort={() => {}}
    />
  );
}