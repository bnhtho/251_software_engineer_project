import { userList } from "./Data/user"

interface LearningHistoryItemProps {
  courseName: string
  instructor: string
  date: string
  duration: string
  status: string
  statusColor?: string
}

const LearningHistoryItem = ({
  
  courseName,
  instructor,
  date,
  duration,
  status,
  statusColor = "bg-gray-200 text-gray-800",
}: LearningHistoryItemProps) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {courseName}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {instructor}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {date}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {duration}
      </td>
      <td className="px-6 py-4">
        <span
          className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10 text-white " style={{ background: statusColor + "-A" }}
        >
        
          {status}
        </span>
      </td>
    </tr>
  );
};

export default LearningHistoryItem;
