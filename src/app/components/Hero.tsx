"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";

interface HeroSectionProps {
  onStartPractice: (page: "image-description" | "speaking") => void;
}

export default function HeroSection({ onStartPractice }: HeroSectionProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      score: "PTE Score: 85",
      text: "AI English Coach helped me improve my speaking fluency dramatically. The real-time feedback is incredible!",
      avatar: "SC",
    },
    {
      name: "Ahmad Rahman",
      score: "PTE Score: 79",
      text: "The image description practice was exactly what I needed. Got my target score on the first try!",
      avatar: "AR",
    },
    {
      name: "Maria Santos",
      score: "PTE Score: 88",
      text: "Best PTE practice platform I've used. The AI feedback is so detailed and helpful.",
      avatar: "MS",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-bg-default via-bg-subtle to-bg-surface">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-accent-secondary/20 to-accent-tertiary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-accent-tertiary/20 to-accent-primary/20 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-6">
              {/* Status Badge */}
              <Surface
                variant="glass"
                padding="sm"
                radius="full"
                className="inline-flex items-center space-x-3 text-sm backdrop-blur-md"
              >
                <span className="w-2 h-2 bg-accent-tertiary rounded-full animate-pulse shadow-glow-lime" />
                <span className="text-text-primary font-medium">Powered by Gemini 2.0 Flash AI</span>
              </Surface>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-text-primary">
                Master{" "}
                <span className="text-gradient bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent animate-glow-pulse">
                  PTE Academic
                </span>{" "}
                with AI
              </h1>

              {/* Description */}
              <p className="text-xl text-text-secondary leading-relaxed">
                Practice PTE Speaking and Image Description with advanced AI
                analysis. Get real-time feedback, detailed scoring, and
                personalized improvement suggestions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                glow
                onClick={() => onStartPractice("image-description")}
                icon={
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                }
                iconPosition="right"
                className="group"
              >
                <span className="flex items-center space-x-2">
                  <span>📷</span>
                  <span>Try Image Description</span>
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onStartPractice("speaking")}
                className="glass"
              >
                <span className="flex items-center space-x-2">
                  <span>🎤</span>
                  <span>Practice Speaking</span>
                </span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <Surface variant="glass" padding="md" radius="lg" className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent-tertiary">15K+</div>
                <div className="text-sm text-text-muted">Students Trained</div>
              </Surface>
              <Surface variant="glass" padding="md" radius="lg" className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent-primary">85%</div>
                <div className="text-sm text-text-muted">Success Rate</div>
              </Surface>
              <Surface variant="glass" padding="md" radius="lg" className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent-secondary">24/7</div>
                <div className="text-sm text-text-muted">AI Available</div>
              </Surface>
            </div>
          </div>

          {/* Right Content - Testimonial Carousel */}
          <div className="relative animate-fade-in">
            <Surface
              variant="glass"
              padding="lg"
              radius="xl"
              border
              className="backdrop-blur-md"
            >
              <div className="space-y-6">
                {/* Testimonial Header */}
                <div className="flex items-center space-x-4">
                  <Surface
                    variant="elevated"
                    padding="none"
                    radius="full"
                    className="w-12 h-12 flex items-center justify-center gradient-web3-primary text-white font-bold shadow-glow"
                  >
                    {testimonials[currentTestimonial].avatar}
                  </Surface>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-accent-tertiary font-medium">
                      {testimonials[currentTestimonial].score}
                    </div>
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg leading-relaxed text-text-secondary">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                {/* Testimonial Indicators */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-accent-primary shadow-glow scale-125"
                          : "bg-border-default hover:bg-border-strong"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Surface>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-accent-tertiary/30 to-accent-primary/30 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-accent-primary/30 to-accent-secondary/30 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-border-default rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
