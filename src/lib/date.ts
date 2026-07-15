const vietnameseDateFormat = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatVietnameseDate(date: Date) {
  return vietnameseDateFormat.format(date);
}
