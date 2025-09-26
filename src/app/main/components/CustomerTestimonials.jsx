// src/components/CustomerTestimonials.jsx
import React from 'react';

const testimonials = [
  {
    id: 1,
    quote: "MyStore has the best collection of trendy clothes! The quality is superb, and shipping is incredibly fast. I'm a customer for life!",
    author: "Priya Sharma",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg" // Placeholder avatar
  },
  {
    id: 2,
    quote: "I found exactly what I was looking for, and the checkout process was seamless. Highly recommend their unique unisex section!",
    author: "Rahul Verma",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg" // Placeholder avatar
  },
  {
    id: 3,
    quote: "The kids' collection is adorable and durable. My son loves his new dinosaur hoodie. Great value for money!",
    author: "Anaya Kaur",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg" // Placeholder avatar
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
  );
};

const CustomerTestimonials = () => {
  return (
    <section className="text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
              <StarRating rating={testimonial.rating} />
              <p className="text-md italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <p className="font-semibold text-gray-200">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;