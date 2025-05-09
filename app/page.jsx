"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart2,
  CheckCircle,
  Clock,
  Loader2,
  PiggyBank,
  Plus,
  Scale,
  ShoppingCart,
  Wallet,
  X,
} from "lucide-react";
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

  const addNote = async (text) => {
    const newNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };

    // Add note optimistically
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setIsModalOpen(false);
    setIsAnalyzing(true);

    // Set the new note as selected before analyzing
    setSelectedNote(newNote);

    try {
      // Analyze the note immediately after adding
      await analyzeNote(newNote);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Optionally show error to user
    } finally {
      setIsAnalyzing(false);
    }

    return newNote;
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
    if (!note.text.trim()) return; // Skip empty notes

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

      // Create updated note with analysis
      const updatedNote = { ...note, analysis };

      // Always set the selected note
      setSelectedNote(updatedNote);

      // Update notes list
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === note.id ? updatedNote : n))
      );

      return analysis;
    } catch (error) {
      console.error("Analysis error:", error);
      // Even if analysis fails, keep the note selected
      setSelectedNote(note);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    <div className="min-h-screen flex flex-col bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] bg-gray-50">
      <Header setIsModalOpen={setIsModalOpen} />

      <main className="relative flex-grow container mx-auto px-3 md:px-6 py-5 max-w-7xl">
        {isAnalyzing && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <div className="flex justify-center mb-6">
                <div className="relative h-16 w-16">
                  {/* Animated circles */}
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-2 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                  <BarChart2 className="absolute inset-3 h-10 w-10 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Analyzing Your Transaction
              </h3>
              <p className="text-gray-600 mb-6">
                Crunching numbers and finding insights...
              </p>

              {/* Animated progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full animate-pulse"
                  style={{ width: "70%" }} // You can make this dynamic if you have progress
                ></div>
              </div>

              <p className="text-sm text-gray-500">
                This usually takes 2-5 seconds
              </p>
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
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
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-lg z-40"
              onClick={() => setSelectedNote(null)}
            />

            {/* Modal with Grid Pattern */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:w-[95vw] sm:max-w-6xl sm:h-[80vh] h-screen bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:24px_24px] bg-gray-50 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Content container */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 md:p-5 px-5 py-3 text-white border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Financial Insights
                      </h2>
                      <p className="text-purple-100 text-sm">
                        Analysis of your transaction
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedNote(null)}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto sm:p-6 p-4">
                  {/* Original Note Card - always visible */}
                  <div className="bg-purple-100 rounded-xl md:p-5 p-4 mb-6 border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <h3 className="font-medium text-gray-800">
                        Original Transaction
                      </h3>
                    </div>
                    <p className="text-gray-800 border border-gray-200 whitespace-pre-wrap bg-white p-4 rounded-lg">
                      {selectedNote.text}
                    </p>
                  </div>

                  {isAnalyzing ? (
                    // Loading Skeleton UI
                    <div className="space-y-8">
                      {/* Financial Summary Skeleton */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="p-5 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>

                      {/* Charts Skeleton */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className="p-5 bg-gray-50 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                          </div>
                        ))}
                      </div>

                      {/* Trends & Advice Skeleton */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-gray-200 mt-0.5"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Actual Content when not loading
                    <>
                      {/* Financial Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Income Card */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200 relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 text-green-200 opacity-30">
                            <Wallet className="h-24 w-24" />
                          </div>
                          <div className="flex items-center gap-3 z-10 relative">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <ArrowDownCircle
                                className="h-5 w-5 text-green-600"
                                fill="currentColor"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-600 mb-1">
                                Total Income
                              </p>
                              <p className="text-3xl font-bold text-green-700">
                                ৳
                                {selectedNote.analysis?.totalEarnings?.toLocaleString() ||
                                  0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expenses Card */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-200 relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 text-red-200 opacity-30">
                            <ShoppingCart className="h-24 w-24" />
                          </div>
                          <div className="flex items-center gap-3 z-10 relative">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <ArrowUpCircle
                                className="h-5 w-5 text-red-600"
                                fill="currentColor"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-red-600 mb-1">
                                Total Expenses
                              </p>
                              <p className="text-3xl font-bold text-red-700">
                                ৳
                                {selectedNote.analysis?.totalExpenses?.toLocaleString() ||
                                  0}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200 relative overflow-hidden">
                          <div className="absolute -right-4 -top-4 text-blue-200 opacity-30">
                            <PiggyBank className="h-24 w-24" />
                          </div>
                          <div className="flex items-center gap-3 z-10 relative">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Scale className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-blue-600 mb-1">
                                Current Balance
                              </p>
                              <p className="text-3xl font-bold text-blue-700">
                                ৳
                                {selectedNote.analysis?.netSavings?.toLocaleString() ||
                                  0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Charts Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h3 className="font-medium text-gray-800">
                              Income Sources
                            </h3>
                          </div>
                          <div className="h-64 flex items-center justify-center">
                            <IncomeChart
                              sources={
                                selectedNote.analysis?.incomeSources || {}
                              }
                            />
                          </div>
                        </div>
                        <div className="bg-red-50 p-5 rounded-xl border-2 border-red-200 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <h3 className="font-medium text-gray-800">
                              Expense Breakdown
                            </h3>
                          </div>
                          <div className="h-64 flex items-center justify-center">
                            <ExpenseChart
                              categories={
                                selectedNote.analysis?.expenseCategories || {}
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Trends & Advice */}
                      {selectedNote.analysis && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {selectedNote.analysis.trends && (
                            <div className="bg-purple-50 p-5 rounded-xl border-2 border-purple-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <h3 className="font-medium text-gray-800">
                                  Key Trends
                                </h3>
                              </div>
                              <ul className="space-y-3">
                                {selectedNote.analysis.trends.map(
                                  (trend, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-3"
                                    >
                                      <span
                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full mt-0.5 flex-shrink-0 ${
                                          trend.toLowerCase().includes("income")
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {trend.toLowerCase().includes("income")
                                          ? "↑"
                                          : "↓"}
                                      </span>
                                      <p className="text-gray-700">{trend}</p>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {selectedNote.analysis.advice && (
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border-2 border-amber-200">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <h3 className="font-medium text-gray-800">
                                  Smart Advice
                                </h3>
                              </div>
                              <div className="prose prose-sm text-gray-700">
                                {selectedNote.analysis.advice}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer - Redesigned */}
                <div className="border-t border-gray-200/50 p-4 bg-gradient-to-r from-purple-50 via-gray-50 to-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      <span>
                        Last analyzed:{" "}
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedNote(null)}
                      className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                    >
                      <span className="relative z-10 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                        Done
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Note Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsModalOpen(true); // Fixed this line - was x(true)
        }}
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-lg z-40 transition-colors flex items-center justify-center"
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
        onSave={addNote} // Now handles analysis internally
        isLoading={isAnalyzing}
      />

      <Footer />
    </div>
  );
}
