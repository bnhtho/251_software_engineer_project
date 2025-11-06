import { useUser } from "../Context/UserContext";

// Props
interface AnnouncementCardProps {
  title?: string;
  annouceList: Array<{
    title: string;
    content: string;
  }>;
  viewAllText?: string;
}

const AnnouncementCard = ({
  title = "Thông báo",
  viewAllText = "Xem tất cả",
  annouceList,
}: AnnouncementCardProps) => {
  const { user } = useUser();
  const userID = user?.id;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
          onClick={() => {
            if (userID) {
              window.location.href = `${userID}/schedule`;
            }
          }}
        >
          {viewAllText}
        </button>
      </div>

      <div className="space-y-4">
        {annouceList.map((announcement, idx) => (
          <div key={idx}>
            <h4 className="font-semibold text-gray-900 mb-1">{announcement.title}</h4>
            <p className="text-sm text-gray-600">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementCard;
