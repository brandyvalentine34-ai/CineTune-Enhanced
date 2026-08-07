import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Increase payload limits for audio base64 data
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client safely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Schema for Movie Music Identification
const identifyResultSchema = {
  type: Type.OBJECT,
  properties: {
    song: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        artist: { type: Type.STRING },
        album: { type: Type.STRING },
        releaseYear: { type: Type.STRING },
        genre: { type: Type.STRING },
        spotifySearchUrl: { type: Type.STRING },
        youtubeSearchUrl: { type: Type.STRING },
        appleMusicSearchUrl: { type: Type.STRING }
      },
      required: ["title", "artist", "spotifySearchUrl", "youtubeSearchUrl"]
    },
    primaryMovie: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        movieTitle: { type: Type.STRING },
        releaseYear: { type: Type.STRING },
        director: { type: Type.STRING },
        genre: { type: Type.STRING },
        posterUrl: { type: Type.STRING },
        sceneDescription: { type: Type.STRING },
        timestamp: { type: Type.STRING },
        sceneMood: { type: Type.STRING },
        characterContext: { type: Type.STRING },
        isThemeSong: { type: Type.BOOLEAN },
        isEndCredits: { type: Type.BOOLEAN },
        imdbOrWikiUrl: { type: Type.STRING },
        trivia: { type: Type.STRING },
        otherMoviesFeaturedIn: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["movieTitle", "releaseYear", "director", "sceneDescription", "timestamp", "sceneMood", "trivia"]
    },
    otherMovieMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          movieTitle: { type: Type.STRING },
          releaseYear: { type: Type.STRING },
          director: { type: Type.STRING },
          genre: { type: Type.STRING },
          posterUrl: { type: Type.STRING },
          sceneDescription: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          sceneMood: { type: Type.STRING },
          characterContext: { type: Type.STRING },
          isThemeSong: { type: Type.BOOLEAN },
          isEndCredits: { type: Type.BOOLEAN },
          imdbOrWikiUrl: { type: Type.STRING },
          trivia: { type: Type.STRING }
        },
        required: ["movieTitle", "releaseYear", "sceneDescription"]
      }
    },
    matchConfidence: { type: Type.NUMBER },
    recognizedLyrics: { type: Type.STRING },
    musicCharacteristics: { type: Type.STRING },
    identificationTip: { type: Type.STRING }
  },
  required: ["song", "primaryMovie", "matchConfidence", "musicCharacteristics"]
};

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Spotify Status & Redirect URI Helper
const getSpotifyRedirectUri = (req: express.Request) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
  return `${baseUrl.replace(/\/$/, "")}/api/auth/spotify/callback`;
};

app.get("/api/spotify/status", (req, res) => {
  const redirectUri = getSpotifyRedirectUri(req);
  res.json({
    configured: !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET),
    redirectUri,
  });
});

// Spotify OAuth URL Generator
app.get("/api/auth/spotify/url", (req, res) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = getSpotifyRedirectUri(req);

  if (!clientId) {
    return res.status(400).json({
      configured: false,
      error: "SPOTIFY_CLIENT_ID environment variable is not configured.",
      redirectUri,
    });
  }

  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  return res.json({ configured: true, url: authUrl, redirectUri });
});

// Spotify OAuth Callback Route
const spotifyCallbackHandler = async (req: express.Request, res: express.Response) => {
  const { code, error } = req.query;
  const redirectUri = getSpotifyRedirectUri(req);
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (error || !code || typeof code !== "string") {
    return res.send(`
      <html>
        <body style="background:#090d16; color:#fff; font-family:sans-serif; display:flex; align-items:center; justify-center; height:100vh; margin:0; text-align:center;">
          <div>
            <h2 style="color:#f43f5e;">Spotify Authorization Failed</h2>
            <p>${error || "No authorization code received."}</p>
            <script>
              setTimeout(() => window.close(), 3000);
            </script>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to exchange authorization code");
    }

    // Get user profile
    let user = null;
    if (tokens.access_token) {
      const userRes = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      if (userRes.ok) {
        user = await userRes.json();
      }
    }

    return res.send(`
      <html>
        <body style="background:#090d16; color:#fff; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center;">
          <div style="background:#111827; padding:2rem; border-radius:1rem; border:1px solid #1f2937; max-width:400px;">
            <div style="width:48px; height:48px; background:#1db954; border-radius:50%; margin:0 auto 1rem; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:24px; color:#000;">✓</div>
            <h2 style="margin:0 0 0.5rem 0; font-size:1.25rem;">Connected to Spotify!</h2>
            <p style="color:#9ca3af; font-size:0.875rem; margin-bottom:1.5rem;">Welcome ${user?.display_name || "Music Lover"}. Returning to CineTune...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'SPOTIFY_AUTH_SUCCESS',
                  tokens: ${JSON.stringify(tokens)},
                  user: ${JSON.stringify(user)}
                }, '*');
                setTimeout(() => window.close(), 1200);
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("Spotify Auth Callback Error:", err);
    return res.send(`
      <html>
        <body style="background:#090d16; color:#fff; font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; text-align:center;">
          <div>
            <h2 style="color:#f43f5e;">Authentication Error</h2>
            <p style="color:#9ca3af;">${err?.message || "Failed to exchange token with Spotify."}</p>
          </div>
        </body>
      </html>
    `);
  }
};

app.get(["/api/auth/spotify/callback", "/api/auth/spotify/callback/"], spotifyCallbackHandler);

// Audio Identification Endpoint
app.post("/api/identify-audio", async (req, res) => {
  try {
    const { audioBase64, mimeType, userHint } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "Missing audioBase64 in request body." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
    }

    const cleanMime = mimeType || "audio/webm";
    // Strip header if present in base64 string
    const rawData = audioBase64.replace(/^data:audio\/[a-zA-Z0-9]+;base64,/, "");

    const promptText = `
You are CineTune, an expert film music historian and audio identification engine for movie soundtracks.
Analyze the attached audio recording (which could be a recording of a song, a film background score, a live TV snippet, or someone humming/singing a melody).

${userHint ? `User context/hint provided: "${userHint}"` : ""}

YOUR TASK:
1. Identify the exact song or musical track, including title, artist, album, release year, and genre.
2. Identify the PRIMARY MOVIE that famously features this song or score!
   - Provide the movie title, release year, director, and genre.
   - Describe the EXACT SCENE in vivid detail (what happens on screen, timestamps if known e.g. "01:24:10" or "Opening Scene", character actions).
   - Describe the scene mood (e.g. "Adrenaline climax", "Heartbreaking farewell").
   - Indicate if it is the main theme song or end credits song.
   - Provide fascinating film trivia about why or how this song was chosen for the movie.
3. List any OTHER notable movies or TV shows where this song also appeared.
4. Calculate a match confidence percentage (e.g. 85 to 99).
5. Generate a search link for Spotify and YouTube for the identified song.
6. Return high quality imagery URLs from Unsplash (films/cinema themed or cinematic scenery) for posterUrl.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: rawData
          }
        },
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: identifyResultSchema,
        temperature: 0.2
      }
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    // Ensure fallback search URLs if missing
    if (parsedData.song) {
      const q = encodeURIComponent(`${parsedData.song.artist || ''} ${parsedData.song.title || ''} soundtrack`);
      parsedData.song.spotifySearchUrl = parsedData.song.spotifySearchUrl || `https://open.spotify.com/search/${q}`;
      parsedData.song.youtubeSearchUrl = parsedData.song.youtubeSearchUrl || `https://www.youtube.com/results?search_query=${q}`;
      parsedData.song.id = parsedData.song.id || `song-${Date.now()}`;
    }

    if (parsedData.primaryMovie) {
      parsedData.primaryMovie.id = parsedData.primaryMovie.id || `movie-${Date.now()}`;
      if (!parsedData.primaryMovie.posterUrl || !parsedData.primaryMovie.posterUrl.startsWith('http')) {
        parsedData.primaryMovie.posterUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop";
      }
    }

    return res.json({ success: true, result: parsedData });
  } catch (error: any) {
    console.error("Error in /api/identify-audio:", error);
    return res.status(500).json({
      error: "Failed to identify audio",
      details: error?.message || "Internal server error"
    });
  }
});

// Text, Lyrics, or Humming Search Endpoint
app.post("/api/search-soundtrack", async (req, res) => {
  try {
    const { query, searchType } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
    }

    const typeDesc = searchType === 'humming'
      ? "humming melody description or notes"
      : searchType === 'lyrics'
      ? "lyrics snippet"
      : "song name, artist, or movie scene description";

    const promptText = `
You are CineTune, an expert film music identifier.
The user is searching for a movie song using a ${typeDesc}: "${query}".

YOUR TASK:
Find the most famous or accurate matching song and the MOVIE(S) it was featured in.
- Identify the exact song title, artist, album, year, genre.
- Identify the primary movie, director, year, and EXACT scene description (with timestamp if applicable).
- Describe character context, scene mood, trivia, and whether it's a theme/end credits song.
- List any other movies or TV shows where this song also appeared.
- Give a match confidence score (e.g. 90-99%).
- Provide Spotify & YouTube search links.
- Set a valid high quality cinematic Unsplash image for posterUrl.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: identifyResultSchema,
        temperature: 0.3
      }
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    if (parsedData.song) {
      const q = encodeURIComponent(`${parsedData.song.artist || ''} ${parsedData.song.title || ''} soundtrack`);
      parsedData.song.spotifySearchUrl = parsedData.song.spotifySearchUrl || `https://open.spotify.com/search/${q}`;
      parsedData.song.youtubeSearchUrl = parsedData.song.youtubeSearchUrl || `https://www.youtube.com/results?search_query=${q}`;
      parsedData.song.id = parsedData.song.id || `song-${Date.now()}`;
    }

    if (parsedData.primaryMovie) {
      parsedData.primaryMovie.id = parsedData.primaryMovie.id || `movie-${Date.now()}`;
      if (!parsedData.primaryMovie.posterUrl || !parsedData.primaryMovie.posterUrl.startsWith('http')) {
        parsedData.primaryMovie.posterUrl = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop";
      }
    }

    return res.json({ success: true, result: parsedData });
  } catch (error: any) {
    console.error("Error in /api/search-soundtrack:", error);
    return res.status(500).json({
      error: "Failed to search soundtrack",
      details: error?.message || "Internal server error"
    });
  }
});

// Quiz Generator Endpoint
app.post("/api/generate-quiz", async (_req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
    }

    const quizSchema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        songTitle: { type: Type.STRING },
        artist: { type: Type.STRING },
        sceneHint: { type: Type.STRING },
        lyricOrMelodyHint: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              movieTitle: { type: Type.STRING },
              year: { type: Type.STRING },
              director: { type: Type.STRING },
              isCorrect: { type: Type.BOOLEAN }
            },
            required: ["movieTitle", "year", "isCorrect"]
          }
        },
        explanation: { type: Type.STRING }
      },
      required: ["songTitle", "artist", "sceneHint", "options", "explanation"]
    };

    const prompt = `
Generate an exciting trivia question for a movie soundtrack lover.
Pick an iconic song featured in a famous movie (e.g. Inception, Pulp Fiction, Drive, Titanic, Guardians of the Galaxy, Star Wars, Matrix, Interstellar, Barbie, Oppenheimer, Kill Bill, Goodfellas, Fight Club).
Provide 4 movie options (exactly 1 correct answer and 3 convincing incorrect movie choices).
Provide a scene hint and interesting trivia explanation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7
      }
    });

    const parsedQuiz = JSON.parse(response.text || "{}");
    parsedQuiz.id = `quiz-${Date.now()}`;
    return res.json({ success: true, quiz: parsedQuiz });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    return res.status(500).json({ error: "Failed to generate quiz question." });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CineTune server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
