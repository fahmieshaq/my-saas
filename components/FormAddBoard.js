"use client";

import axios from "axios";
import { useState } from "react";

function FormAddBoard() {
  const [myName, setMyName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await axios.post("/api/board", { myName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Create a new feedback board</p>
      <fieldset className="fieldset">
        <legend>Board Name</legend>
        <input
          type="text"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
          className="input input-bordered"
          placeholder="Future unicorn inc."
        />
      </fieldset>
      <button className="btn btn-primary" type="submit">
        Create Board
      </button>
    </form>
  );
}

export default FormAddBoard;
