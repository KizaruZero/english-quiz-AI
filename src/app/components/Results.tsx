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
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Quiz Results
      </h2>

      {/* Score Display */}
      <div
        className={`${getScoreBackground(
          scoreData.score
        )} rounded-lg p-6 mb-8 text-center`}
      >
        <h3 className="text-lg font-medium text-gray-700 mb-2">Your Score</h3>
        <div className={`text-6xl font-bold ${getScoreColor(scoreData.score)}`}>
          {scoreData.score}
        </div>
        <div className="text-gray-600 text-lg">out of 100</div>
      </div>

      {/* Image and Descriptions */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={imagePreview}
            alt="Quiz image"
            className="w-full rounded-lg shadow-md object-cover max-h-64"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">AI Description:</h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border">
              {aiDescription}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Your Description:
            </h4>
            <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded border">
              {userDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">
            Detailed Feedback:
          </h4>

          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h5 className="font-medium text-gray-700">
                Content Accuracy (40%)
              </h5>
              <p className="text-gray-600 text-sm">
                {scoreData.feedback.content}
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h5 className="font-medium text-gray-700">
                Language Fluency (30%)
              </h5>
              <p className="text-gray-600 text-sm">
                {scoreData.feedback.fluency}
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h5 className="font-medium text-gray-700">
                Detail Coverage (20%)
              </h5>
              <p className="text-gray-600 text-sm">
                {scoreData.feedback.details}
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h5 className="font-medium text-gray-700">Clarity (10%)</h5>
              <p className="text-gray-600 text-sm">
                {scoreData.feedback.clarity}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Suggestions for Improvement:
          </h4>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="text-gray-700 text-sm leading-relaxed">
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
          Try Another Image
        </button>
      </div>
    </div>
  );
}
