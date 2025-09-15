"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddQuestionDialog from "../../../../components/AddQuestionDialog";

export default function RoomDashboard() {
    const params = useParams();
    const roomId = params.id;

    const [showDialog, setShowDialog] = useState(false);
    const [questionsData, setQuestionsData] = useState([]);

    const handleQuestionAdded = (q) => {
        setQuestionsData([...questionsData, { ...q, responses: [] }]);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/getroomdata?roomId=${roomId}`);
                const data = await res.json();
                setQuestionsData(data);
            } catch (err) {
                console.error("Error fetching room data:", err);
            }
        }
        fetchData();
    }, [roomId]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Room {roomId}</h1>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                onClick={() => setShowDialog(true)}
            >
                Add Question
            </button>
            <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mb-4 ml-2"
                onClick={async () => {
                    if (!confirm("Are you sure you want to delete this room? This will remove all questions and responses.")) {
                        return;
                    }
                    try {
                        const res = await fetch(`/api/admin/deleteroom?roomId=${roomId}`, {
                            method: "DELETE",
                        });
                        if (res.ok) {
                            alert("Room deleted successfully!");
                            window.location.href = "/"; // redirect to home/dashboard
                        } else {
                            const err = await res.json().catch(() => ({})); // avoid JSON parse error
                            alert("Error deleting room: " + (err.message || "Unknown error"));
                        }
                    } catch (error) {
                        console.error("Error deleting room:", error);
                        alert("Something went wrong.");
                    }
                }}

            >
                Delete Room
            </button>


            {showDialog && (
                <AddQuestionDialog
                    roomId={roomId}
                    onClose={() => setShowDialog(false)}
                    onQuestionAdded={handleQuestionAdded}
                />
            )}

            <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-gray-900 text-white border border-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 border border-gray-700">Question</th>
                            <th className="px-4 py-2 border border-gray-700">Team Name</th>
                            <th className="px-4 py-2 border border-gray-700">Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionsData.map((q) => {
                            if (!q.responses || q.responses.length === 0) {
                                return (
                                    <tr key={q.id} className="hover:bg-gray-800">
                                        <td className="px-4 py-2 border border-gray-700">{q.question}</td>
                                        <td className="px-4 py-2 border border-gray-700" colSpan={2}>
                                            No responses yet
                                        </td>
                                    </tr>
                                );
                            }

                            return q.responses.map((resp, idx) => (
                                <tr key={`${q.id}-${idx}`} className="hover:bg-gray-800">
                                    {idx === 0 && (
                                        <td
                                            className="px-4 py-2 border border-gray-700"
                                            rowSpan={q.responses.length}
                                        >
                                            {q.question}
                                        </td>
                                    )}
                                    <td className="px-4 py-2 border border-gray-700">{resp.teamName}</td>
                                    <td className="px-4 py-2 border border-gray-700">{resp.answerGiven}</td>
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
