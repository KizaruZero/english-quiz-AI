"use client";

import { useState } from "react";

interface TaskData {
  title: string;
  tested: string;
  task: string;
  tips: string;
}

interface TestData {
  [section: string]: {
    [taskId: string]: TaskData;
  };
}

export default function PTEGuide() {
  const [activeSection, setActiveSection] =
    useState<string>("speaking-writing");
  const [activeTask, setActiveTask] = useState<string>("");

  const testData: TestData = {
    "speaking-writing": {
      "personal-introduction": {
        title: "Personal Introduction",
        tested: "Kemampuan berbicara secara spontan dan memperkenalkan diri.",
        task: "Anda memiliki 25 detik untuk membaca instruksi dan 30 detik untuk merekam perkenalan diri Anda. Bagian ini tidak dinilai tetapi akan dikirimkan ke institusi bersama dengan laporan skor Anda.",
        tips: "Siapkan perkenalan singkat tentang diri Anda, minat, dan tujuan Anda. Bicaralah dengan jelas dan percaya diri.",
      },
      "read-aloud": {
        title: "Read Aloud",
        tested:
          "Reading & Speaking. Pengucapan, kelancaran, dan pemahaman bacaan.",
        task: "Sebuah teks (hingga 60 kata) akan muncul di layar. Anda memiliki 30-40 detik untuk persiapan, kemudian rekam diri Anda membaca teks tersebut dengan lantang.",
        tips: "Bacalah teks dalam hati terlebih dahulu. Perhatikan tanda baca untuk intonasi. Bicaralah dengan kecepatan normal dan jelas.",
      },
      "repeat-sentence": {
        title: "Repeat Sentence",
        tested:
          "Listening & Speaking. Kemampuan mendengarkan, mengingat, dan mengulang kalimat.",
        task: "Anda akan mendengar sebuah kalimat singkat (3-9 detik). Setelah selesai, segera ulangi kalimat tersebut persis seperti yang Anda dengar.",
        tips: "Fokus pada alur dan makna kalimat, bukan hanya kata-kata individu. Ulangi dengan intonasi yang sama.",
      },
      "describe-image": {
        title: "Describe Image",
        tested:
          "Speaking. Kemampuan mendeskripsikan informasi visual secara terstruktur dan lancar.",
        task: "Anda akan melihat sebuah gambar (grafik, peta, bagan, atau foto). Anda punya 25 detik untuk mempelajari gambar tersebut, lalu 40 detik untuk mendeskripsikannya.",
        tips: "Mulailah dengan gambaran umum. Sebutkan poin-poin utama atau tren. Akhiri dengan kesimpulan atau implikasi jika ada.",
      },
      "retell-lecture": {
        title: "Re-tell Lecture",
        tested:
          "Listening & Speaking. Kemampuan memahami inti dari sebuah perkuliahan dan menyampaikannya kembali.",
        task: "Anda akan mendengarkan atau menonton sebuah perkuliahan singkat (hingga 90 detik). Setelah selesai, Anda punya 10 detik untuk bersiap dan 40 detik untuk menceritakan kembali poin-poin utama dari perkuliahan tersebut.",
        tips: "Buat catatan tentang ide utama dan detail pendukung saat mendengarkan. Gunakan catatan Anda untuk menyusun jawaban.",
      },
      "answer-short-question": {
        title: "Answer Short Question",
        tested:
          "Listening & Speaking. Pengetahuan umum dan kemampuan merespons dengan cepat.",
        task: "Anda akan mendengar sebuah pertanyaan singkat (misalnya 'What is the opposite of hot?'). Jawablah dengan satu atau beberapa kata.",
        tips: "Jawab dengan cepat dan singkat. Jika tidak tahu, coba tebak. Tidak ada penalti untuk jawaban salah.",
      },
      "summarize-written-text": {
        title: "Summarize Written Text",
        tested:
          "Reading & Writing. Kemampuan mengidentifikasi ide pokok dan merangkumnya.",
        task: "Anda akan membaca sebuah teks (hingga 300 kata). Anda memiliki 10 menit untuk menulis rangkuman teks tersebut dalam satu kalimat (5-75 kata).",
        tips: "Identifikasi kalimat topik atau ide utama dari teks. Gabungkan ide-ide tersebut menggunakan kata hubung yang tepat menjadi satu kalimat kompleks.",
      },
      "write-essay": {
        title: "Write Essay",
        tested:
          "Writing. Kemampuan menulis esai argumentatif atau diskursif yang terstruktur dengan baik.",
        task: "Anda akan diberikan sebuah topik esai. Anda memiliki 20 menit untuk merencanakan, menulis, dan merevisi esai sepanjang 200-300 kata.",
        tips: "Buat kerangka singkat: pendahuluan, 2-3 paragraf isi, dan kesimpulan. Gunakan kosakata yang bervariasi dan struktur kalimat yang kompleks. Sisakan waktu untuk memeriksa ejaan dan tata bahasa.",
      },
    },
    reading: {
      "fill-in-the-blanks-rw": {
        title: "Reading & Writing: Fill in the Blanks",
        tested:
          "Reading & Writing. Pemahaman konteks, tata bahasa, dan kosakata.",
        task: "Anda akan melihat sebuah teks dengan beberapa bagian kosong. Setiap bagian kosong memiliki menu dropdown dengan beberapa pilihan kata. Pilih kata yang paling tepat untuk setiap bagian kosong.",
        tips: "Perhatikan kata-kata di sekitar bagian kosong untuk petunjuk tata bahasa (misalnya preposisi) dan makna.",
      },
      "multiple-choice-multiple": {
        title: "Multiple Choice, Choose Multiple Answers",
        tested:
          "Reading. Kemampuan mengidentifikasi lebih dari satu informasi atau ide utama dari teks.",
        task: "Baca sebuah teks dan jawab pertanyaan dengan memilih lebih dari satu opsi jawaban yang benar. Ada penalti untuk pilihan yang salah.",
        tips: "Baca pertanyaan terlebih dahulu untuk mengetahui apa yang harus dicari. Evaluasi setiap opsi terhadap informasi dalam teks. Hanya pilih jawaban yang Anda 100% yakin benar.",
      },
      "reorder-paragraphs": {
        title: "Re-order Paragraphs",
        tested:
          "Reading. Kemampuan memahami struktur logis dan alur sebuah teks.",
        task: "Beberapa kotak teks akan ditampilkan dalam urutan acak. Seret dan susun kembali kotak-kotak tersebut ke dalam urutan yang benar untuk membentuk sebuah paragraf yang koheren.",
        tips: "Cari kalimat topik (biasanya yang paling umum). Cari kata kunci atau kata ganti yang merujuk antar kalimat untuk menemukan hubungan logis.",
      },
      "fill-in-the-blanks-r": {
        title: "Reading: Fill in the Blanks",
        tested: "Reading. Pemahaman konteks dan kosakata.",
        task: "Anda akan melihat sebuah teks dengan beberapa bagian kosong. Di bawah teks, ada sebuah kotak berisi beberapa kata (lebih banyak dari jumlah bagian kosong). Seret kata yang tepat ke setiap bagian kosong.",
        tips: "Baca seluruh teks terlebih dahulu untuk mendapatkan gambaran umum. Coba setiap kata yang mungkin dan lihat mana yang paling masuk akal secara gramatikal dan kontekstual.",
      },
      "multiple-choice-single": {
        title: "Multiple Choice, Choose Single Answer",
        tested:
          "Reading. Kemampuan memahami, mengidentifikasi, atau menyimpulkan informasi spesifik dari teks.",
        task: "Baca sebuah teks dan jawab pertanyaan dengan memilih satu opsi jawaban yang paling tepat.",
        tips: "Gunakan teknik skimming dan scanning untuk menemukan bagian teks yang relevan dengan pertanyaan. Hilangkan opsi jawaban yang jelas salah.",
      },
    },
    listening: {
      "summarize-spoken-text": {
        title: "Summarize Spoken Text",
        tested:
          "Listening & Writing. Kemampuan memahami inti dari rekaman audio dan merangkumnya secara tertulis.",
        task: "Anda akan mendengarkan sebuah rekaman audio singkat (60-90 detik). Setelah selesai, Anda memiliki 10 menit untuk menulis rangkuman poin-poin utama dalam 50-70 kata.",
        tips: "Buat catatan saat mendengarkan. Fokus pada ide utama. Pastikan rangkuman Anda akurat dan mencakup poin-poin penting.",
      },
      "multiple-choice-multiple-l": {
        title: "Multiple Choice, Choose Multiple Answers",
        tested:
          "Listening. Kemampuan mengidentifikasi beberapa detail dari rekaman audio.",
        task: "Dengarkan rekaman audio dan jawab pertanyaan dengan memilih lebih dari satu opsi jawaban yang benar. Ada penalti untuk pilihan yang salah.",
        tips: "Baca opsi jawaban sebelum audio dimulai. Centang opsi yang Anda dengar disebut atau diimplikasikan dalam rekaman.",
      },
      "fill-in-the-blanks-l": {
        title: "Fill in the Blanks",
        tested:
          "Listening & Writing. Kemampuan menangkap kata-kata yang hilang dari transkrip sambil mendengarkan.",
        task: "Anda akan melihat transkrip sebuah rekaman dengan beberapa kata yang hilang. Dengarkan rekaman dan ketik kata-kata yang hilang di bagian yang kosong.",
        tips: "Baca transkrip sekilas sebelum audio dimulai. Ikuti teks dengan kursor Anda saat mendengarkan. Ejaan harus benar.",
      },
      "highlight-correct-summary": {
        title: "Highlight Correct Summary",
        tested:
          "Listening & Reading. Kemampuan memahami inti dari sebuah rekaman dan memilih rangkuman tertulis yang paling akurat.",
        task: "Dengarkan rekaman audio. Setelah itu, baca beberapa paragraf rangkuman dan pilih salah satu yang paling akurat mewakili isi rekaman.",
        tips: "Waspadai rangkuman yang mengandung informasi salah atau hanya sebagian benar. Pilih yang paling komprehensif dan akurat.",
      },
      "multiple-choice-single-l": {
        title: "Multiple Choice, Choose Single Answer",
        tested:
          "Listening. Kemampuan memahami informasi spesifik, tujuan, atau sikap pembicara dari rekaman.",
        task: "Dengarkan rekaman audio dan jawab pertanyaan dengan memilih satu opsi jawaban yang paling tepat.",
        tips: "Fokus pada apa yang ditanyakan (misalnya, alasan, kesimpulan, detail). Dengarkan dengan seksama untuk menemukan jawabannya.",
      },
      "select-missing-word": {
        title: "Select Missing Word",
        tested:
          "Listening. Kemampuan memprediksi kata atau frasa logis berikutnya dalam sebuah kalimat.",
        task: "Anda akan mendengarkan sebuah rekaman yang berakhir tiba-tiba dengan bunyi 'bip'. Pilih kata atau frasa yang paling mungkin untuk melengkapi kalimat tersebut dari beberapa pilihan.",
        tips: "Perhatikan konteks dan alur kalimat untuk mengantisipasi kata apa yang akan datang.",
      },
      "highlight-incorrect-words": {
        title: "Highlight Incorrect Words",
        tested:
          "Listening & Reading. Kemampuan membandingkan transkrip tertulis dengan audio yang didengar dan menemukan perbedaannya.",
        task: "Anda akan melihat transkrip sebuah rekaman. Saat Anda mendengarkan rekaman, klik pada kata-kata di transkrip yang berbeda dari apa yang diucapkan.",
        tips: "Ikuti transkrip dengan kursor mouse Anda. Klik dengan cepat saat Anda mendengar perbedaan. Ada penalti untuk klik yang salah.",
      },
      "write-from-dictation": {
        title: "Write from Dictation",
        tested:
          "Listening & Writing. Kemampuan mengingat dan menulis kalimat yang didengar dengan akurat.",
        task: "Anda akan mendengar sebuah kalimat singkat. Ketik kalimat tersebut persis seperti yang Anda dengar. Ejaan dan tanda baca harus benar.",
        tips: "Ketik kalimat di kepala Anda atau gunakan notepad di layar saat mendengarkan. Periksa kembali tulisan Anda sebelum lanjut.",
      },
    },
  };

  const sections = [
    {
      id: "speaking-writing",
      name: "🗣️ Speaking & Writing",
      color: "from-blue-500 to-cyan-500",
    },
    { id: "reading", name: "📖 Reading", color: "from-green-500 to-teal-500" },
    {
      id: "listening",
      name: "🎧 Listening",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const firstTask = Object.keys(testData[sectionId])[0];
    setActiveTask(firstTask);
  };

  const handleTaskChange = (taskId: string) => {
    setActiveTask(taskId);
  };

  // Initialize first task when component mounts
  useState(() => {
    if (testData[activeSection]) {
      const firstTask = Object.keys(testData[activeSection])[0];
      setActiveTask(firstTask);
    }
  });

  return (
    <section
      id="pte-guide"
      className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Complete{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PTE Academic Guide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore every section of the Pearson Test of English (PTE) Academic.
            Understand test structure, question types, and scoring system
            comprehensively.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Section Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex flex-wrap justify-center" aria-label="Tabs">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex-1 min-w-0 text-lg py-6 px-4 font-semibold text-center transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Task Sidebar */}
              <aside className="lg:col-span-1">
                <h3 className="font-bold text-2xl mb-6 text-gray-800">
                  Task Types
                </h3>
                <div className="space-y-2">
                  {testData[activeSection] &&
                    Object.entries(testData[activeSection]).map(
                      ([taskId, taskData]) => (
                        <button
                          key={taskId}
                          onClick={() => handleTaskChange(taskId)}
                          className={`w-full text-left p-4 rounded-xl font-medium transition-all duration-300 ${
                            activeTask === taskId
                              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105"
                              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                          }`}
                        >
                          {taskData.title}
                        </button>
                      )
                    )}
                </div>
              </aside>

              {/* Task Details */}
              <section className="lg:col-span-3">
                {testData[activeSection] &&
                  testData[activeSection][activeTask] && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 min-h-[500px]">
                      <h2 className="text-4xl font-bold text-indigo-700 mb-8">
                        {testData[activeSection][activeTask].title}
                      </h2>

                      <div className="space-y-8">
                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                              🔎
                            </span>
                            What's Being Tested
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {testData[activeSection][activeTask].tested}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                            <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                              📝
                            </span>
                            Your Task
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {testData[activeSection][activeTask].task}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md">
                          <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                            <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                              💡
                            </span>
                            Tips & Strategy
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {testData[activeSection][activeTask].tips}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </section>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            PTE{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scoring System
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <span className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
                  🎯
                </span>
                Communicative Skills
              </h3>
              <p className="text-gray-700 mb-6">
                These scores reflect your ability in the four main English
                language skills.
              </p>
              <div className="space-y-4">
                {[
                  { skill: "Listening", desc: "Understanding spoken English" },
                  { skill: "Reading", desc: "Understanding written English" },
                  {
                    skill: "Speaking",
                    desc: "Speaking English clearly and fluently",
                  },
                  {
                    skill: "Writing",
                    desc: "Writing clear and structured English texts",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-md"
                  >
                    <div className="font-semibold text-blue-700">
                      {item.skill}
                    </div>
                    <div className="text-gray-600 text-sm">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-4">
                  ⚙️
                </span>
                Enabling Skills
              </h3>
              <p className="text-gray-700 mb-6">
                These provide insights into your performance on sub-skills that
                support communication.
              </p>
              <div className="space-y-3">
                {[
                  { skill: "Grammar", desc: "Correct use of grammar" },
                  {
                    skill: "Oral Fluency",
                    desc: "Natural and smooth speaking pace",
                  },
                  {
                    skill: "Pronunciation",
                    desc: "Clear and understandable pronunciation",
                  },
                  { skill: "Spelling", desc: "Correct spelling usage" },
                  {
                    skill: "Vocabulary",
                    desc: "Range and accuracy of vocabulary",
                  },
                  {
                    skill: "Written Discourse",
                    desc: "Coherence and structure in writing",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-3 shadow-md"
                  >
                    <div className="font-semibold text-green-700 text-sm">
                      {item.skill}
                    </div>
                    <div className="text-gray-600 text-xs">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
