"use client";
import { useState, useEffect } from "react";

export interface Game {
  gameName: string;
  achievements: Achievement[];
}
export interface Achievement {
  name: string;
  achievementData: AchievementData;
}

export interface AchievementData {
  displayName: string;
  description: string;
  hidden: number;
  icongray: string;
  icon: string;
  percent?: string;
}

export default function Home() {
  // Initialize as null so we can check if data has loaded
  const [game, setGame] = useState<Game | null>(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch("/api/steam/game?id=105600");
      const data = await res.json();
      console.log(data.gameData);
      setGame(data.gameData);
    };
    fetchGame();
  }, []);

  if (!game) return <div>Loading data...</div>;

  return (
    <div className="p-8 font-sans flex flex-col gap-3 ">
      <input type="text" className="border rounded-2xl" />
      <h1>{game.gameName} Achievements</h1>

      <div className="flex h-100 gap-0 bg-gray-400">
        {game.achievements.map((ach, index) => {
          const data = ach.achievementData;
          const percent = data.percent;

          return (
            <div
              key={index}
              className="w-2 bg-green-500"
              style={{ height: `${percent}%` }}
            ></div>
          );
        })}
      </div>

      {game.achievements.map((ach, index) => {
        const data = ach.achievementData;
        const name = data.displayName;
        const desc = data.description;
        const percent = data.percent;
        const icon = data.icon;

        return (
          <div key={index} className="relative flex h-fit border items-center">
            <img className="h-20 w-20 object-cover" src={icon} />
            <div className="flex flex-col mx-2">
              <p className="font-bold">{name}</p>
              <p className="text-xs">{desc}</p>
            </div>

            <div
              style={{ width: `${percent}%` }}
              className={`left-20 z-[-2] h-full flex absolute  bg-amber-500`}
            ></div>
            <p className="ml-auto">{percent} %</p>
          </div>
        );
      })}
    </div>
  );
}
