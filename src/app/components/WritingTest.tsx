"use client";

import { useState, useEffect, useRef } from "react";

interface WritingTestProps {
  onBack: () => void;
}

interface EssayResult {
  overallScore: number;
  scores: {
    contentIdeas: number;
    organization: number;
    languageUse: number;
    taskAchievement: number;
  };
  feedback: {
    contentIdeas: string;
    organization: string;
    languageUse: string;
    taskAchievement: string;
    overall: string;
  };
  suggestions: string;
  strengths: string[];
  areasToImprove: string[];
  wordCount: number;
  timeManagement: string;
  hasIntroduction: boolean;
  hasConclusion: boolean;
}

export default function WritingTest({ onBack }: WritingTestProps) {
  const [currentStep, setCurrentStep] = useState<
    "ready" | "topic-generated" | "writing" | "results"
  >("ready");
  const [essayTopic, setEssayTopic] = useState<string>("");
  const [essayType, setEssayType] = useState<
    "argumentative" | "descriptive" | "narrative" | "expository"
  >("argumentative");
  const [userEssay, setUserEssay] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isActive, setIsActive] = useState<boolean>(false);
  const [results, setResults] = useState<EssayResult | null>(null);
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

  const generateEssayTopic = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-essay-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: essayType, difficulty: "medium" }),
      });

      const data = await response.json();
      if (data.success) {
        setEssayTopic(data.content);
        setCurrentStep("topic-generated");
      } else {
        alert("Error generating topic: " + data.error);
      }
    } catch (error) {
      alert("Error generating topic");
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
    if (currentStep === "writing" && userEssay.trim()) {
      submitEssay();
    }
  };

  const submitEssay = async () => {
    if (!userEssay.trim()) {
      alert("Please write an essay before submitting");
      return;
    }

    setIsActive(false);
    setLoading(true);

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await fetch("/api/evaluate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essayTopic: essayTopic,
          userEssay: userEssay.trim(),
          timeSpent: timeSpent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data);
        setCurrentStep("results");
      } else {
        alert("Error evaluating essay: " + data.error);
      }
    } catch (error) {
      alert("Error submitting essay");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentStep("ready");
    setEssayTopic("");
    setUserEssay("");
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

  const essayWordCount = userEssay
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
          <h2 className="text-2xl font-bold text-green-800">
            ✍️ Essay Writing Test
          </h2>
          <p className="text-green-600 text-sm">
            Academic Writing Skills Assessment
          </p>
        </div>

        <div className="w-20"></div>
      </div>

      {/* Timer */}
      {isActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-green-700 font-medium">Time Remaining:</span>
            <span
              className={`text-2xl font-mono font-bold ${
                timeLeft <= 60 ? "text-red-600" : "text-green-800"
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {/* Step 1: Ready */}
      {currentStep === "ready" && (
        <div className="text-center space-y-6">
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Test Instructions:
            </h3>
            <div className="text-green-700 space-y-2 text-left max-w-2xl mx-auto">
              <p>
                📝 <strong>Task:</strong> Write a well-structured essay (200-300
                words)
              </p>
              <p>
                ⏰ <strong>Time Limit:</strong> 10 minutes total
              </p>
              <p>
                📋 <strong>Structure:</strong> Introduction, body paragraphs,
                conclusion
              </p>
              <p>
                🎯 <strong>Goal:</strong> Plan, write, and revise your essay
                effectively
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Essay Type:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(
                [
                  "argumentative",
                  "descriptive",
                  "narrative",
                  "expository",
                ] as const
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setEssayType(type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    essayType === type
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <span className="text-yellow-600 mr-2">💡</span>
              <p className="text-yellow-800 text-sm">
                <strong>Tip:</strong> Spend 2-3 minutes planning, 6-7 minutes
                writing, and 1-2 minutes reviewing your essay.
              </p>
            </div>
          </div>

          <button
            onClick={generateEssayTopic}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Generate Essay Topic
          </button>
        </div>
      )}

      {/* Step 2: Topic Generated */}
      {currentStep === "topic-generated" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Essay Topic
              </h3>
              <span className="text-sm text-gray-500 capitalize">
                {essayType} essay
              </span>
            </div>
            <div className="bg-white p-6 rounded border-l-4 border-green-500">
              <div className="prose prose-gray max-w-none">
                {essayTopic.split("\n").map(
                  (line, index) =>
                    line.trim() && (
                      <p
                        key={index}
                        className="text-gray-800 leading-relaxed mb-3 last:mb-0"
                      >
                        {line.trim()}
                      </p>
                    )
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Quick Planning Tips:
            </h4>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• Brainstorm 2-3 main points</p>
              <p>• Think of supporting examples or evidence</p>
              <p>• Plan your introduction hook and thesis</p>
              <p>• Consider how to conclude effectively</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Take a moment to plan your essay, then start writing when ready.
            </p>
            <div className="space-x-4">
              <button
                onClick={startWriting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Start Writing Essay
              </button>
              <button
                onClick={generateEssayTopic}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Generate New Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Writing */}
      {currentStep === "writing" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Essay Topic Reference */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Essay Topic:
              </h3>
              <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto">
                <div className="text-sm text-gray-700 leading-relaxed">
                  {essayTopic.split("\n").map(
                    (line, index) =>
                      line.trim() && (
                        <p key={index} className="mb-2 last:mb-0">
                          {line.trim()}
                        </p>
                      )
                  )}
                </div>
              </div>
            </div>

            {/* Essay Writing Area */}
            <div className="lg:col-span-2 bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800">
                  Write Your Essay:
                </h3>
                <span
                  className={`text-sm font-medium ${
                    essayWordCount >= 200 && essayWordCount <= 300
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {essayWordCount}/300 words
                </span>
              </div>

              <textarea
                value={userEssay}
                onChange={(e) => setUserEssay(e.target.value)}
                placeholder="Write your essay here... Include an introduction, body paragraphs with examples, and a conclusion. (200-300 words)"
                className="w-full text-black h-80 p-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                disabled={!isActive}
              />

              <div className="mt-3 text-xs text-gray-600 space-y-1">
                <p>
                  💡 <strong>Structure:</strong> Introduction → Body Paragraphs
                  → Conclusion
                </p>
                <p>
                  📝 <strong>Content:</strong> Clear thesis, supporting
                  examples, logical flow
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={submitEssay}
              disabled={!isActive || essayWordCount < 50 || loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? "Evaluating..." : "Submit Essay"}
            </button>

            {essayWordCount < 50 && (
              <p className="mt-2 text-sm text-red-600">
                Essay must be at least 50 words
              </p>
            )}

            {essayWordCount < 200 && essayWordCount >= 50 && (
              <p className="mt-2 text-sm text-yellow-600">
                Recommended: 200-300 words for best evaluation
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

          {/* Structure Analysis */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">
              Essay Structure Analysis:
            </h4>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center">
                <span
                  className={`mr-2 ${
                    results.hasIntroduction ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {results.hasIntroduction ? "✅" : "❌"}
                </span>
                <span className="text-blue-700">Introduction</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`mr-2 ${
                    results.hasConclusion ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {results.hasConclusion ? "✅" : "❌"}
                </span>
                <span className="text-blue-700">Conclusion</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`mr-2 ${
                    results.wordCount >= 200 && results.wordCount <= 300
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {results.wordCount >= 200 && results.wordCount <= 300
                    ? "✅"
                    : "⚠️"}
                </span>
                <span className="text-blue-700">Word Count</span>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                Content & Ideas (35%)
              </h4>
              <div
                className={`text-2xl font-bold ${getScoreColor(
                  results.scores.contentIdeas
                )}`}
              >
                {results.scores.contentIdeas}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                {results.feedback.contentIdeas}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-green-800 mb-2 text-sm">
                Organization (25%)
              </h4>
              <div
                className={`text-2xl font-bold ${getScoreColor(
                  results.scores.organization
                )}`}
              >
                {results.scores.organization}
              </div>
              <p className="text-xs text-green-700 mt-2">
                {results.feedback.organization}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">
                Language Use (25%)
              </h4>
              <div
                className={`text-2xl font-bold ${getScoreColor(
                  results.scores.languageUse
                )}`}
              >
                {results.scores.languageUse}
              </div>
              <p className="text-xs text-purple-700 mt-2">
                {results.feedback.languageUse}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-orange-800 mb-2 text-sm">
                Task Achievement (15%)
              </h4>
              <div
                className={`text-2xl font-bold ${getScoreColor(
                  results.scores.taskAchievement
                )}`}
              >
                {results.scores.taskAchievement}
              </div>
              <p className="text-xs text-orange-700 mt-2">
                {results.feedback.taskAchievement}
              </p>
            </div>
          </div>

          {/* Essay Display */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Your Essay:
            </h4>
            <div className="bg-white p-6 rounded border-l-4 border-green-500 max-h-64 overflow-y-auto">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {userEssay}
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

              {results.areasToImprove.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-700 mb-2">
                    Areas to Improve:
                  </h5>
                  <ul className="text-red-600 text-sm space-y-1">
                    {results.areasToImprove.map((area, index) => (
                      <li key={index}>• {area}</li>
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
                <p>Analysis: Academic writing skills assessment</p>
                <p>Date: 2025-07-20 16:12:57 UTC</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={resetTest}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
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
