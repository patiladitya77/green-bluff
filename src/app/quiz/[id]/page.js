"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function Quiz() {
    const params = useParams();
    const roomId = params.id;
    const [question, setQuestion] = useState(null);
    const [selected, setSelected] = useState(null);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [waitMessage, setWaitMessage] = useState(false);
    const searchParams = useSearchParams();
    const [submitting, setSubmitting] = useState(false);


    const teamId = searchParams.get("teamId");
    const teamName = searchParams.get("teamName");
    console.log(teamName)

    const fetchQuestion = async (qIndex) => {
        if (!roomId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/participant/getnextquestion?roomId=${roomId}&teamId=${teamId}`);
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setQuestion(data);
                    setWaitMessage(false);
                } else {
                    setQuestion(null);
                    setWaitMessage(true);
                }
            } else if (res.status === 404) {
                setQuestion(null);
                setWaitMessage(true);
            } else {
                console.error("Error fetching question");
            }
        } catch (err) {
            console.error("API fetch error:", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchQuestion(index);

        const interval = setInterval(() => {
            if (waitMessage) {
                fetchQuestion(index);
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [index, waitMessage, roomId]);




    const handleSubmit = async () => {
        if (selected === null) {
            console.log("No option selected");
            return;
        }

        setSubmitting(true);
        try {
            const answerGiven = question.options[selected];

            const res = await fetch("/api/participant/submitanswer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    roomId,
                    questionId: question.id,
                    teamName,
                    answerGiven,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Submit error:", err.error);
                return;
            }

            const data = await res.json();
            console.log("Answer submitted:", data);

            setSelected(null);
            setIndex((prev) => prev + 1);
        } catch (err) {
            console.error("Error submitting answer:", err);
        } finally {
            setSubmitting(false);
        }
    };



    // const handleNext = () => {
    //     setNexting(true);
    //     setTimeout(() => {
    //         setSelected(null);
    //         setIndex((prev) => prev + 1);
    //         setNexting(false);
    //     }, 500); // just simulate small delay
    // };


    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col">
                {loading && <p className="text-center text-gray-400 mb-4">Loading...</p>}

                {waitMessage && (
                    <p className="text-center text-yellow-400 mb-4">
                        Wait for host to create question
                    </p>
                )}

                {question && (
                    <>
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
                            {question.question}
                        </h2>
                        <div className="space-y-3 mb-4">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelected(idx)}
                                    className={`w-full py-3 px-4 rounded-xl text-base transition text-left ${selected === idx
                                        ? "bg-blue-600"
                                        : "bg-gray-800 hover:bg-gray-700"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`flex-1 cursor-pointer py-3 rounded-xl text-base font-semibold transition 
            ${submitting ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}
        `}
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>

                            {/* <button
                                onClick={handleNext}
                                disabled={nexting}
                                className={`flex-1 py-3 rounded-xl text-base font-semibold transition 
            ${nexting ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}
        `}
                            >
                                {nexting ? "Loading..." : "Next"}
                            </button> */}
                        </div>

                    </>
                )}
            </div>
        </div>
    );
}
