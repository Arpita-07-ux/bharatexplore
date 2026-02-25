import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db, { initDb } from "./src/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "bharat-explore-secret-key-2026";

// Initialize Database
initDb();

const app = express();
const PORT = 3000;

app.use(express.json());

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// --- API Routes ---

// Auth
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    const result = stmt.run(name, email, hashedPassword);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET);
    res.status(201).json({ token, user: { id: result.lastInsertRowid, email, name } });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (!user) return res.status(400).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// States
app.get("/api/states", (req, res) => {
  const states = db.prepare("SELECT * FROM states").all();
  res.json(states);
});

app.get("/api/states/:id", (req, res) => {
  const state = db.prepare("SELECT * FROM states WHERE id = ?").get(req.params.id);
  if (!state) return res.status(404).json({ error: "State not found" });
  const places = db.prepare("SELECT * FROM places WHERE state_id = ?").all(req.params.id);
  res.json({ ...state, places });
});

// Places
app.get("/api/places", (req, res) => {
  const places = db.prepare("SELECT p.*, s.name as state_name FROM places p JOIN states s ON p.state_id = s.id").all();
  res.json(places);
});

app.get("/api/places/:id", (req, res) => {
  const place = db.prepare("SELECT p.*, s.name as state_name FROM places p JOIN states s ON p.state_id = s.id WHERE p.id = ?").get(req.params.id);
  if (!place) return res.status(404).json({ error: "Place not found" });
  const attractions = db.prepare("SELECT * FROM attractions WHERE place_id = ?").all(req.params.id);
  res.json({ ...place, attractions });
});

// Search
app.get("/api/search", (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.json([]);
  const results = db.prepare(`
    SELECT 'state' as type, id, name, description, image_url FROM states WHERE name LIKE ?
    UNION
    SELECT 'place' as type, id, name, description, image_url FROM places WHERE name LIKE ?
  `).all(`%${query}%`, `%${query}%`);
  res.json(results);
});

// Nearby Hotels using Gemini
app.get("/api/hotels", async (req, res) => {
  const { place, lat, lng } = req.query;
  if (!place) return res.status(400).json({ error: "Place name is required" });

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `List 5 highly-rated hotels near ${place} (Latitude: ${lat}, Longitude: ${lng}) in India. For each hotel, provide the name, a brief 1-sentence description, and an approximate price range in INR. Return the data as a JSON array of objects with keys: name, description, priceRange.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      },
    });

    const hotels = JSON.parse(response.text || "[]");
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.json([
      { name: "Luxury Heritage Hotel", description: "A beautiful heritage property with modern amenities.", priceRange: "₹8,000 - ₹15,000" },
      { name: "The Grand Residency", description: "Centrally located with stunning city views.", priceRange: "₹5,000 - ₹9,000" },
      { name: "Comfort Inn", description: "Affordable and clean rooms for budget travelers.", priceRange: "₹2,500 - ₹4,000" }
    ]);
  }
});

// Favorites
app.get("/api/favorites", authenticateToken, (req: any, res) => {
  const favorites = db.prepare(`
    SELECT p.*, s.name as state_name 
    FROM favorites f 
    JOIN places p ON f.place_id = p.id 
    JOIN states s ON p.state_id = s.id
    WHERE f.user_id = ?
  `).all(req.user.id);
  res.json(favorites);
});

app.post("/api/favorites", authenticateToken, (req: any, res) => {
  const { placeId } = req.body;
  try {
    db.prepare("INSERT INTO favorites (user_id, place_id) VALUES (?, ?)").run(req.user.id, placeId);
    res.status(201).json({ message: "Added to favorites" });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: "Already in favorites" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.delete("/api/favorites/:placeId", authenticateToken, (req: any, res) => {
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND place_id = ?").run(req.user.id, req.params.placeId);
  res.json({ message: "Removed from favorites" });
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve("dist/index.html"));
  });
}

// Start server if not on Vercel
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
