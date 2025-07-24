import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 min-h-screen py-4 px-6 sm:px-8 lg:px-12 font-inter">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 dark:text-blue-400 drop-shadow-sm tracking-tight">
          🚀 About ConnectConstructions
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-10 w-full px-4 sm:px-6 md:px-8">
          Hey there! 👷‍♂️ I’m a{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Civil Engineering student
          </span>{" "}
          who’s passionate not just about structures, but also about shaping the
          future. With code in one hand and construction in the other, I’m
          building something BIG — a real-time platform to connect suppliers,
          builders, and innovators across the industry.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left my-12">
          <div className="bg-white dark:bg-gray-800 shadow-2xl p-6 sm:p-8 rounded-2xl hover:scale-[1.03] transition-transform duration-300">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
              🎯 Why this exists
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Searching for materials like <strong>cement</strong>,{" "}
              <strong>bricks</strong>, <strong>interiors</strong>, or finding
              services like <strong>borewells</strong> and{" "}
              <strong>contractors</strong> should be quick & simple. This
              platform bridges the gap between{" "}
              <span className="text-blue-700 dark:text-blue-300 font-semibold">
                suppliers
              </span>{" "}
              and{" "}
              <span className="text-blue-700 dark:text-blue-300 font-semibold">
                builders
              </span>{" "}
              seamlessly.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-2xl p-6 sm:p-8 rounded-2xl hover:scale-[1.03] transition-transform duration-300">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
              🛠️ Built with Purpose
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              I blended my tech skills with my civil engineering roots to create
              this solution. Developed with 💻 <strong>ReactJS</strong>, 💅{" "}
              <strong>TailwindCSS</strong>, and a whole lotta 💖 passion. This
              is more than a project — it's a mission.
            </p>
          </div>
        </div>

        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
          This is just the beginning of{" "}
          <span className="text-blue-700 dark:text-blue-300 font-semibold">
            digitizing the construction ecosystem
          </span>
          . It’s all about simplifying lives — whether you’re an engineer, a
          worker, or a future homeowner.
        </p>

        <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 italic">
          💡 Crafted with precision, passion & purpose by a fellow Civil who is Code
          enthusiast.
        </div>

        <div className="mt-4 text-xs text-blue-500 dark:text-blue-300">
          #ConnectingCoreAndCode
        </div>
      </div>
    </div>
  );
};

export default About;
