const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// Connect to PostgreSQL using env vars set in docker-compose
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Allow frontend to call us
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Create table on startup
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log("Database initialized");
}

// Routes
app.get("/api/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY created_at DESC");
  res.json(result.rows);
});

app.post("/api/todos", async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    "INSERT INTO todos (task) VALUES ($1) RETURNING *",
    [task]
  );
  res.json(result.rows[0]);
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: err.message });
  }
});

const PORT = process.env.PORT || 3000;

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});
