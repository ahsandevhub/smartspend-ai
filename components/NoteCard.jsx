import { Calendar, ChartPie, Check, Clock, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ProgressBar } from "./ui/ProgressBar";

export const NoteCard = ({ note, onDelete, onAnalyze, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onEdit(note.id, editedText);
    setIsEditing(false);
  };

  // Format date and time
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(note.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition-shadow h-full flex flex-col">
      {/* Colored Header */}
      <div
        className={`bg-gradient-to-r ${
          note.analysis
            ? "from-green-500 to-emerald-600"
            : "from-gray-500 to-gray-600"
        } p-3 text-white`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-grow">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm"
            rows="4"
            autoFocus
          />
        ) : (
          <div>
            <p
              className={`text-gray-700 text-sm ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {note.text}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3 pt-2 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {/* <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
              >
              <Eye size={16} />
              </button> */}

            <button
              onClick={() => onAnalyze(note)}
              className="p-2 text-indigo-500 hover:text-indigo-700 rounded-md hover:bg-indigo-50 transition-colors"
              title="Analyze"
            >
              <ChartPie size={16} />
            </button>

            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 text-green-500 hover:text-green-700 rounded-md hover:bg-green-50 transition-colors"
                title="Save"
              >
                <Check size={15} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-500 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          <div className="flex space-x-1">
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {note.analysis && (
        <div className="px-4 pb-3">
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div>
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Income</span>
                <span>
                  ৳{note.analysis.totalEarnings?.toLocaleString() || 0}
                </span>
              </div>
              <ProgressBar
                value={note.analysis.totalEarnings}
                max={note.analysis.totalEarnings + note.analysis.totalExpenses}
                color="green"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Expenses</span>
                <span>
                  ৳{note.analysis.totalExpenses?.toLocaleString() || 0}
                </span>
              </div>
              <ProgressBar
                value={note.analysis.totalExpenses}
                max={note.analysis.totalEarnings + note.analysis.totalExpenses}
                color="red"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
