"use client";

interface ScoreData {
  score: number;
  feedback: {
    content: string;
    fluency: string;
    details: string;
    clarity: string;
  };
  suggestions: string;
}

interface ResultsProps {
  imagePreview: string;
  aiDescription: string;
  userDescription: string;
  scoreData: ScoreData;
  onReset: () => void;
}

export default function Results({
  imagePreview,
  aiDescription,
  userDescription,
  scoreData,
  onReset,
}: ResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-gradient-to-br from-green-50 to-green-100";
    if (score >= 60) return "bg-gradient-to-br from-yellow-50 to-yellow-100";
    return "bg-gradient-to-br from-red-50 to-red-100";
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return "border-green-200";
    if (score >= 60) return "border-yellow-200";
    return "border-red-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h2>
        <p className="text-gray-600">Your performance analysis</p>
      </div>

      {/* Score Display */}
      <div
        className={`${getScoreBackground(
          scoreData.score
        )} rounded-lg border ${getScoreBorder(
          scoreData.score
        )} p-8 mb-8 text-center`}
      >
        <h3 className="text-lg font-medium text-gray-700 mb-4">Your Score</h3>
        <div
          className={`text-7xl font-bold ${getScoreColor(
            scoreData.score
          )} mb-2`}
        >
          {scoreData.score}
        </div>
        <div className="text-gray-600 text-xl">out of 100</div>
      </div>

      {/* Image and Descriptions */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <img
            src={imagePreview}
            alt="Quiz image"
            className="w-full rounded-lg shadow-md object-cover max-h-64"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              AI Description:
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              {aiDescription}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Your Description:
            </h4>
            <p className="text-green-700 text-sm leading-relaxed">
              {userDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-800">
            Detailed Feedback
          </h4>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg border-l-4 border-blue-500 p-6">
              <h5 className="font-semibold text-blue-800 mb-2">
                Content Accuracy (40%)
              </h5>
              <p className="text-blue-700 text-sm leading-relaxed">
                {scoreData.feedback.content}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg border-l-4 border-green-500 p-6">
              <h5 className="font-semibold text-green-800 mb-2">
                Language Fluency (30%)
              </h5>
              <p className="text-green-700 text-sm leading-relaxed">
                {scoreData.feedback.fluency}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg border-l-4 border-yellow-500 p-6">
              <h5 className="font-semibold text-yellow-800 mb-2">
                Detail Coverage (20%)
              </h5>
              <p className="text-yellow-700 text-sm leading-relaxed">
                {scoreData.feedback.details}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg border-l-4 border-purple-500 p-6">
              <h5 className="font-semibold text-purple-800 mb-2">
                Clarity (10%)
              </h5>
              <p className="text-purple-700 text-sm leading-relaxed">
                {scoreData.feedback.clarity}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-gray-800">
            Improvement Suggestions
          </h4>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 p-6">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="text-indigo-800 font-semibold">Pro Tips</span>
            </div>
            <p className="text-indigo-700 leading-relaxed">
              {scoreData.suggestions}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Another Image
          </span>
        </button>
      </div>
    </div>
  );
}
