import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <p>© 2023 AI Notepad</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-accent">
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-accent">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
