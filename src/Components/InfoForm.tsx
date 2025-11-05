interface InfoCardProps{
    firstName?: string;
    lastName?: string;
    studentId?: string;
    birthDate?: string;
    email?: string;
    phoneNumber?: string;
    bio?: string;
    onSave?: (data:any) => void;
    onCancel?: () => void;
}


// InfoCard component
const InfoForm = ({

    // Tự truyền vào
    // name = ""
    firstName="Test",
    lastName="User",
    studentId="123456",
    birthDate="19/05/2000",
    email="testuser@gmail.com",
    phoneNumber="0841234567",
    bio="Hello! I'm a test user.",
    onSave,
    onCancel,
 }: InfoCardProps) => { 
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin chi tiết</h2>

      <div className="space-y-4 mb-6">
        {/* Ho và tên đệm, Tên */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Họ và tên đệm</label>
            <input
              type="text"
              defaultValue={firstName}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tên</label>
            <input
              type="text"
              defaultValue={lastName}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* MSSV, Ngày sinh */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">MSSV</label>
            <input
              type="text"
              defaultValue={studentId}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Ngày sinh</label>
            <input
              type="text"
              defaultValue={birthDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email, Số điện thoại */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              defaultValue={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
            <input
              type="tel"
              defaultValue={phoneNumber}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Giới thiệu bản thân</label>
          <textarea
            defaultValue={bio}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Hủy
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Lưu thay đổi
        </button>
      </div>
      </div>
    )
 }

 export default InfoForm;