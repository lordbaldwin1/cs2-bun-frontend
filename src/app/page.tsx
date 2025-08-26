import { env } from "~/env";
import type { Stats } from "./types";
import Charts from "../components/charts";

export default async function HomePage() {
  const res = await fetch(`${env.BACKEND_URL}/api/stats`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😵</div>
          <h1 className="text-2xl font-bold text-destructive">UH OH.... WHERE ARE THE CHARTS!?</h1>
          <p className="text-muted-foreground">Something went wrong loading the data</p>
        </div>
      </div>
    );
  }

  const data = (await res.json()) as Stats;
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Performance Insights</h2>
          <p className="text-muted-foreground text-lg">
            Analyze the correlation between player metrics and win rates across different skill dimensions
          </p>
        </div>

        <Charts pearson={data.pearson} scatter={data.scatter} />

        <div className="mt-12 flex justify-center items-center space-x-4">
          <div className="text-center">
            <a 
              href="https://leetify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img 
                src="/leetify-badge-black-small.png" 
                alt="Leetify Badge" 
                className="h-16 w-auto dark:hidden"
              />
              <img 
                src="/leetify-badge-white-small.png" 
                alt="Leetify Badge" 
                className="h-16 w-auto hidden dark:block"
              />
            </a>
            <p className="text-sm text-muted-foreground mt-3">
              Powered by{" "}
              <a 
                href="https://leetify.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors"
              >
                Leetify
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-center text-muted-foreground text-sm">
            <p>CS2 Analytics Dashboard • Analyzing {data.scatter.length} player profiles</p>
          </div>
        </div>
      </main>
    </div>
  );
}
