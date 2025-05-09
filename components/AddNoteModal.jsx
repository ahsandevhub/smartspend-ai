"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function AddNoteModal({ isOpen, onClose, onSave }) {
  const [text, setText] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add New Note</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                className="w-full border rounded p-3 min-h-[150px]"
                placeholder="Type your note here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => {
                  onSave(text);
                  setText("");
                }}
                className="bg-secondary text-white px-4 py-2 rounded hover:bg-teal-700"
              >
                Save Note
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
