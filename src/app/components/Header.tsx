"use client";

interface HeaderProps {
  currentPage: "home" | "image-description" | "speaking" | "writing";
  onPageChange: (
    page: "home" | "image-description" | "speaking" | "writing"
  ) => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => onPageChange("home")}
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🎯 PTE Practice Hub
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              AI-Powered English Test Preparation
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            <button
              onClick={() => onPageChange("home")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "home"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onPageChange("image-description")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "image-description"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Image Description
            </button>
            <button
              onClick={() => onPageChange("speaking")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "speaking"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Speaking Test
            </button>
            <button
              onClick={() => onPageChange("writing")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "writing"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              Writing Test
            </button>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-medium text-indigo-600">KizaruZero</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
              KZ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
