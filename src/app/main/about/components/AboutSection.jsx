// src/components/AboutSection.jsx
import React from 'react';

const AboutSection = ({ title, content, imageSrc, imageAlt, reverseOrder = false }) => {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${reverseOrder ? 'md:flex-row-reverse' : ''}`}>
      <div className="md:w-1/2">
        <h3 className="text-3xl font-semibold text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed text-sm md:text-md lg:max-w-xl">
          {content}
        </p>
      </div>
      <div className="md:w-1/2 flex justify-center">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="rounded-lg shadow-2xl object-cover w-full h-64 md:h-80 lg:h-96"
            style={{ minWidth: '300px' }} // Ensure image doesn't get too small
          />
        )}
      </div>
    </div>
  );
};

export default AboutSection;