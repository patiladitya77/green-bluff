"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from '../components/Toast'; // make sure path is correct

export default function Home() {
  const router = useRouter();

  const [roomCode, setRoomCode] = useState("");
  const [roomId, setRoomId] = useState("");
  const [creatorCode, setCreatorCode] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: "", show: false });

  const handleCreatorLogin = () => {
    const isCodeTrue = process.env.NEXT_PUBLIC_CREATOR_CODE === creatorCode;
    if (isCodeTrue) {
      router.push("/dashboard");
    } else {
      // console.log("Invalid creator code");
      setToast({ message: "Invalid creator code", show: true });
    }
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      setToast({ message: "Please enter your team name", show: true });
      return;
    }

    setLoading(true);
    try {
      const resRooms = await fetch("/api/admin/getallrooms");
      const rooms = await resRooms.json();

      const room = rooms.find(
        (r) =>
          r.name.trim().toLowerCase() === roomId.trim().toLowerCase() &&
          r.password.trim() === roomCode.trim()
      );

      if (!room) {
        setToast({ message: "Invalid Room Name or Room Code", show: true });
        setLoading(false);
        return;
      }

      const resTeam = await fetch("/api/participant/createteam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: teamName.trim().toLowerCase(),
          roomId: room.id
        }),
      });


      const team = await resTeam.json();
      if (!team.id) {
        setToast({ message: "Failed to create/get team", show: true });
        setLoading(false);
        return;
      }

      setToast({ message: "Successfully joined the room!", show: true });

      router.push(
        `/quiz/${room.id}?teamId=${team.id}&teamName=${encodeURIComponent(team.name)}`
      );
    } catch (err) {
      // console.error(err);
      setToast({ message: "Something went wrong. Try again.", show: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Creator login dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Creator Login
            </h2>

            <input
              type="text"
              placeholder="Admin ID"
              className="w-full text-gray-600 border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCreatorId(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border text-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCreatorCode(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreatorLogin}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <p className="hidden md:block md:my-2 mx-2">Are you a creator?</p>
        <button
          className="hidden md:block bg-blue-600 text-white py-2 mx-2 rounded-md px-2 my-2 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Enter creator mode
        </button>
      </div>

      {/* Participant Join Form */}
      <div className="pt-[35%] md:pt-[10%] flex justify-center px-4">
        <form
          className="w-full max-w-sm md:w-1/2 bg-white rounded-md text-gray-600 grid grid-cols-12"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Enter Room name"
            className="m-4 p-1 text-md col-span-6"
            onChange={(e) => setRoomId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter room code"
            className="m-4 p-1 col-span-6"
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter your Team Name"
            className="m-4 p-4 col-span-12"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button
            className="bg-blue-600 rounded-lg text-white col-span-12 m-4 py-2 px-4 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </form>
      </div>

      {/* Toast on top-right */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={toast.message}
            duration={3000}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
    </div>
  );
}
