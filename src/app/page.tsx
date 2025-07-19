"use client";

import { useState } from "react";
import Header from "./components/Header";
import ImageUpload from "./components/ImageUpload";
import DescriptionInput from "./components/DescriptionInput";
import Results from "./components/Results";
import SpeakingTest from "./components/SpeakingTest";

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

export default function Home() {
  const [currentPage, setCurrentPage] = useState<
    "image-description" | "speaking"
  >("image-description");

  // Image Description states
  const [step, setStep] = useState<"upload" | "describe" | "results">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [aiDescription, setAiDescription] = useState<string>("");
  const [userDescription, setUserDescription] = useState<string>("");
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File, preview: string) => {
    setImageFile(file);
    setImagePreview(preview);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAiDescription(data.aiDescription);
        setStep("describe");
      } else {
        alert("Error analyzing image: " + data.error);
      }
    } catch (error) {
      alert("Error uploading image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionSubmit = async (description: string) => {
    setUserDescription(description);
    setLoading(true);

    try {
      const response = await fetch("/api/score-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aiDescription,
          userDescription: description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScoreData({
          score: data.score,
          feedback: data.feedback,
          suggestions: data.suggestions,
        });
        setStep("results");
      } else {
        alert("Error scoring description: " + data.error);
      }
    } catch (error) {
      alert("Error submitting description");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreview("");
    setAiDescription("");
    setUserDescription("");
    setScoreData(null);
  };

  const handlePageChange = (page: "image-description" | "speaking") => {
    setCurrentPage(page);
    // Reset states when switching pages
    if (page === "image-description") {
      resetQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading && (
            <div className="text-center mb-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-600">Processing...</p>
            </div>
          )}

          {currentPage === "image-description" && (
            <>
              {step === "upload" && (
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  disabled={loading}
                />
              )}

              {step === "describe" && (
                <DescriptionInput
                  imagePreview={imagePreview}
                  onSubmit={handleDescriptionSubmit}
                  disabled={loading}
                />
              )}

              {step === "results" && scoreData && (
                <Results
                  imagePreview={imagePreview}
                  aiDescription={aiDescription}
                  userDescription={userDescription}
                  scoreData={scoreData}
                  onReset={resetQuiz}
                />
              )}
            </>
          )}

          {currentPage === "speaking" && <SpeakingTest />}
        </div>
      </div>
    </div>
  );
}
