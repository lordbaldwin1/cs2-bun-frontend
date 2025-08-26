import { env } from "~/env";
import { User } from "lucide-react";
import Image from "next/image";
import PlayerPagination from "./player-pagination";

type Players = {
  steamID: string;
  name: string;
  country: string;
  faceitURL: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

type PlayerCount = {
  count: number;
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { offset } = await searchParams || '0';

  const playerCountRes = await fetch(`${env.BACKEND_URL}/api/players/count`, {
    method: "GET",
    cache: "no-store",
  });
  const res = await fetch(`${env.BACKEND_URL}/api/players?offset=${offset}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok || !playerCountRes.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No players found, likely an issue on our end!
      </div>
    );
  }

  const playerCount = (await playerCountRes.json()) as PlayerCount;
  const players = (await res.json()) as Players[];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Players Analyzed
          </h1>
          <p className="text-lg text-muted-foreground">
            Data gathered from {playerCount.count.toLocaleString()} top European Faceit players
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-0">
          {players.map((player, idx) => (
            <div key={player.steamID} className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0">
              <div className="flex-shrink-0">
                {player.avatar && player.avatar.trim() !== '' ? (
                  <Image
                    src={player.avatar}
                    alt={`${player.name} avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    unoptimized={false}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted border-2 border-border" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4">
                  <a
                    href={player.faceitURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors duration-150"
                    title="View on Faceit"
                  >
                    {player.name}
                  </a>
                  <span className="text-muted-foreground text-sm">Country: {player.country}</span>
                  <span className="text-muted-foreground text-sm font-mono">Steam ID: {player.steamID}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <a
                  href={`https://leetify.com/app/profile/${player.steamID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-150 text-sm"
                  title="View on Leetify"
                >
                  Leetify
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <PlayerPagination playerCount={playerCount.count} />
        </div>
      </div>
    </div>
  );
}
