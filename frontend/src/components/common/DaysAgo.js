
import { formatDistanceToNow } from "date-fns";

export function formatTimeAgo(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: false,
  });
}