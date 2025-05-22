import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import { useState } from "react";
import { Link as WouterLink } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  // Use the existing theme hook for now
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 bg-background backdrop-blur-sm bg-opacity-80 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <rect width="512" height="512" rx="60" fill="#1DA1F2" />
              <text
                x="50%"
                y="55%"
                fontFamily="'League Gothic', sans-serif"
                fontWeight="400"
                fontSize="260"
                fill="white"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                LC
              </text>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">Loan Chaiye</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors relative group py-2">
            Home
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
          </a>
          <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors relative group py-2">
            Benefits
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
          </a>
          <a href="#apply" className="text-sm font-medium hover:text-primary transition-colors relative group py-2">
            Apply Now
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors relative group py-2">
            Testimonials
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme} 
            aria-label="Toggle dark mode"
            className="rounded-full w-9 h-9"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <a href="#apply" className="hidden md:block">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
              <span>Apply Now</span>
              <span className="ml-2">→</span>
            </Button>
          </a>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 border-l border-gray-200 dark:border-gray-800">
              <div className="flex flex-col py-8 px-6">
                <div className="mb-8 flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center">
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 512 512"
                   >
                    <rect width="512" height="512" rx="60" fill="#1DA1F2" />
                    <text
                      x="50%"
                      y="55%"
                      fontFamily="'League Gothic', sans-serif"
                      fontWeight="400"
                      fontSize="260"
                      fill="white"
                      dominantBaseline="middle"
                      textAnchor="middle"
                     >
                      LC
                     </text>
                   </svg>
                  </div>
                  <span className="font-bold">Loan Chaiye</span>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <WouterLink href="/" onClick={() => setIsOpen(false)}>
                    <span className="block text-base font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Home</span>
                  </WouterLink>
                  <a href="#benefits" className="block text-base font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>Benefits</a>
                  <a href="#apply" className="block text-base font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>Apply Now</a>
                  <a href="#testimonials" className="block text-base font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>Testimonials</a>
                  <WouterLink href="/login" onClick={() => setIsOpen(false)}>
                    <span className="block text-base font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Admin Login</span>
                  </WouterLink>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <a href="#apply" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                      <span>Apply Now</span>
                      <span className="ml-2">→</span>
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
