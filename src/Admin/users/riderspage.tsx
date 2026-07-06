// Admin/users/RidersPage.tsx
import {riders} from '../../data/riderdata'
import RidersTable from "./riderstable";

export default function RidersPage() {
  return (
    <RidersTable
      riders={riders}
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