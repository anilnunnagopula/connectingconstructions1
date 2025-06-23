import React from "react";

const reviews = [
  {
    user: "Rahul Constructions",
    rating: 5,
    comment: "Excellent quality iron rods, very durable!",
    time: "2 days ago",
  },
  {
    user: "CityBuild Co.",
    rating: 4,
    comment: "Cement was good but delivery delayed slightly.",
    time: "3 days ago",
  },
  {
    user: "MahaStruct Ltd.",
    rating: 4.5,
    comment: "Great service and pricing!",
    time: "1 week ago",
  },
];

const RatingsTable = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        ⭐ Customer Feedback
      </h2>
      <ul className="space-y-5">
        {reviews.map((r, idx) => (
          <li
            key={idx}
            className="border-b pb-3 dark:border-gray-700 last:border-b-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {r.user}
                </p>
                <p className="text-sm text-gray-500 italic">"{r.comment}"</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-yellow-500">{r.rating} ★</p>
                <p className="text-xs text-gray-400">{r.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingsTable;
