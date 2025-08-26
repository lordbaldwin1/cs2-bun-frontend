"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

const INCREMENT = 50;
export default function PlayerPagination({
  playerCount,
}: {
  playerCount: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offset = searchParams.get("offset");

  const currentOffset = offset ? parseInt(offset) : 0;

  function increment() {
    const intOffset = currentOffset;
    if (intOffset >= (playerCount - INCREMENT)) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", (intOffset + INCREMENT).toString());
    router.push(`/players?${params.toString()}`);
  }

  function decrement() {
    const intOffset = currentOffset;
    if (intOffset < INCREMENT) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("offset", (intOffset - INCREMENT).toString());
    router.push(`/players?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        onClick={decrement}
        disabled={currentOffset < INCREMENT}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </Button>

      <Button
        onClick={increment}
        disabled={currentOffset >= (playerCount - INCREMENT)}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <span>Next</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
