"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PTEGuide from "./components/PTEGuide";
import Features from "./components/Features";
import Footer from "./components/Footer";
import ImageUpload from "./components/ImageUpload";
import DescriptionInput from "./components/DescriptionInput";
import Results from "./components/Results";
import SpeakingTest from "./components/SpeakingTest";
import WritingTests from "./components/WritingTests";
import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

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
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    "home" | "image-description" | "speaking" | "writing"
  >("home");

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

  const handlePageChange = (
    page: "home" | "image-description" | "speaking" | "writing"
  ) => {
    setCurrentPage(page);
    if (page === "image-description") {
      resetQuiz();
    }
  };

  // Check if current page requires authentication
  const isProtectedPage = currentPage === "image-description" || 
                          currentPage === "speaking" || 
                          currentPage === "writing";

  // Login Required Component
  const LoginRequired = ({ feature }: { feature: string }) => (
    <Surface variant="elevated" padding="xl" radius="xl" border className="text-center animate-fade-in">
      <Surface
        variant="glass"
        padding="lg"
        radius="full"
        className="w-20 h-20 flex items-center justify-center mx-auto mb-6 gradient-web3-primary shadow-glow"
      >
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </Surface>
      
      <h2 className="text-2xl font-bold text-text-primary mb-4">
        Sign In Required
      </h2>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Please sign in to access the {feature} feature. Create an account or use one of our demo accounts to get started.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          size="lg"
          glow
          onClick={() => handlePageChange("home")}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        >
          Back to Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => document.getElementById("pte-guide")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Guide
        </Button>
      </div>
    </Surface>
  );

  return (
    <div className="min-h-screen bg-bg-default">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />

      {currentPage === "home" && (
        <>
          <Hero onStartPractice={handlePageChange} />
          <Features onStartPractice={handlePageChange} />
          <PTEGuide />
          <Footer />
        </>
      )}

      {currentPage !== "home" && (
        <div className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {loading && (
              <Surface 
                variant="elevated" 
                padding="lg"
                className="text-center mb-8 animate-fade-in"
              >
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                <p className="mt-4 text-text-secondary">Processing...</p>
              </Surface>
            )}

            {/* Protected Routes - Show login required if not authenticated */}
            {!isAuthenticated && isProtectedPage && (
              <LoginRequired 
                feature={
                  currentPage === "image-description" ? "Image Description" :
                  currentPage === "speaking" ? "Speaking Test" :
                  currentPage === "writing" ? "Writing Test" : ""
                } 
              />
            )}

            {/* Authenticated Content */}
            {isAuthenticated && (
              <>
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

                {currentPage === "writing" && <WritingTests />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
