import { Star, StarHalf } from "lucide-react";

type TestimonialProps = {
  name: string;
  occupation: string;
  rating: number;
  testimonial: string;
  avatarIndex: number;
};

const Testimonial = ({ name, occupation, rating, testimonial, avatarIndex }: TestimonialProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  // Generate an SVG avatar based on index
  const getAvatarSvg = (index: number) => {
    const colors = ['#4f46e5', '#2563eb', '#4338ca'];
    const bgColor = colors[index % colors.length];
    
    return (
      <svg className="w-12 h-12 rounded-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill={bgColor} />
        <circle cx="50" cy="35" r="20" fill="#e2e8f0" />
        <path d="M50 60 A40 40 0 0 1 90 100 L10 100 A40 40 0 0 1 50 60Z" fill="#e2e8f0" />
      </svg>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <div className="mr-4">
          {getAvatarSvg(avatarIndex)}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{occupation}</p>
        </div>
        <div className="ml-auto flex text-yellow-400">
          {renderStars()}
        </div>
      </div>
      <p className="text-muted-foreground">
        {testimonial}
      </p>
    </div>
  );
};

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      occupation: "Business Owner",
      rating: 5,
      testimonial: "The process was incredibly simple and fast. I received approval within hours and had the funds in my account the next day. Highly recommend!",
      avatarIndex: 0
    },
    {
      name: "Michael Chen",
      occupation: "IT Professional",
      rating: 4.5,
      testimonial: "The flexibility in EMI options really helped me manage my finances better. The customer service team was extremely helpful throughout the process.",
      avatarIndex: 1
    },
    {
      name: "Priya Sharma",
      occupation: "Healthcare Worker",
      rating: 5,
      testimonial: "I was skeptical at first, but the interest rate I received was actually lower than what other lenders offered. The entire experience was smooth and transparent.",
      avatarIndex: 2
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              occupation={testimonial.occupation}
              rating={testimonial.rating}
              testimonial={testimonial.testimonial}
              avatarIndex={testimonial.avatarIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
