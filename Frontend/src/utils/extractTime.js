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

  // Helper function to check if two dates are on the same calendar day
  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  // Format the time in 24-hour format
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Get the day of the week
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[lastSeenDate.getDay()];

  // Active if the user was last seen within the last 5 minutes
  if (timeDiff <= 5 * 60 * 1000) {
    return "Online";
  } else if (timeDiff <= 60 * 60 * 1000) {
    // Within the last hour
    return `Last active ${minutes} min ago`;
  } else if (isSameDay(now, lastSeenDate)) {
    // Same calendar day (today)
    return `Last seen today at ${formatTime(lastSeenDate)}`;
  } else if (
    now.getDate() - lastSeenDate.getDate() === 1 &&
    now.getMonth() === lastSeenDate.getMonth() &&
    now.getFullYear() === lastSeenDate.getFullYear()
  ) {
    // Previous day (yesterday)
    return `Last seen yesterday at ${formatTime(lastSeenDate)}`;
  } else if (days < 7) {
    // Within the last 7 days (show day of the week)
    return `Last seen on ${dayOfWeek} at ${formatTime(lastSeenDate)}`;
  } else {
    // Earlier dates
    return `Last seen on ${lastSeenDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}`;
  }
}
