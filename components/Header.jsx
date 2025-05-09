import { NotebookText, Sun } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <NotebookText className="h-8 w-8" />
          <h1 className="text-2xl font-bold">AI Notepad</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-purple-800">
          <Sun className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
