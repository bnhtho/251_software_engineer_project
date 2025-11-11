import { UserRow} from "../../Components/UserList";
import { userList } from "../../Components/Data/user";
const AdminUsers = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
      <p className="mt-2 text-sm text-gray-500">
        Danh sách người dùng hiện tại.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {userList.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
