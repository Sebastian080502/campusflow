import { STATUS_LABEL } from "../domain/labels";
import type { RequestStatus } from "../api/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>;
}
