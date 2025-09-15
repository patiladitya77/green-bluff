"use client";
import { useState } from "react";

export default function Quiz() {
    const question = {
        text: "What is 2 + 2? fvdjv feienvfdncdmslfj",
        options: [
            "1fnsjcnsoifjsns1f",
            "21fnsjcnsoifjsns",
            "1fnsjcnsoifjsns3",
            "41fnsjcnsoifjsns",
        ],
    };

    const [selected, setSelected] = useState(null);

    const handleSubmit = () => {
        if (selected !== null) {
            console.log("Selected Option:", question.options[selected]);
        } else {
            console.log("No option selected");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 -my-5">
            <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-full max-w-md p-6">
                {/* Question */}
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {question.text}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`w-full py-3 px-4 rounded-xl text-base transition ${selected === idx
                                    ? "bg-blue-600"
                                    : "bg-gray-800 hover:bg-gray-700"
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl text-base font-semibold transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
