import React from "react";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 min-h-screen py-8 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-400 drop-shadow-sm">
          🚀 About ConnectConstructions
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Hello! 👋 I’m a{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Civil Engineering student
          </span>{" "}
          who’s not just passionate about structures and buildings, but also
          about building something bigger — a platform to connect the dots in
          the construction world.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left my-10">
          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              🎯 Why this exists
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Finding materials and services like cement, bricks, borewells,
              interiors, or even contractors should be quick and easy. This
              platform bridges the gap between{" "}
              <strong className="text-blue-700 dark:text-blue-300">
                suppliers
              </strong>{" "}
              and{" "}
              <strong className="text-blue-700 dark:text-blue-300">
                builders
              </strong>
              .
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-xl p-6 rounded-xl hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              🛠️ Built with Purpose
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Using my coding skills and love for Civil, I combined tech and
              tradition to build this solution — fully powered by 💻 React, 💅
              TailwindCSS, and pure dedication.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          It’s a step towards{" "}
          <strong className="text-blue-700 dark:text-blue-300">
            digitizing construction
          </strong>
          , making lives easier... for engineers, workers, and homeowners alike.
        </p>

        <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
          💡 Designed, developed & dreamt by a fellow Civil + Code enthusiast.
        </div>
      </div>
    </div>
  );
};

export default About;
