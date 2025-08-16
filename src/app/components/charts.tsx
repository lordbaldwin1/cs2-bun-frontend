"use client";

import Example from "~/components/scatter-chart";
import type { Stats } from "../types";

export default function Charts({ pearson, scatter }: Stats) {
  const lr = scatter.map((player) => {
    return {
        lr: player.avgLR,
        wr: (player.avgWon*100),
        id: player.steamID,
    };
  });
  const hr = scatter.map((player) => {
    return {
        hr: player.avgHR,
        wr: player.avgWon,
        id: player.steamID,
    };
  });
  const kd = scatter.map((player) => {
    return {
        kd: player.avgKD,
        wr: player.avgWon,
        id: player.steamID,
    };
  });
  const aim = scatter.map((player) => {
    return {
        aim: player.avgAim,
        wr: (player.avgWon*100),
        id: player.steamID,
    };
  });
  const util = scatter.map((player) => {
    return {
        util: player.avgUtil,
        wr: player.avgWon,
        id: player.steamID,
    };
  });

  return (
    <Example name="Aim Rating" aim={aim} minX={findMinX(aim)} maxX={findMaxX(aim)} />
  )
}

function findMinX(obj: any[]) {
  let min = Number.POSITIVE_INFINITY;
  for (const item of obj) {
    min = item.aim < min ? item.aim : min;
  }
  return Math.floor(min / 5) * 5;;
}

function findMaxX(obj: any[]) {
  let max = Number.NEGATIVE_INFINITY;
  for (const item of obj) {
    max = item.aim > max ? item.aim : max;
  }
  return Math.ceil(max / 5) * 5;
}
