import { BarChart2, Check, Edit2, Eye, Trash2 } from "lucide-react";
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3"
            rows="4"
          />
        ) : (
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              {note.analysis && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Analyzed
                </span>
              )}
            </div>
            <p className={`text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}>
              {note.text}
            </p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <Eye size={16} />
          </button>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-500 hover:text-green-700 rounded-full hover:bg-green-100"
              title="Save"
            >
              <Check size={16} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onAnalyze(note)}
            className="p-2 text-indigo-500 hover:text-indigo-700 rounded-full hover:bg-indigo-100"
            title="Analyze"
          >
            <BarChart2 size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {note.analysis && (
        <div className="px-5 pb-3">
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs mb-1">
              <span>Income</span>
              <span>${note.analysis.totalEarnings || 0}</span>
            </div>
            <ProgressBar
              value={note.analysis.totalEarnings}
              max={note.analysis.totalEarnings + note.analysis.totalExpenses}
              color="green"
            />

            <div className="flex justify-between text-xs mt-3 mb-1">
              <span>Expenses</span>
              <span>${note.analysis.totalExpenses || 0}</span>
            </div>
            <ProgressBar
              value={note.analysis.totalExpenses}
              max={note.analysis.totalEarnings + note.analysis.totalExpenses}
              color="red"
            />
          </div>
        </div>
      )}
    </div>
  );
};
