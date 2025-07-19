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
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
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
        <div className="text-center space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              How it works:
            </h3>
            <div className="text-blue-700 space-y-2 text-left max-w-2xl mx-auto">
              <p>
                • Click "Generate Text" to get a random passage (max 60 words)
              </p>
              <p>• Read the text aloud clearly when recording</p>
              <p>• AI will evaluate your Content, Fluency, and Pronunciation</p>
              <p>• Get detailed feedback and suggestions for improvement</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Difficulty:
            </label>
            <div className="flex justify-center space-x-4">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    difficulty === level
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            Generate Text to Read
          </button>
        </div>
      )}

      {/* Step 2: Text generated, ready to record */}
      {currentStep === "text-generated" && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Read this text aloud:
              </h3>
              <span className="text-sm text-gray-500">
                {wordCount} words • {difficulty} level
              </span>
            </div>
            <div className="bg-white p-4 rounded border-l-4 border-indigo-500">
              <p className="text-lg leading-relaxed text-gray-800">
                {generatedText}
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              When you're ready, click the button below to start recording
            </p>
            <div className="space-x-4">
              <button
                onClick={startRecording}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Read this text aloud:
            </h3>
            <div className="bg-white p-4 rounded border-l-4 border-red-500">
              <p className="text-lg leading-relaxed text-gray-800">
                {generatedText}
              </p>
            </div>
          </div>

          <div className="text-center space-y-6">
            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-red-700">
                  Recording in progress...
                </span>
              </div>
              <div className="text-2xl font-mono text-red-700">
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
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Recording Complete!
              </h3>
              <p className="text-green-700">
                Recording duration: {formatTime(recordingTime)}
              </p>
            </div>

            {/* Audio Playback Controls */}
            {audioUrl && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                  🎧 Review Your Recording
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={isPlaying ? pauseAudio : playAudio}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
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
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-blue-800 mb-2">
                Content (40%)
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
                Fluency (35%)
              </h4>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.scores.fluency
                )}`}
              >
                {results.scores.fluency}
              </div>
              <p className="text-sm text-green-700 mt-2">
                {results.feedback.fluency}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-purple-800 mb-2">
                Pronunciation (25%)
              </h4>
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  results.scores.pronunciation
                )}`}
              >
                {results.scores.pronunciation}
              </div>
              <p className="text-sm text-purple-700 mt-2">
                {results.feedback.pronunciation}
              </p>
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

              {results.mistakesFound.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-700 mb-2">
                    Areas to Improve
                  </h5>
                  <ul className="text-red-600 text-sm space-y-1">
                    {results.mistakesFound.map((mistake, index) => (
                      <li key={index}>• {mistake}</li>
                    ))}
                  </ul>
                </div>
              )}

              {results.strengths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-700 mb-2">Strengths</h5>
                  <ul className="text-green-600 text-sm space-y-1">
                    {results.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Audio Playback in Results */}
              {audioUrl && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-700 mb-3">
                    🎧 Your Recording
                  </h5>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={isPlaying ? pauseAudio : playAudio}
                      className={`flex items-center space-x-2 px-4 py-2 rounded font-medium transition-colors text-sm ${
                        isPlaying
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <span>{isPlaying ? "⏸️" : "▶️"}</span>
                      <span>{isPlaying ? "Pause" : "Play"}</span>
                    </button>
                    <span className="text-blue-600 text-sm">
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

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Text Comparison:
              </h4>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">
                    Original Text:
                  </h5>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border">
                    {generatedText}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">
                    What AI Heard:
                  </h5>
                  <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded border">
                    {results.transcript}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h5 className="font-medium text-indigo-700 mb-2">
                  Suggestions for Improvement:
                </h5>
                <p className="text-indigo-600 text-sm">{results.suggestions}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={resetTest}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Take Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
