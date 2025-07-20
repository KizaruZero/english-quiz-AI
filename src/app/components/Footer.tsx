"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🎯 PTE Practice Hub
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Master PTE Academic with our AI-powered practice platform. Get
              realistic test experience with instant feedback and detailed
              analytics.
            </p>
            <div className="flex space-x-4 mt-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">KZ</span>
              </div>
              <div>
                <div className="text-sm font-medium">Built by KizaruZero</div>
                <div className="text-xs text-gray-400">
                  Powered by Gemini 2.0 Flash
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Practice Tests</h3>
            <div className="space-y-2">
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Speaking Test
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Image Description
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Reading Tasks
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Listening Tests
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                PTE Guide
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Scoring System
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Test Format
              </div>
              <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                Tips & Strategies
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 PTE Practice Hub. Built with Next.js and Gemini AI.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Privacy
              </div>
              <div className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Terms
              </div>
              <div className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                Contact
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
