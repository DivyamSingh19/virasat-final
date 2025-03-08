import React from 'react';
import { Lightbulb, ArrowRight, Telescope, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Lead at InnovateCo",
      quote: "The resources and mentorship provided here have been instrumental in our team's growth. We've seen a 40% increase in innovation output.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Startup Founder",
      quote: "The community support is unmatched. It's where groundbreaking ideas meet practical execution strategies.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Product Manager",
      quote: "A game-changer for our product development process. The tools and insights have accelerated our timeline significantly.",
      rating: 5
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className='text-center font-bold text-5xl'>Our Testimonials</h1>
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <Quote className="w-8 h-8 text-blue-500 mb-4" />
                <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;