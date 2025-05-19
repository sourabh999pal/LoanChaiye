import { Check } from "lucide-react";

export function SpecialOffers() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Special Offers for First-Time Borrowers</h2>
            <p className="mb-6 text-blue-100">
              Take advantage of our exclusive introductory rates and benefits available only to new customers.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mt-1 mr-2 flex-shrink-0" />
                <span>0% processing fee for all first-time applicants</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mt-1 mr-2 flex-shrink-0" />
                <span>Additional 0.5% interest rate reduction</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-300 mt-1 mr-2 flex-shrink-0" />
                <span>Complimentary financial consultation</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/2">
            <svg 
              className="w-full h-auto rounded-xl shadow-2xl" 
              viewBox="0 0 800 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="800" height="500" rx="16" fill="#2563eb" />
              <path d="M0 0L800 500H0V0Z" fill="#4338ca" />
              <circle cx="400" cy="250" r="150" fill="#6366f1" />
              <path d="M250 200L350 300L250 350L150 300L250 250Z" fill="#818cf8" />
              <path d="M550 150L650 250L550 350L450 250L550 150Z" fill="#818cf8" />
              <circle cx="400" cy="250" r="50" fill="#c7d2fe" />
              <path d="M380 230L420 230L420 270L380 270L380 230Z" fill="#4f46e5" />
              <path d="M400 200L420 230L400 260L380 230L400 200Z" fill="#4f46e5" />
              <path d="M400 300L420 270L400 240L380 270L400 300Z" fill="#4f46e5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
