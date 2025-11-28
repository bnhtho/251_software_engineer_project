// Helper functions for date manipulation (outside the main component)

// Tìm ngày bắt đầu của tuần hiện tại (Thứ 2)
const getWeekStart = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Thứ 2 là 1, Chủ nhật là 0
  return new Date(date.getFullYear(), date.getMonth(), diff);
};

// Định dạng Date object thành DD/MM/YYYY
const formatDateForDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Định dạng Date object thành YYYY-MM-DD (cho API)
const formatDateForApi = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// Chuyển DD/MM/YYYY string thành Date object
const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Lưu ý: month - 1 vì tháng trong JS bắt đầu từ 0
  return new Date(year, month - 1, day);
};