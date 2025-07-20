"use client";

import { useState, useRef, useEffect } from "react";

interface SpeakingTestProps {
  // Props if needed
}

interface SpeakingResult {
  overallScore: number;
  scores: {
    content: number;
    fluency: number;
    pronunciation: number;
  };
  feedback: {
    content: string;
    fluency: string;
    pronunciation: string;
    overall: string;
  };
  suggestions: string;
  mistakesFound: string[];
  strengths: string[];
  transcript: string;
}

export default function SpeakingTest({}: SpeakingTestProps) {
  const [currentStep, setCurrentStep] = useState<
    "ready" | "text-generated" | "recording" | "results"
  >("ready");
  const [generatedText, setGeneratedText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [results, setResults] = useState<SpeakingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      // Stop audio playback
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [audioUrl]);

  const generateText = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-speaking-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedText(data.text);
        setWordCount(data.wordCount);
        setCurrentStep("text-generated");
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
      setCurrentStep("text-generated"); // Add this line to show submit interface

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const submitRecording = async () => {
    if (!audioBlob || !generatedText) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("originalText", generatedText);

      const response = await fetch("/api/evaluate-speaking", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResults(data);
        setCurrentStep("results");
      } else {
        alert("Error evaluating speaking: " + data.error);
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
    setGeneratedText("");
    setWordCount(0);
    setIsRecording(false);
    setAudioBlob(null);
    setRecordingTime(0);
    setResults(null);

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

    // Stop audio playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const playAudio = () => {
    if (audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
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
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎤 Speaking Test - Read Aloud
        </h2>
        <p className="text-gray-600">
          Practice your English pronunciation and fluency
        </p>
      </div>

      {loading && (
        <div className="text-center mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {/* Step 1: Ready to start */}
      {currentStep === "ready" && (
        <div className="text-center space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center justify-center">
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
            <div className="text-blue-700 space-y-3 text-left max-w-2xl mx-auto">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  1
                </span>
                <p>
                  Click "Generate Text" to get a random passage (max 60 words)
                </p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  2
                </span>
                <p>Read the text aloud clearly when recording</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  3
                </span>
                <p>AI will evaluate your Content, Fluency, and Pronunciation</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  4
                </span>
                <p>Get detailed feedback and suggestions for improvement</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Select Difficulty Level:
              </label>
              <div className="flex justify-center space-x-4">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all duration-300 ${
                      difficulty === level
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateText}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Generate Text to Read
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Text generated, ready to record */}
      {currentStep === "text-generated" && (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Read this text aloud:
              </h3>
              <div className="flex space-x-3">
                <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                  {wordCount} words
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full border ${
                    difficulty === "easy"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {difficulty} level
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-500">
              <p className="text-lg leading-relaxed text-gray-800">
                {generatedText}
              </p>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              When you're ready, click the button below to start recording
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={startRecording}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                🎤 Start Recording
              </button>
              <button
                onClick={generateText}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Generate New Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Recording */}
      {currentStep === "recording" && (
        <div className="space-y-8">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Read this text aloud:
            </h3>
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500">
              <p className="text-lg leading-relaxed text-gray-800">
                {generatedText}
              </p>
            </div>
          </div>

          <div className="text-center space-y-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-8">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xl font-semibold text-red-700">
                  Recording in progress...
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

      {/* Step 4: Recording finished, ready to submit */}
      {audioBlob &&
        currentStep !== "recording" &&
        currentStep !== "results" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-8 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recording Complete!
              </h3>
              <p className="text-green-700">
                Recording duration: {formatTime(recordingTime)}
              </p>
            </div>

            {/* Audio Playback Controls */}
            {audioUrl && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-8">
                <h4 className="text-xl font-semibold text-blue-800 mb-6 text-center flex items-center justify-center">
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
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  🎧 Review Your Recording
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    className={`flex items-center space-x-3 px-8 py-3 rounded-lg font-medium transition-colors ${
                      isPlaying
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <span className="text-xl">{isPlaying ? "⏸️" : "▶️"}</span>
                    <span>{isPlaying ? "Pause" : "Play Recording"}</span>
                  </button>
                </div>

                {/* Hidden audio element */}
                <audio
                  ref={audioPlayerRef}
                  src={audioUrl}
                  onEnded={handleAudioEnded}
                  style={{ display: "none" }}
                />
              </div>
            )}

            <div className="text-center space-x-4">
              <button
                onClick={submitRecording}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                Submit for Evaluation
              </button>
              <button
                onClick={() => setCurrentStep("text-generated")}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Record Again
              </button>
            </div>
          </div>
        )}

      {/* Step 5: Results */}
      {currentStep === "results" && results && (
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
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 text-center">
              <h4 className="font-semibold text-blue-800 mb-4">
                Content (40%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.content
                )} mb-3`}
              >
                {results.scores.content}
              </div>
              <p className="text-sm text-blue-700">
                {results.feedback.content}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 text-center">
              <h4 className="font-semibold text-green-800 mb-4">
                Fluency (35%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.fluency
                )} mb-3`}
              >
                {results.scores.fluency}
              </div>
              <p className="text-sm text-green-700">
                {results.feedback.fluency}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6 text-center">
              <h4 className="font-semibold text-purple-800 mb-4">
                Pronunciation (25%)
              </h4>
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  results.scores.pronunciation
                )} mb-3`}
              >
                {results.scores.pronunciation}
              </div>
              <p className="text-sm text-purple-700">
                {results.feedback.pronunciation}
              </p>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Detailed Analysis
              </h4>

              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Overall Performance
                </h5>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {results.feedback.overall}
                </p>
              </div>

              {results.mistakesFound.length > 0 && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
                  <h5 className="font-semibold text-red-800 mb-3 flex items-center">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Areas to Improve
                  </h5>
                  <ul className="text-red-700 text-sm space-y-2">
                    {results.mistakesFound.map((mistake, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.strengths.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
                  <h5 className="font-semibold text-green-800 mb-3 flex items-center">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Strengths
                  </h5>
                  <ul className="text-green-700 text-sm space-y-2">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audio Playback in Results */}
              {audioUrl && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                  <h5 className="font-semibold text-blue-800 mb-4 flex items-center">
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
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                    🎧 Your Recording
                  </h5>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={isPlaying ? pauseAudio : playAudio}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        isPlaying
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <span>{isPlaying ? "⏸️" : "▶️"}</span>
                      <span>{isPlaying ? "Pause" : "Play"}</span>
                    </button>
                    <span className="text-blue-700 text-sm">
                      Duration: {formatTime(recordingTime)}
                    </span>
                  </div>

                  {/* Hidden audio element */}
                  <audio
                    ref={audioPlayerRef}
                    src={audioUrl}
                    onEnded={handleAudioEnded}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Text Comparison
              </h4>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Original Text:
                  </h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {generatedText}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
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
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    What AI Heard:
                  </h5>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {results.transcript}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 p-6">
                <h5 className="font-semibold text-indigo-800 mb-3 flex items-center">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Suggestions for Improvement:
                </h5>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  {results.suggestions}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={resetTest}
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
                Take Another Test
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
