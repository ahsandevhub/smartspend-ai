import { NotebookPen, SquarePlus } from "lucide-react";

export default function Header({ setIsModalOpen }) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 group">
            <NotebookPen className="h-7 w-7 text-purple-200 group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl font-bold tracking-tight">SmartSpend AI</h1>
          </div>

          {/* Theme Toggle */}
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Add note"
            onClick={() => {
              setIsModalOpen(true); // Fixed this line - was x(true)
            }}
          >
            <SquarePlus className="h-6 w-6 text-amber-200 hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
