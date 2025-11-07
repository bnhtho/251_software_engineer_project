import { useUser } from '../../Context/UserContext';
import ViewMaterials from './ViewMaterials';
import UploadMaterials from './UploadMaterials';
import ApproveMaterials from './ApproveMaterials';

export default function Materials() {
    const { user } = useUser();

    // Admin thì hiển thị trang duyệt tài liệu
    if (user?.role === 'admin') {
        return <ApproveMaterials />;
    }

    // Tutor thì hiển thị form upload
    if (user?.role === 'tutor') {
        return <UploadMaterials />;
    }

    // Sinh viên xem danh sách
    return <ViewMaterials />;
}
