import { AnimatedCounter } from "@/components/AnimatedCounter";

export function StatsCounter() {
  return (
    <section className="py-16 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold mb-2 text-primary">
              <AnimatedCounter endValue={20000} suffix="+" />
            </div>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
              <AnimatedCounter endValue={94} suffix="%" />
            </div>
            <p className="text-muted-foreground">Approval Rate</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl text-center transform hover:scale-105 transition-transform">
            <div className="text-4xl font-bold mb-2 text-green-600 dark:text-green-400">
              <AnimatedCounter endValue={2} suffix=" hours" />
            </div>
            <p className="text-muted-foreground">Average Approval Time</p>
          </div>
        </div>
      </div>
    </section>
  );
}
