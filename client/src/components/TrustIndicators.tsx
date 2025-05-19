import { Check, Shield, Lock, Eye } from "lucide-react";

export function TrustIndicators() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold">Trusted By</h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-70">
          {[1, 2, 3, 4].map((partner) => (
            <div key={partner} className="grayscale hover:grayscale-0 transition-all">
              <div className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <svg 
                  viewBox="0 0 120 40" 
                  width="120" 
                  height="40" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-8"
                >
                  <rect width="120" height="40" fill="transparent" />
                  <text
                    x="60"
                    y="25"
                    fontFamily="Inter, sans-serif"
                    fontSize="12"
                    fontWeight="500"
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Partner {partner}
                  </text>
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
          <div className="bg-background p-4 rounded-lg shadow-sm flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">256-bit Encryption</span>
          </div>
          
          <div className="bg-background p-4 rounded-lg shadow-sm flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
          
          <div className="bg-background p-4 rounded-lg shadow-sm flex items-center space-x-2">
            <Eye className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
}
