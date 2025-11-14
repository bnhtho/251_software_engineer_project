// Định nghĩa kiểu dữ liệu cho User
// Import file này vào trước 
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Component Badge chung, tái sử dụng cho Role và Status
interface BadgeProps {
  text: string;
  colorClass: string;
}

const Badge = ({ text, colorClass }: BadgeProps) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}>
    {text}
  </span>
);

// RoleBadge
export const RoleBadge = ({ role }: { role: string }) => (
  <Badge text={role} colorClass="bg-blue-50 text-blue-600" />
);

// StatusBadge
export const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "Hoạt động";
  return (
    <Badge
      text={status}
      colorClass={isActive ? "bg-emerald-50 text-emerald-600 font-semibold" : "bg-gray-100 text-gray-500 font-semibold"}
    />
  );
};

// Avatar component
interface AvatarProps {
  name: string;
}

const Avatar = ({ name }: AvatarProps) => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-semibold text-white">
    {name.charAt(0)}
  </div>
);

// User info component
interface UserInfoProps {
  name: string;
  email: string;
}

const UserInfo = ({ name, email }: UserInfoProps) => (
  <div>
    <p className="font-medium text-gray-900">{name}</p>
    <p className="text-xs text-gray-500">{email}</p>
  </div>
);

// Action buttons component
const ActionButtons = () => (
  <div className="ml-auto flex items-center gap-3 text-blue-500">
    <button className="rounded-lg border border-blue-100 px-3 py-1 text-xs font-medium transition-colors hover:bg-blue-50">
      Chỉnh sửa
    </button>
    <button className="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
      Xóa
    </button>
  </div>
);

// Main UserRow component
interface UserRowProps {
  user: User;
}

export const UserRow = ({ user }: UserRowProps) => (
  <div className="flex flex-wrap items-center gap-3 px-6 py-4 text-sm text-gray-600">
    <div className="flex min-w-[200px] flex-1 items-center gap-3">
      <Avatar name={user.name} />
      <UserInfo name={user.name} email={user.email} />
    </div>

    <RoleBadge role={user.role} />
    <StatusBadge status={user.status} />

    <ActionButtons />
  </div>
);
