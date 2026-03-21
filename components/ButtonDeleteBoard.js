"use client";

import axios from "axios";
import { useRouter } from "next/navigation";


function ButtonDeleteBoard({ boardId }) {
    
    const router = useRouter();

    const handleDeleteBoard = async () => {
        try {
            await axios.delete(`/api/board?boardId=${boardId}`);
            router.replace("/dashboard");
        } catch (error) {
            console.log("Error deleting board:", error);
        }
    };
  return (
    <button className="btn btn-ghost" onClick={handleDeleteBoard}>ButtonDeleteBoard</button>
  )
}

export default ButtonDeleteBoard