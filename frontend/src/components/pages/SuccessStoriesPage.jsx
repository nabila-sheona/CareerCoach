// src/components/pages/SuccessStoriesPage.jsx

import React from 'react';

const stories = [
  {
    id: 1,
    name: "Amina Rahman",
    role: "Software Engineer",
    story: "Thanks to CareerCoach's personalized coaching, I landed my dream job within 3 months!",
  },
  {
    id: 2,
    name: "Jamal Hossain",
    role: "Data Analyst",
    story: "The mock interviews helped me build confidence and improve my skills significantly.",
  },
  {
    id: 3,
    name: "Nadia Akter",
    role: "Product Manager",
    story: "CareerCoach's skill assessments pinpointed exactly where I needed to improve.",
  },
];

const SuccessStoriesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Success Stories
        </h1>

        <div className="space-y-8">
          {stories.map(({ id, name, role, story }) => (
            <div
              key={id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-blue-600">{name}</h2>
              <p className="text-sm text-gray-500 mb-4">{role}</p>
              <p className="text-gray-700">{story}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesPage;
