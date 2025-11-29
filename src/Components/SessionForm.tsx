import React from "react";
// 
import { useUser } from "../Context/UserContext";

const SessionForm = () => {
    // ------------------ Helper
    const { user } = useUser();
    console.log(user?.id)

    // const
    return (
        <>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Khoá học lựa chọn</label>
                    <input type="text" id="subject" placeholder="VD: Giải tích 1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Thời gian bắt đầu</label>
                    <input type="datetime-local" id="time" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                </div>
            </div>
            {/* sessionForm */}

        </>
    )
}

export default SessionForm