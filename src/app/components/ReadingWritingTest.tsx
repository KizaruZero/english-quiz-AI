"use client";

import { useState, useEffect, useRef } from "react";

interface ReadingWritingTestProps {
  onBack: () => void;
}

interface SummaryResult {
  overallScore: number;
  scores: {
    content: number;
    conciseness: number;
    languageQuality: number;
  };
  feedback: {
    content: string;
    conciseness: string;
    languageQuality: string;
    overall: string;
  };
  suggestions: string;
  mainIdeasMissed: string[];
  strengths: string[];
  wordCount: number;
  timeManagement: string;
}

export default function ReadingWritingTest({
  onBack,
}: ReadingWritingTestProps) {
  const [currentStep, setCurrentStep] = useState<
    "ready" | "reading" | "writing" | "results"
  >("ready");
  const [readingText, setReadingText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [userSummary, setUserSummary] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isActive, setIsActive] = useState<boolean>(false);
  const [results, setResults] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const generateReadingText = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-reading-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty: "medium" }),
      });

      const data = await response.json();
      if (data.success) {
        setReadingText(data.text);
        setWordCount(data.wordCount);
        setCurrentStep("reading");
      } else {
        alert("Error generating text: " + data.error);
      }
    } catch (error) {
      alert("Error generating text");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startWriting = () => {
    setCurrentStep("writing");
    setIsActive(true);
    startTimeRef.current = Date.now();
  };

  const handleTimeUp = () => {
    setIsActive(false);
    if (currentStep === "writing" && userSummary.trim()) {
      submitSummary();
    }
  };

  const submitSummary = async () => {
    if (!userSummary.trim()) {
      alert("Please write a summary before submitting");
      return;
    }

    setIsActive(false);
    setLoading(true);

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await fetch("/api/evaluate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: readingText,
          userSummary: userSummary.trim(),
          timeSpent: timeSpent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data);
        setCurrentStep("results");
      } else {
        alert("Error evaluating summary: " + data.error);
      }
    } catch (error) {
      alert("Error submitting summary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentStep("ready");
    setReadingText("");
    setWordCount(0);
    setUserSummary("");
    setTimeLeft(600);
    setIsActive(false);
    setResults(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const summaryWordCount = userSummary
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Writing Tests
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800">
            📚 Reading & Writing Test
          </h2>
          <p className="text-blue-600 text-sm">
            Summarization Skills Assessment
          </p>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Timer (show when active) */}
      {isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-blue-700 font-medium">Time Remaining:</span>
            <span
              className={`text-2xl font-mono font-bold ${
                timeLeft <= 60 ? "text-red-600" : "text-blue-800"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
            {timeLeft <= 60 && (
              <span className="text-red-600 animate-pulse">⚠️ Hurry up!</span>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {/* Step 1: Ready */}
      {currentStep === "ready" && (
        <div className="text-center space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Test Instructions:
            </h3>
            <div className="text-blue-700 space-y-2 text-left max-w-2xl mx-auto">
              <p>
                📖 <strong>Step 1:</strong> Read a passage carefully (250-300
                words)
              </p>
              <p>
                ✍️ <strong>Step 2:</strong> Write a summary in one sentence
                (5-75 words)
              </p>
              <p>
                ⏰ <strong>Time Limit:</strong> 10 minutes total
              </p>
              <p>
                🎯 <strong>Goal:</strong> Identify and summarize the main idea
                clearly
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-yellow-600 mr-2">💡</span>
              <p className="text-yellow-800 text-sm">
                <strong>Tip:</strong> Focus on the main idea and most important
                supporting details. Keep your summary concise but complete.
              </p>
            </div>
          </div>

          <button
            onClick={generateReadingText}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Generate Reading Passage
          </button>
        </div>
      )}

      {/* Step 2: Reading */}
      {currentStep === "reading" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Reading Passage
              </h3>
              <span className="text-sm text-gray-500">{wordCount} words</span>
            </div>
            <div className="bg-white p-6 rounded border-l-4 border-blue-500 max-h-96 overflow-y-auto">
              <div className="prose prose-gray max-w-none">
                {readingText.split("\n").map(
                  (paragraph, index) =>
                    paragraph.trim() && (
                      <p
                        key={index}
                        className="text-gray-800 leading-relaxed mb-4 last:mb-0"
                      >
                        {paragraph.trim()}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Read the passage carefully and understand the main ideas.
            </p>
            <button
              onClick={startWriting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Start Writing Summary
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Writing */}
      {currentStep === "writing" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Reading Text Reference */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Reference Text:
              </h3>
              <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {readingText.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph.trim()}
                        </p>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* Summary Writing Area */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">
                  Write Your Summary:
                </h3>
                <span
                  className={`text-sm font-medium ${
                    summaryWordCount >= 5 && summaryWordCount <= 75
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summaryWordCount}/75 words
                </span>
              </div>

              <textarea
                value={userSummary}
                onChange={(e) => setUserSummary(e.target.value)}
                placeholder="Write a one-sentence summary that captures the main idea of the passage... (5-75 words)"
                className="w-full h-32 p-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                disabled={!isActive}
              />

              <div className="mt-3 text-xs text-gray-600">
                <p>
                  💡 <strong>Tip:</strong> Include the main idea and key
                  supporting points in one clear sentence.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={submitSummary}
              disabled={!isActive || summaryWordCount < 5 || loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? "Evaluating..." : "Submit Summary"}
            </button>

            {summaryWordCount < 5 && (
              <p className="mt-2 text-sm text-red-600">
                Summary must be at least 5 words
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {currentStep === "results" && results && (
        <div className="space-y-8">
          {/* Overall Score */}
          <div
            className={`${getScoreBackground(
              results.overallScore
            )} rounded-lg p-6 text-center`}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Overall Score
            </h3>
            <div
              className={`text-6xl font-bold ${getScoreColor(
                results.overallScore
              )}`}
            >
              {results.overallScore}
            </div>
            <div className="text-gray-600 text-lg">out of 100</div>
            <div className="mt-2 text-sm text-gray-600">
              Word count: {results.wordCount} | {results.timeManagement}
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-blue-800 mb-2">
                Content (50%)
              </h4>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.scores.content
                )}`}
              >
                {results.scores.content}
              </div>
              <p className="text-sm text-blue-700 mt-2">
                {results.feedback.content}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-green-800 mb-2">
                Conciseness (25%)
              </h4>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.scores.conciseness
                )}`}
              >
                {results.scores.conciseness}
              </div>
              <p className="text-sm text-green-700 mt-2">
                {results.feedback.conciseness}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-purple-800 mb-2">
                Language Quality (25%)
              </h4>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.scores.languageQuality
                )}`}
              >
                {results.scores.languageQuality}
              </div>
              <p className="text-sm text-purple-700 mt-2">
                {results.feedback.languageQuality}
              </p>
            </div>
          </div>

          {/* Text Comparison */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Summary Analysis:
            </h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Your Summary:
                </h5>
                <p className="text-gray-800 bg-white p-4 rounded border-l-4 border-blue-500">
                  {userSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Detailed Analysis:
              </h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">
                  Overall Performance
                </h5>
                <p className="text-gray-600 text-sm">
                  {results.feedback.overall}
                </p>
              </div>

              {results.mainIdeasMissed.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-700 mb-2">
                    Main Ideas Missed:
                  </h5>
                  <ul className="text-red-600 text-sm space-y-1">
                    {results.mainIdeasMissed.map((idea, index) => (
                      <li key={index}>• {idea}</li>
                    ))}
                  </ul>
                </div>
              )}

              {results.strengths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-700 mb-2">
                    Strengths:
                  </h5>
                  <ul className="text-green-600 text-sm space-y-1">
                    {results.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Improvement Suggestions:
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm leading-relaxed">
                  {results.suggestions}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
                <p>🤖 Evaluated by Gemini 2.0 Flash</p>
                <p>Analysis: Reading comprehension & summarization skills</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={resetTest}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Take Another Test
            </button>
            <button
              onClick={onBack}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
