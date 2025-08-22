"use client";

import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";

interface FeaturesProps {
  onStartPractice: (page: "image-description" | "speaking") => void;
}

export default function Features({ onStartPractice }: FeaturesProps) {
  const features = [
    {
      icon: "🎤",
      title: "Speaking Test - Read Aloud",
      description:
        "Practice reading English text aloud with AI-powered pronunciation and fluency analysis.",
      points: [
        "Real-time speech recognition",
        "Pronunciation scoring",
        "Fluency assessment", 
        "Content accuracy evaluation",
      ],
      action: () => onStartPractice("speaking"),
      gradient: "from-accent-primary to-cyan-500",
      accentColor: "accent-primary",
    },
    {
      icon: "📷",
      title: "Image Description",
      description:
        "Describe images and get AI feedback on your vocabulary, grammar, and content accuracy.",
      points: [
        "AI image analysis",
        "Vocabulary assessment",
        "Grammar evaluation",
        "Content comparison",
      ],
      action: () => onStartPractice("image-description"),
      gradient: "from-accent-secondary to-purple-500",
      accentColor: "accent-secondary",
    },
    {
      icon: "📚",
      title: "Complete PTE Guide",
      description:
        "Comprehensive guide covering all PTE Academic test sections and question types.",
      points: [
        "Speaking & Writing tasks",
        "Reading comprehension",
        "Listening exercises",
        "Scoring system explained",
      ],
      action: () =>
        document
          .getElementById("pte-guide")
          ?.scrollIntoView({ behavior: "smooth" }),
      gradient: "from-accent-tertiary to-green-500",
      accentColor: "accent-tertiary",
    },
  ];

  return (
    <section className="py-20 px-4 bg-bg-subtle">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Practice with{" "}
            <span className="text-gradient">
              AI Precision
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Our advanced AI system provides detailed feedback on every aspect of
            your performance, helping you identify strengths and areas for
            improvement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Surface
              key={index}
              variant="elevated"
              padding="lg"
              radius="xl"
              border
              interactive
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Feature Icon */}
              <Surface
                variant="glass"
                padding="md"
                radius="xl"
                className={`w-16 h-16 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r ${feature.gradient} shadow-glow`}
              >
                {feature.icon}
              </Surface>

              {/* Feature Title */}
              <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-accent-primary transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-text-secondary mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Points */}
              <ul className="space-y-3 mb-8">
                {feature.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-center space-x-3 group/item">
                    <Surface
                      variant="default"
                      padding="none"
                      radius="full"
                      className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} shadow-sm group-hover/item:scale-125 transition-transform duration-200`}
                    />
                    <span className="text-text-secondary group-hover/item:text-text-primary transition-colors duration-200">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                glow
                onClick={feature.action}
                className={`bg-gradient-to-r ${feature.gradient} group-hover:shadow-xl`}
              >
                Try Now
              </Button>

              {/* Hover Glow Effect */}
              <div 
                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r ${feature.gradient} blur-xl -z-10`}
              />
            </Surface>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <Surface
            variant="glass"
            padding="lg"
            radius="xl"
            border
            className="inline-block backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to boost your PTE score?
            </h3>
            <p className="text-text-secondary mb-6">
              Join thousands of successful test-takers who improved their scores with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                glow
                onClick={() => onStartPractice("image-description")}
              >
                Start Free Practice
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("pte-guide")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Study Guide
              </Button>
            </div>
          </Surface>
        </div>
      </div>
    </section>
  );
}
