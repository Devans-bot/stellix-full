import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loading } from "../components/loading";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [rpins, setrpins] = useState([]);
  const [boards, setBoards] = useState([]);
 const [Loading,setLoading]=useState(false)
 const [error,setError]=useState(false)

 async function newboard(name, navigate) {
  try {
    const { data } = await axios.post("/api/boards/newboard", { name });
    return data.boardId
   
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to create board");
  }
}


  async function findpins(name) {
    try {
      const { data } = await axios.get("/api/boards/relatedpinsinboard", { name });
      setrpins(data); // or setrpins(data.pins) depending on API response
      console.log(data);
      if (data.message) toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pins");
    }
  }

  async function addPinsToBoard(boardName, pinIds) {
    try {
      const { data } = await axios.post("/api/boards/addpins/toboard", {
        boardName,
        pinIds
      });
      
      toast.success(data.message);

      // ✅ Update the state with the updated board
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === boardId ? data.board : board
        )
      );
    } catch (error) {
      console.error("Error adding pins to board:", error);
      toast.error(error.response?.data?.message || "Failed to add pins");
    }
  }

  

  return (
    <BoardContext.Provider value={{ findpins, newboard, rpins ,setrpins,addPinsToBoard}}>
      {children}
    </BoardContext.Provider>
  );
};

export const boarddata = () => useContext(BoardContext);
