import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  //  /api/steam/user?id=.....
  const url = request.nextUrl;

  //get user id param
  const id = url.searchParams.get("id");

  //api endpoint
  const API_KEY = process.env.STEAM_API_KEY;
  const endpointUrl = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${id}&format=json`;

  try {
    const response = await fetch(endpointUrl);

    const data = await response.json();
    return Response.json({ data });
  } catch {
    return Response.json({ error: "Error, could not fetch." });
  }
}
