import { useUser } from "../../../Context/UserContext";
import ViewMaterials from "./ViewMaterials";
import UploadMaterials from "./UploadMaterials";
import ApproveMaterials from "./ApproveMaterials";

export default function Materials() {
  const { user } = useUser();

  if (user?.role === "admin") {
    return <ApproveMaterials />;
  }

  if (user?.role === "tutor") {
    return <UploadMaterials />;
  }

  return <ViewMaterials />;
}

