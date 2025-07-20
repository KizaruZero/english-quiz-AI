"use client";

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
      gradient: "from-blue-500 to-cyan-500",
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
      gradient: "from-purple-500 to-pink-500",
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
      gradient: "from-green-500 to-teal-500",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Practice with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Precision
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI system provides detailed feedback on every aspect of
            your performance, helping you identify strengths and areas for
            improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-xl shadow-gray-100 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <ul className="space-y-3 mb-8">
                {feature.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={feature.action}
                className={`w-full bg-gradient-to-r ${feature.gradient} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
