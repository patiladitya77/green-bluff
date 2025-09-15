"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // <-- import this
import AddQuestionDialog from "../../../../components/AddQuestionDialog";

export default function RoomDashboard() {
    const params = useParams(); // returns an object of route params
    const roomId = params.id;   // 'id' comes from [id] in folder name

    console.log(roomId); // now it will log correctly
    const [showDialog, setShowDialog] = useState(false);
    const [questions, setQuestions] = useState([]);

    const handleQuestionAdded = (q) => {
        setQuestions([...questions, q]);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Room {roomId}</h1>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                onClick={() => setShowDialog(true)}
            >
                Add Question
            </button>

            {showDialog && (
                <AddQuestionDialog
                    roomId={roomId}
                    onClose={() => setShowDialog(false)}
                    onQuestionAdded={handleQuestionAdded}
                />
            )}

            <div>
                {questions.map((q, idx) => (
                    <div key={idx} className="border p-3 rounded mb-2">
                        <p className="font-semibold">{q.question}</p>
                        <ul className="list-disc list-inside">
                            {Array.isArray(q.options) && q.options.map((opt, i) => (
                                <li key={i}>{opt}</li>
                            ))}
                        </ul>
                        <p className="text-green-600">Correct Answer: {q.correctAnswer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
