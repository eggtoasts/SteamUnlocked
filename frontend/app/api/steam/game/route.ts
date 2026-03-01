import { NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
  //  /api/steam/user?id=.....
  const url = request.nextUrl;

  //get user id param
  const id = url.searchParams.get("id");

  const API_KEY = process.env.STEAM_API_KEY;

  //api endpoint for game information
  const endpointUrl = `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${id}`;

  // api endpoint for achievement percentages
  const achievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${id}&format=json`;

  let gameData: Game;
  let achievements: Achievement[] = [];

  //achievements
  try {
    const [metaRes, percentRes] = await Promise.all([
      fetch(endpointUrl),
      fetch(achievementsUrl),
    ]);

    const metaSchema = await metaRes.json();
    const percentSchema = await percentRes.json();

    const metaData = metaSchema.game.availableGameStats.achievements;
    const gameName = metaSchema.game.gameName;

    const percentData = percentSchema.achievementpercentages.achievements;

    //creates Map, [key : value]
    const gamesMap = new Map(
      percentData.map((item: any) => [item.name, { percent: item.percent }]),
    );

    //attach metaData information to map[name]
    metaData.forEach(
      (data: {
        name: string;
        displayName: string;
        description: string;
        icon: string;
        icongray: string;
        hidden: number;
      }) => {
        const name = data.name;
        const existing = gamesMap.get(name);
        const displayName = data.displayName;
        const description = data.description;
        const icon = data.icon;
        const icongray = data.icongray;
        const hidden = data.hidden;

        if (existing) {
          const achievementData: AchievementData = {
            ...existing,
            displayName,
            hidden,
            description,
            icon,
            icongray,
          };

          const achievement: Achievement = {
            name,
            achievementData,
          };

          achievements.push(achievement);
        }
      },
    );

    // Convert into Game type
    gameData = { gameName, achievements };

    return Response.json({ gameData });
  } catch {
    return Response.json({ error: Response.error });
  }
}
