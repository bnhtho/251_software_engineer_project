interface LearningHistoryItemProps {
  courseName: string
  instructor: string
  date: string
  duration: string
  status: string
  statusColor?: string
}

const LearningHistoryItem =({
  courseName,
  instructor,
  date,
  duration,
  status,
  statusColor = "bg-gray-200 text-gray-800",
}: LearningHistoryItemProps) => {
  return (
    <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
        <p className="text-sm text-gray-600">Giảng viên: {instructor}</p>
        <p className="text-sm text-gray-600">Ngày học: {date}</p>
        <p className="text-sm text-gray-600">Thời lượng: {duration}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
      >
        {status}
      </span>
    </div>);
}
export default LearningHistoryItem;
