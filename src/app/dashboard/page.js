"use client"

import { useState } from "react";

export default function Dashboard() {
    const [showDialog, setShowDialog] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");

    async function handleCreateRoom(name, password) {
        try {
            const res = await fetch("/api/admin/createroom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.error || "Failed to create room");
                return;
            } else {
                setShowDialog(false)
            }

            const room = await res.json();
            console.log("Room created:", room);
            // router.push(`/quiz/${room.id}`);

        } catch (err) {
            console.error("Error creating room:", err);
            alert("Something went wrong. Try again.");
        }
    }


    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <button
                    className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setShowDialog(true)}
                >
                    Create Room
                </button>
            </div>

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Create Room</h2>

                        <input
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full border rounded-md px-3 text-gray-600 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Room Password/ID"
                            value={roomPassword}
                            onChange={(e) => setRoomPassword(e.target.value)}
                            className="w-full border text-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-md cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => setShowDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-md cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => handleCreateRoom(groupName, roomPassword)}
                            >
                                Create
                            </button>


                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
