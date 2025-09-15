"use client"
import { useState } from "react";
const AddQuestionDialog = ({ roomId, onClose, onQuestionAdded }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([""]); // start with 1 option
    const [correctAnswer, setCorrectAnswer] = useState("");

    // Add a new empty option
    const addOption = () => setOptions([...options, ""]);

    // Update option value
    const updateOption = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddQuestion = async () => {
        // validate
        if (!question || !correctAnswer || options.length === 0 || options.some(opt => !opt.trim())) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await fetch("/api/admin/addquestions/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId: Number(roomId),   // convert to integer
                    question,
                    options: options.map(opt => opt.trim()),  // remove spaces
                    correctAnswer: correctAnswer.trim(),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to add question");
                return;
            }

            const newQ = await res.json();
            onQuestionAdded(newQ);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg text-gray-600 font-semibold mb-4">Add Question</h2>

                <input
                    type="text"
                    placeholder="Question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border text-gray-600 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mb-3">
                    <label className="font-medium text-gray-600 mb-1 block">Options</label>
                    {options.map((opt, idx) => (
                        <input
                            key={idx}
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(idx, e.target.value)}
                            className="w-full border text-gray-600 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                    <button
                        type="button"
                        className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={addOption}
                    >
                        + Add Option
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Correct Answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mb-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 text-gray-600 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleAddQuestion}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );

}
export default AddQuestionDialog;

