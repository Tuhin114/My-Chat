export function extractTime(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number.toString().padStart(2, "0");
}

export function formatLastSeen(lastSeenTime) {
  const now = new Date();
  const lastSeenDate = new Date(lastSeenTime);

  const timeDiff = now - lastSeenDate; // Difference in milliseconds
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Format the time in 24-hour format
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Active if the user was last seen within the last 5 minutes
  if (timeDiff <= 5 * 60 * 1000) {
    return "Online";
  } else if (timeDiff <= 60 * 60 * 1000) {
    // Within the last hour
    return `Last active ${minutes} min ago`;
  } else if (days === 0) {
    // Same day (today)
    return `Last seen today at ${formatTime(lastSeenDate)}`;
  } else if (days === 1) {
    // Yesterday
    return "Last seen yesterday";
  } else {
    // Earlier dates
    return `Last seen on ${lastSeenDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}`;
  }
}
