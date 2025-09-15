import React, { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react"; // for icons

const Toast = ({ message, duration, onClose }) => {
    const [progress, setProgress] = useState("100%");

    useEffect(() => {
        const t = setTimeout(() => {
            setProgress("0%");
        }, 50);

        const autoClose = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => {
            clearTimeout(t);
            clearTimeout(autoClose);
        };
    }, [duration, onClose]);

    return (
        <div className="toast toast-top toast-end">
            <div className="relative overflow-hidden bg-white text-gray-800 shadow-md rounded-md px-4 py-3 border border-gray-200 flex items-start gap-2 w-[320px]">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <span className="flex-1 text-sm">{message}</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                </button>
                <div
                    className="absolute bottom-0 left-0 h-1 bg-green-500 transition-[width] ease-linear"
                    style={{ width: progress, transitionDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

export default Toast;
