import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2">
          <p className="text-sm flex items-center">
            Developed with{" "}
            <Heart className="h-4 w-4 mx-1 text-pink-300 fill-pink-300" /> by
            Sadia Afrin
          </p>
        </div>
      </div>
    </footer>
  );
}
