"use client";

import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";

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
    if (score >= 80) return "text-accent-tertiary";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-accent-tertiary/20 to-green-500/20";
    if (score >= 60) return "from-yellow-500/20 to-orange-500/20";
    return "from-red-500/20 to-pink-500/20";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🎉";
    if (score >= 60) return "👍";
    return "💪";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent work!";
    if (score >= 60) return "Good progress!";
    return "Keep practicing!";
  };

  return (
    <Surface variant="elevated" padding="lg" radius="xl" border className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <Surface
          variant="glass"
          padding="md"
          radius="full"
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6 gradient-web3-tertiary shadow-glow-lime"
        >
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
        </Surface>
        
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Your Results
        </h2>
        <p className="text-text-secondary">Step 3: Review your performance</p>
      </div>

      {/* Score Display */}
      <Surface 
        variant="glass" 
        padding="lg" 
        radius="xl" 
        border
        className={`text-center mb-8 bg-gradient-to-br ${getScoreGradient(scoreData.score)}`}
      >
        <div className="text-6xl mb-4">{getScoreIcon(scoreData.score)}</div>
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(scoreData.score)}`}>
          {scoreData.score}
        </div>
        <div className="text-text-muted text-lg mb-2">out of 100</div>
        <div className={`text-xl font-semibold ${getScoreColor(scoreData.score)}`}>
          {getScoreMessage(scoreData.score)}
        </div>
        
        {/* Score Bar */}
        <div className="mt-6 w-full bg-border-default rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 bg-gradient-to-r ${
              scoreData.score >= 80 ? 'from-accent-tertiary to-green-500' :
              scoreData.score >= 60 ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-pink-500'
            }`}
            style={{ width: `${scoreData.score}%` }}
          />
        </div>
      </Surface>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Descriptions */}
        <div className="space-y-6">
          {/* Image */}
          <Surface variant="glass" padding="md" radius="lg" border>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
            </h3>
            <div className="overflow-hidden rounded-lg border border-border-default">
              <img
                src={imagePreview}
                alt="Analyzed image"
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Surface>

          {/* AI Description */}
          <Surface variant="glass" padding="lg" radius="lg" border>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AI Analysis
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-text-secondary leading-relaxed">{aiDescription}</p>
            </div>
          </Surface>

          {/* User Description */}
          <Surface variant="glass" padding="lg" radius="lg" border>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Description
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-text-secondary leading-relaxed">{userDescription}</p>
            </div>
          </Surface>
        </div>

        {/* Right Column - Feedback */}
        <div className="space-y-6">
          {/* Detailed Feedback */}
          <Surface variant="glass" padding="lg" radius="lg" border>
            <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Detailed Feedback
            </h3>
            
            <div className="space-y-4">
              {/* Content */}
              <div className="p-4 rounded-lg bg-bg-surface border border-border-default">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="w-2 h-2 bg-accent-primary rounded-full mr-2"></span>
                  Content
                </h4>
                <p className="text-text-secondary text-sm">{scoreData.feedback.content}</p>
              </div>

              {/* Fluency */}
              <div className="p-4 rounded-lg bg-bg-surface border border-border-default">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="w-2 h-2 bg-accent-secondary rounded-full mr-2"></span>
                  Fluency
                </h4>
                <p className="text-text-secondary text-sm">{scoreData.feedback.fluency}</p>
              </div>

              {/* Details */}
              <div className="p-4 rounded-lg bg-bg-surface border border-border-default">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="w-2 h-2 bg-accent-tertiary rounded-full mr-2"></span>
                  Details
                </h4>
                <p className="text-text-secondary text-sm">{scoreData.feedback.details}</p>
              </div>

              {/* Clarity */}
              <div className="p-4 rounded-lg bg-bg-surface border border-border-default">
                <h4 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Clarity
                </h4>
                <p className="text-text-secondary text-sm">{scoreData.feedback.clarity}</p>
              </div>
            </div>
          </Surface>

          {/* Suggestions */}
          <Surface variant="glass" padding="lg" radius="lg" border>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Improvement Suggestions
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-text-secondary leading-relaxed">{scoreData.suggestions}</p>
            </div>
          </Surface>

          {/* Progress Indicator */}
          <Surface variant="glass" padding="md" radius="lg" border>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-text-secondary">Progress</span>
              <span className="text-accent-primary font-medium">Step 3 of 3 - Complete!</span>
            </div>
            <div className="flex space-x-2">
              <div className="h-2 flex-1 bg-accent-primary rounded-full"></div>
              <div className="h-2 flex-1 bg-accent-primary rounded-full"></div>
              <div className="h-2 flex-1 bg-accent-primary rounded-full"></div>
            </div>
          </Surface>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border-default">
        <Button
          variant="primary"
          size="lg"
          glow
          onClick={onReset}
          className="flex-1"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
        >
          Try Another Image
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.print()}
          className="flex-1"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          }
        >
          Print Results
        </Button>
      </div>
    </Surface>
  );
}
