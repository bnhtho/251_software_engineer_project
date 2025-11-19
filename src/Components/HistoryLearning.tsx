import { useState } from "react";
import { useUser } from "../Context/UserContext";
import { useEffect } from "react";
const HistoryLearning = () => {
  const { user, isLoading } = useUser();
  const [history, setHistory] = useState(null);
const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken") || "";

  // Hàm fetch API
  const fetchHistory = async () => {
    // try 
    try {
    const res = await fetch(`http://localhost:8081/students/history/${user?.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setHistory(data);
    }
    // Xử lý status
    catch(err){
        // catch error
        console.error("Lỗi khi fetch lịch sử học tập:", err);}
    finally {
        setLoading(false);
    }
}

//   Use effect để tự động gọi khi component mount
  useEffect(() => {
     fetchHistory();
   }, []);


  return (
    <div>
      <h2>Lịch sử học tập của {user?.firstName}</h2>

      {history && (
        <div>
          <h3>Kết quả API:</h3>
          <pre>{JSON.stringify(history, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HistoryLearning;
