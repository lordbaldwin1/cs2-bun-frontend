import { env } from "~/env";
import type { Stats } from "./types";
import Charts from "./components/charts";

export default async function HomePage() {
  const res = await fetch(`${env.BACKEND_URL}/api/stats`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        UH OH.... WHERE ARE THE CHARTS!?
      </div>
    );
  }

  const data = (await res.json()) as Stats;
  return (
    <div>
      <h1>Hi</h1>
      <Charts pearson={data.pearson} scatter={data.scatter} />
    </div>
  );
}
