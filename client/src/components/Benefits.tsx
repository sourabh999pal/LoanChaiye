import { Button } from "@/components/ui/button";
import { 
  Percent, 
  Clock, 
  Calendar
} from "lucide-react";

export function Benefits() {
  return (
    <section id="benefits" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose QuickLoan?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best loan experience with competitive rates and unmatched customer service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Percent className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Low Interest Rates</h3>
            <p className="text-muted-foreground">
              Our competitive interest rates ensure you get the best deal on your loan, saving you money in the long run.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <Clock className="text-green-600 dark:text-green-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quick Approval</h3>
            <p className="text-muted-foreground">
              Get your loan approved within hours, not days. Our streamlined process ensures you receive funds when you need them.
            </p>
          </div>
          
          <div className="bg-background p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
              <Calendar className="text-yellow-600 dark:text-yellow-400 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Flexible EMI Options</h3>
            <p className="text-muted-foreground">
              Choose from various repayment plans that suit your financial situation, with terms ranging from 6 to 60 months.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg font-medium mb-4">"Your dream is just a loan away"</p>
          <a href="#apply">
            <Button className="shadow-lg">
              Get Started
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
