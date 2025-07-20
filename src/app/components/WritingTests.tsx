"use client";

import { useState } from "react";
import ReadingWritingTest from "./ReadingWritingTest";
import WritingTest from "./WritingTest";

export default function WritingTests() {
  const [currentTest, setCurrentTest] = useState<
    "menu" | "reading-writing" | "writing"
  >("menu");

  const handleTestSelect = (test: "reading-writing" | "writing") => {
    setCurrentTest(test);
  };

  const handleBackToMenu = () => {
    setCurrentTest("menu");
  };

  if (currentTest === "reading-writing") {
    return <ReadingWritingTest onBack={handleBackToMenu} />;
  }

  if (currentTest === "writing") {
    return <WritingTest onBack={handleBackToMenu} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ✍️ Writing Tests
        </h2>
        <p className="text-gray-600">
          Choose your writing test to improve your English skills
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Reading & Writing Test */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">📚</span>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              Reading & Writing
            </h3>
            <p className="text-blue-700 text-sm">Summarization Skills Test</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Read a 250-300 word passage
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Write a 5-75 word summary
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              10 minutes time limit
            </div>
            <div className="flex items-center text-sm text-blue-700">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Focus on main ideas
            </div>
          </div>

          <button
            onClick={() => handleTestSelect("reading-writing")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Reading & Writing Test
          </button>
        </div>

        {/* Writing Test */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-md transition-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">✍️</span>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Essay Writing
            </h3>
            <p className="text-green-700 text-sm">
              Academic Writing Skills Test
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Write a 200-300 word essay
            </div>
            <div className="flex items-center text-sm text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Respond to given topic
            </div>
            <div className="flex items-center text-sm text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              10 minutes time limit
            </div>
            <div className="flex items-center text-sm text-green-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Plan, write, and revise
            </div>
          </div>

          <button
            onClick={() => handleTestSelect("writing")}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Start Essay Writing Test
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          How AI Evaluation Works
        </h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">
              Reading & Writing Test:
            </h5>
            <ul className="space-y-1">
              <li>• Content (50%): Main idea identification</li>
              <li>• Conciseness (25%): Appropriate length</li>
              <li>• Language Quality (25%): Grammar & vocabulary</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">
              Essay Writing Test:
            </h5>
            <ul className="space-y-1">
              <li>• Content & Ideas (35%): Relevance & depth</li>
              <li>• Organization (25%): Structure & flow</li>
              <li>• Language Use (25%): Grammar & style</li>
              <li>• Task Achievement (15%): Meeting requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
