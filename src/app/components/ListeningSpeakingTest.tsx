"use client";

import { useState, useRef, useEffect } from "react";

interface ListeningSpeakingTestProps {
  onBack: () => void;
}

interface Question {
  question: string;
  expectedAnswers: string[];
  category: string;
  difficulty: string;
  hint?: string;
}

interface ListeningResult {
  overallScore: number;
  scores: {
    correctness: number;
    pronunciation: number;
    speed: number;
  };
  isCorrect: boolean;
  feedback: {
    correctness: string;
    pronunciation: string;
    speed: string;
    overall: string;
  };
  correctAnswer: string;
  suggestions: string;
  responseTimeCategory: string;
}

// Declare Puter types
declare global {
  interface Window {
    puter: {
      ai: {
        txt2speech: (text: string, options?: any) => Promise<HTMLAudioElement>;
      };
    };
  }
}

export default function ListeningSpeakingTest({
  onBack,
}: ListeningSpeakingTestProps) {
  const [currentStep, setCurrentStep] = useState<
    "ready" | "listening" | "speaking" | "recording" | "results"
  >("ready");
  const [question, setQuestion] = useState<Question | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [category, setCategory] = useState<string>("general");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [results, setResults] = useState<ListeningResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [puterReady, setPuterReady] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if Puter.js is loaded
  useEffect(() => {
    const checkPuter = () => {
      if (typeof window !== "undefined" && window.puter) {
        setPuterReady(true);
      } else {
        setTimeout(checkPuter, 100);
      }
    };
    checkPuter();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Clean up audio URL to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-listening-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, category }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestion({
          question: data.question,
          expectedAnswers: data.expectedAnswers,
          category: data.category,
          difficulty: data.difficulty,
          hint: data.hint,
        });
        setCurrentStep("listening");
      } else {
        alert("Error generating question: " + data.error);
      }
    } catch (error) {
      alert("Error generating question");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const playQuestion = async () => {
    if (!puterReady || !question || isPlaying) return;

    setIsPlaying(true);
    try {
      const audio = await window.puter.ai.txt2speech(question.question, {
        voice: "Joanna",
        engine: "neural",
        language: "en-US",
      });

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentStep("speaking");
      };

      audio.play();
    } catch (error) {
      console.error("Error playing question:", error);
      setIsPlaying(false);
      alert("Error playing audio. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: "audio/webm;codecs=opus",
        });
        setAudioBlob(audioBlob);

        // Create URL for audio playback
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setCurrentStep("recording");
      setRecordingTime(0);
      startTimeRef.current = Date.now();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setCurrentStep("speaking");

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Calculate response time
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTimeRef.current) / 1000);
      setResponseTime(timeTaken);
    }
  };

  const submitRecording = async () => {
    if (!audioBlob || !question) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("originalText", question.question);
      formData.append(
        "expectedAnswers",
        JSON.stringify(question.expectedAnswers)
      );
      formData.append("responseTime", responseTime.toString());

      const response = await fetch("/api/evaluate-listening-response-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setCurrentStep("results");
      } else {
        alert("Error evaluating response: " + data.error);
      }
    } catch (error) {
      alert("Error submitting recording");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentStep("ready");
    setQuestion(null);
    setResponseTime(0);
    setResults(null);
    setIsPlaying(false);
    setIsRecording(false);
    setAudioBlob(null);
    setRecordingTime(0);

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            🎧 Listening & Speaking Test
          </h2>
          <p className="text-gray-600">
            Quick Response & Pronunciation Assessment
          </p>
        </div>

        <div className="w-20"></div>
      </div>

      {/* Puter.js Status */}
      {!puterReady && (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <span className="text-yellow-600 mr-2">⏳</span>
            <p className="text-yellow-800 text-sm">Loading audio engine...</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {/* Step 1: Ready */}
      {currentStep === "ready" && (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-8">
            <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              How it works
            </h3>
            <div className="text-purple-700 space-y-3 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  1
                </span>
                <p>
                  <strong>Listen:</strong> AI will ask a short question using
                  text-to-speech
                </p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  2
                </span>
                <p>
                  <strong>Record:</strong> Answer quickly with 1-3 words by
                  recording
                </p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  3
                </span>
                <p>
                  <strong>Speed Matters:</strong> Faster responses get higher
                  scores
                </p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  4
                </span>
                <p>
                  <strong>Evaluation:</strong> Correctness, Pronunciation, and
                  Speed
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Difficulty Level:
              </label>
              <div className="space-y-2">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-full px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      difficulty === level
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Question Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="general">General Knowledge</option>
                <option value="opposites">Opposites</option>
                <option value="synonyms">Synonyms</option>
                <option value="colors">Colors</option>
                <option value="numbers">Numbers</option>
                <option value="animals">Animals</option>
                <option value="food">Food</option>
                <option value="time">Time</option>
                <option value="weather">Weather</option>
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 mr-2">💡</span>
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Listen carefully and record your response
                quickly. Speed and accuracy both matter!
              </p>
            </div>
          </div>

          <button
            onClick={generateQuestion}
            disabled={loading || !puterReady}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {puterReady ? "Start Listening Test" : "Loading Audio Engine..."}
          </button>
        </div>
      )}

      {/* Step 2: Listening */}
      {currentStep === "listening" && question && (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              🎧 Listen Carefully
            </h3>
            <p className="text-blue-700 mb-6">
              Click the button below to hear the question
            </p>

            <button
              onClick={playQuestion}
              disabled={isPlaying || loading}
              className={`px-8 py-4 rounded-lg font-medium text-white transition-colors ${
                isPlaying
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              {isPlaying ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">🔊</span>
                  Playing Question...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">▶️</span>
                  Play Question
                </span>
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">
              <strong>Category:</strong> {question.category} |{" "}
              <strong>Difficulty:</strong> {question.difficulty}
            </p>
            {question.hint && (
              <p className="text-gray-500 text-sm mt-1">
                <strong>Hint:</strong> {question.hint}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Speaking */}
      {currentStep === "speaking" && question && (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-8">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              🎤 Your Turn to Speak
            </h3>
            <p className="text-green-700 mb-6">
              Answer the question you just heard
            </p>

            <button
              onClick={startRecording}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              🎤 Start Recording
            </button>
          </div>

          {/* Replay Question Button */}
          <button
            onClick={playQuestion}
            disabled={isPlaying}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-sm"
          >
            🔄 Replay Question
          </button>
        </div>
      )}

      {/* Step 4: Recording */}
      {currentStep === "recording" && (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Recording your response...
            </h3>
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-lg leading-relaxed text-gray-800">
                Question: "{question?.question}"
              </p>
            </div>
          </div>

          <div className="text-center space-y-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xl font-semibold text-red-700">
                  Recording in progress... Speak now!
                </span>
              </div>
              <div className="text-3xl font-mono text-red-700 font-bold">
                {formatTime(recordingTime)}
              </div>
            </div>

            <button
              onClick={stopRecording}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              ⏹️ Stop Recording
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Recording finished, ready to submit */}
      {audioBlob &&
        currentStep !== "recording" &&
        currentStep !== "results" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                ✅ Recording Complete!
              </h3>
              <p className="text-green-700">
                Recording duration: {formatTime(recordingTime)} | Response time:{" "}
                {responseTime}s
              </p>
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={submitRecording}
                disabled={loading}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Submit for Evaluation
              </button>
              <button
                onClick={() => setCurrentStep("speaking")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Record Again
              </button>
            </div>
          </div>
        )}

      {/* Step 6: Results */}
      {currentStep === "results" && results && question && (
        <div className="space-y-8">
          {/* Overall Score */}
          <div
            className={`${getScoreBackground(
              results.overallScore
            )} rounded-lg border ${getScoreBorder(
              results.overallScore
            )} p-8 text-center`}
          >
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Overall Score
            </h3>
            <div
              className={`text-7xl font-bold ${getScoreColor(
                results.overallScore
              )} mb-2`}
            >
              {results.overallScore}
            </div>
            <div className="text-gray-600 text-xl">out of 100</div>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <span
                className={`px-3 py-1 rounded-full ${
                  results.isCorrect
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {results.isCorrect ? "✅ Correct" : "❌ Incorrect"}
              </span>
              <span className="text-gray-600">
                Response time: {responseTime}s ({results.responseTimeCategory})
              </span>
            </div>
          </div>

          {/* Question & Answer */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Question & Answer:
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Question:</h5>
                <p className="text-gray-800 bg-white p-3 rounded border-l-4 border-purple-500">
                  "{question.question}"
                </p>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-1">
                  Correct Answer:
                </h5>
                <p className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-3 rounded">
                  "{results.correctAnswer}"
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 text-center">
              <h4 className="font-semibold text-blue-800 mb-4">
                Correctness (60%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.correctness
                )} mb-3`}
              >
                {results.scores.correctness}
              </div>
              <p className="text-sm text-blue-700">
                {results.feedback.correctness}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 text-center">
              <h4 className="font-semibold text-green-800 mb-4">
                Pronunciation (25%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.pronunciation
                )} mb-3`}
              >
                {results.scores.pronunciation}
              </div>
              <p className="text-sm text-green-700">
                {results.feedback.pronunciation}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 text-center">
              <h4 className="font-semibold text-purple-800 mb-4">
                Speed (15%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.speed
                )} mb-3`}
              >
                {results.scores.speed}
              </div>
              <p className="text-sm text-purple-700">
                {results.feedback.speed}
              </p>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Performance Analysis:
              </h4>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Overall Performance
                </h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {results.feedback.overall}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <h5 className="font-semibold text-blue-800 mb-3">
                  Response Time Analysis
                </h5>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Your response time was {responseTime} seconds, which is{" "}
                  <span className="font-medium">
                    {results.responseTimeCategory}
                  </span>
                  .{responseTime <= 3 && " Excellent quick thinking!"}
                  {responseTime > 3 &&
                    responseTime <= 5 &&
                    " Good response time!"}
                  {responseTime > 5 &&
                    " Try to respond more quickly next time."}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Improvement Tips:
              </h4>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                <p className="text-purple-700 text-sm leading-relaxed">
                  {results.suggestions}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
                <p>🤖 Question generated by Gemini 2.0 Flash</p>
                <p>🔊 Audio powered by Puter.js TTS</p>
                <p>🎤 Recording via MediaRecorder API</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <button
              onClick={resetTest}
              className="bg-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
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
