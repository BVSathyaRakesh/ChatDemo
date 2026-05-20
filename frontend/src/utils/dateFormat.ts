export const formatMessageTime = (dateString: string): string => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // If today, show time (e.g., "2:45 PM")
  if (diffInDays < 1 && now.getDate() === messageDate.getDate()) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // If yesterday
  if (diffInDays < 2 && now.getDate() - messageDate.getDate() === 1) {
    return 'Yesterday';
  }

  // If within this week, show day name (e.g., "Monday")
  if (diffInDays < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Otherwise, show month and day (e.g., "Jun 20")
  const month = messageDate.toLocaleDateString('en-US', { month: 'short' });
  const day = messageDate.getDate();
  return `${month} ${day}`;
};
