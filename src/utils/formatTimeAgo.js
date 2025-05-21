/**
 * formatTimeAgo.js
 * Loaf Life – Formats a timestamp into a human-readable "time ago" string.
 *
 * This utility function takes a date/timestamp as input and returns a string
 * representing how long ago that time was from the present (e.g., "5m ago",
 * "3h ago", "2d ago"). It handles various time units from seconds to years.
 *
 * Features:
 * - Converts timestamps to relative time strings (e.g., "10m ago").
 * - Supports various time units: seconds, minutes, hours, days, weeks,
 *   months, and years.
 * - Returns "N/A" for invalid or missing timestamps.
 *
 * @author Nathan Oloresisimo
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  const diffInMonths = Math.floor(diffInDays / 30); // Approximate
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  const diffInYears = Math.floor(diffInDays / 365); // Approximate
  return `${diffInYears}y ago`;
}; 