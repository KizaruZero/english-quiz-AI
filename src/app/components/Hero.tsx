"use client";

import { useState, useEffect } from "react";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Powered by Gemini 2.0 Flash AI</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  PTE Academic
                </span>{" "}
                with AI
              </h1>

              <p className="text-xl text-gray-200 leading-relaxed">
                Practice PTE Speaking and Image Description with advanced AI
                analysis. Get real-time feedback, detailed scoring, and
                personalized improvement suggestions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onStartPractice("image-description")}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📷</span>
                  <span>Try Image Description</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>

              <button
                onClick={() => onStartPractice("speaking")}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🎤</span>
                  <span>Practice Speaking</span>
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">15K+</div>
                <div className="text-sm text-gray-300">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">85%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-300">AI Available</div>
              </div>
            </div>
          </div>

          {/* Right Content - Testimonial Carousel */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-green-400">
                      {testimonials[currentTestimonial].score}
                    </div>
                  </div>
                </div>

                <blockquote className="text-lg leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                {/* Testimonial Indicators */}
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial
                          ? "bg-white"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
