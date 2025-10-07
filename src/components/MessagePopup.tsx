// components/MessagePopup.tsx
import React, { useEffect } from "react";

export type MessageType = "success" | "error" | "info" | "warning";

interface MessagePopupProps {
  message: string;
  type: MessageType;
  onClose: () => void;
  duration?: number;
}

const MessagePopup: React.FC<MessagePopupProps> = ({
  message,
  type,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`fixed top-2 right-4 ${getBgColor()} text-white px-6 py-4 rounded-md shadow-lg z-50 transition-all animate-fade-in`}
    >
      <div className="flex items-center justify-between">
        <span className="text-md">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default MessagePopup;