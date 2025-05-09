"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import AddNoteModal from "../components/AddNoteModal";
import { ExpenseChart, IncomeChart } from "../components/Charts";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { NoteCard } from "../components/NoteCard";
import { CardSkeleton } from "../components/ui/LoadingSkeleton";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedNotes = localStorage.getItem("ai-notepad-notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("ai-notepad-notes", JSON.stringify(notes));
    }
  }, [notes, isClient]);

  const addNote = (text) => {
    const newNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    analyzeNote(newNote);
    setIsModalOpen(false);
  };

  const editNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const analyzeNote = async (note) => {
    setIsAnalyzing(true);
    try {
      const prompt = `
      Analyze this financial note and extract the following information in JSON format:
      {
        "totalExpenses": number, // sum of all spending
        "totalEarnings": number, // sum of all income
        "netSavings": number, // earnings minus expenses
        "expenseCategories": { // spending categories with amounts
          "category1": amount,
          "category2": amount
        },
        "incomeSources": { // income sources with amounts
          "source1": amount,
          "source2": amount
        },
        "trends": [ // array of spending/income trends
          "trend1",
          "trend2"
        ],
        "advice": "personalized financial advice"
      }

      Rules:
      1. Respond in the same language as the note (incuding advice and trends)
      2. Use only the specified JSON format
      3. Keep amounts as numbers without currency symbols
      4. Make advice practical and specific
      5. Include both expense categories and income sources

      Note to analyze:
      ${note.text}
      `;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: prompt }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const { analysis } = await response.json();

      setSelectedNote({
        ...note,
        analysis,
      });

      setNotes(notes.map((n) => (n.id === note.id ? { ...n, analysis } : n)));
    } catch (error) {
      alert("Failed to analyze note");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        {notes.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Get started by adding your first financial note. Click the button
              below to begin.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Add First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <NoteCard
                    note={note}
                    onDelete={deleteNote}
                    onAnalyze={analyzeNote}
                    onEdit={editNote}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Analysis Modal */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Financial Analysis
                  </h3>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 text-gray-700">
                      Original Note
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {selectedNote.text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${selectedNote.analysis?.totalExpenses || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Income</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${selectedNote.analysis?.totalEarnings || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Net Savings</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${selectedNote.analysis?.netSavings || 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-lg mb-4 text-gray-700">
                        Expense Breakdown
                      </h4>
                      <div className="h-64">
                        <ExpenseChart
                          categories={
                            selectedNote.analysis?.expenseCategories || {}
                          }
                        />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-lg mb-4 text-gray-700">
                        Income Sources
                      </h4>
                      <div className="h-64">
                        <IncomeChart
                          sources={selectedNote.analysis?.incomeSources || {}}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedNote.analysis?.trends && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-lg mb-3 text-gray-700">
                        Financial Trends
                      </h4>
                      <ul className="space-y-3">
                        {selectedNote.analysis.trends.map((trend, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full mt-0.5 flex-shrink-0 ${
                                trend.toLowerCase().includes("income")
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {trend.toLowerCase().includes("income")
                                ? "↑"
                                : "↓"}
                            </span>
                            <span>{trend}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedNote.analysis?.advice && (
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-semibold text-lg mb-2 text-gray-700">
                        Financial Advice
                      </h4>
                      <p className="text-gray-700">
                        {selectedNote.analysis.advice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedNote(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Note Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg z-40 transition-colors flex items-center justify-center"
      >
        {isAnalyzing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </motion.button>

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addNote}
      />

      <Footer />
    </div>
  );
}
