"use client";

interface HeaderProps {
  currentPage: "image-description" | "speaking";
  onPageChange: (page: "image-description" | "speaking") => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-indigo-600">
              🤖 AI English Quiz
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              Practice English with AI-powered tests
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            <button
              onClick={() => onPageChange("image-description")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === "image-description"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              📷 Image Description
            </button>
            <button
              onClick={() => onPageChange("speaking")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === "speaking"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              🎤 Speaking Test
            </button>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-sm text-gray-600">
              Welcome, <span className="font-medium">KizaruZero</span>
            </div>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              KZ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
