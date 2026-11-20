
import type { RequestStatus } from "../types";

interface StatusBadgeProps {
  status: RequestStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
