"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";

export default function AddNoteModal({ isOpen, onClose, onSave, isLoading }) {
  const [text, setText] = useState("");

  const handleSave = async () => {
    if (!text.trim()) return;

    try {
      await onSave(text);
      setText("");
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
      // Optionally show error to user
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          {/* Backdrop with subtle blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Modal card */}
            <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10">
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-5">
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    New Financial Note
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="mb-4">
                  <label
                    htmlFor="note-textarea"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Record your financial transaction
                  </label>
                  <textarea
                    id="note-textarea"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Example: Spent $50 on groceries today, earned $200 from freelance work..."
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Tip: Be specific with amounts and categories for better
                    analysis.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 bg-gray-50 px-5 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!text.trim() || isLoading}
                  className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:hover:bg-indigo-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
