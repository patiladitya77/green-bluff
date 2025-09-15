
"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [roomCode, setRoomCode] = useState("");
  const [roomId, setRoomId] = useState("");
  const [creatorCode, setCreatorCode] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const handleCreatorLogin = () => {
    console.log("button clicked")
    const isCodeTrue = process.env.NEXT_PUBLIC_CREATOR_CODE === creatorCode;
    if (isCodeTrue) {
      router.push("/dashboard");
    } else {
      console.log("eror occured")
    }
  }
  const handleSubmit = async () => {
    try {
      console.log("Submitted Room Name:", `"${roomId}"`);
      console.log("Submitted Room Code:", `"${roomCode}"`);

      const res = await fetch("/api/admin/getallrooms");
      const rooms = await res.json();
      console.log("Rooms from API:", rooms);

      // Match by name and password
      const room = rooms.find(
        (r) =>
          r.name.trim().toLowerCase() === roomId.trim().toLowerCase() && // match name
          r.password.trim() === roomCode.trim()                            // match password
      );

      console.log("Matched Room:", room);

      if (room) {
        router.push(`/quiz/${room.id}`); // redirect to that room's page
      } else {
        alert("Invalid Room Name or Room Code");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };





  return (
    <div className="">
      {showDialog && <div>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Creator Login</h2>

            <input
              type="text"
              placeholder="Admin ID"
              className="w-full text-gray-600 border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setCreatorId(e.target.value)}

            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border text-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setCreatorCode(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreatorLogin}>
                Submit
              </button>
            </div>
          </div>
        </div>


      </div>}
      <div className="flex justify-between">
        <p className="my-2 mx-2">Are you a creater?</p>
        <button className="bg-blue-600 rounded-md px-2 my-2 cursor-pointer text-black" onClick={() => setShowDialog(true)}>Enter creator mode</button>
      </div>
      <div className="pt-[35%] md:pt-[10%] flex justify-center">
        <form
          className="w-full md:w-1/2 bg-white rounded-md text-gray-600 grid grid-cols-12"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* ID Input */}
          <input
            type="text"
            placeholder="Enter your ID"
            className="m-4 p-4 col-span-6"
            onChange={(e) => setRoomId(e.target.value)}
          />

          {/* Room Code Input */}
          <input
            type="text"
            placeholder="Enter room code"
            className="m-4 p-4 col-span-6"
            onChange={(e) => setRoomCode(e.target.value)}
          />

          {/* Join Button */}
          <button
            className="bg-blue-600 rounded-lg text-white col-span-12 m-4 py-2 px-4"
            onClick={handleSubmit}
          >
            Join
          </button>
        </form>
      </div>

    </div>
  );
}
