const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
const NEWSAPI_KEY = "235d0e91da2a428ab195fa13223f2c95"; // Your NewsAPI Key

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "news_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected...");
});

// Session Middleware
app.use(
  session({
    secret: "news_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// **Fake News & Bias Detection**
const fakeNewsSources = ["Infowars", "Before It's News", "WorldTruth.TV"];
const leftSources = ["CNN", "The New York Times", "The Guardian"];
const rightSources = ["Fox News", "Breitbart", "Daily Caller"];

const analyzeBias = (article) => {
  const sourceName = article.source?.name || "Unknown";

  if (leftSources.includes(sourceName)) return { type: "Left", color: "blue" };
  if (rightSources.includes(sourceName)) return { type: "Right", color: "red" };
  return { type: "Independent", color: "green" };
};

const detectFakeNews = (article) => {
  const sourceName = article.source?.name || "Unknown";
  return fakeNewsSources.includes(sourceName);
};

// **Fetch News Function**
async function fetchNews(query = "latest", fromDate = "") {
  try {
    let url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWSAPI_KEY}&language=en`;

    if (fromDate) url += `&from=${fromDate}`;

    const response = await axios.get(url);
    return response.data.articles || [];
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    return [];
  }
}

// **Home Route**
app.get("/", async (req, res) => {
  let news = await fetchNews();
  news = news.map((article) => {
    const bias = analyzeBias(article);
    return {
      title: article.title || "No Title",
      description: article.description || "No Description",
      url: article.url || "#",
      image: article.urlToImage || "https://via.placeholder.com/150",
      source: article.source?.name || "Unknown",
      isFake: detectFakeNews(article),
      biasType: bias.type,
      biasColor: bias.color,
    };
  });
  res.render("index", { news, user: req.session.user });
});

// **Search News**
app.get("/search", async (req, res) => {
  const searchTerm = req.query.search;
  let news = await fetchNews(searchTerm);
  news = news.map((article) => {
    const bias = analyzeBias(article);
    return {
      title: article.title || "No Title",
      description: article.description || "No Description",
      url: article.url || "#",
      image: article.urlToImage || "https://via.placeholder.com/150",
      source: article.source?.name || "Unknown",
      isFake: detectFakeNews(article),
      biasType: bias.type,
      biasColor: bias.color,
    };
  });
  res.render("index", { news, user: req.session.user });
});

// **News by Date**
app.get("/news-by-date", async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).send("⚠️ Please provide a valid date.");

  let news = await fetchNews("latest", date);
  news = news.map((article) => {
    const bias = analyzeBias(article);
    return {
      title: article.title || "No Title",
      description: article.description || "No Description",
      url: article.url || "#",
      image: article.urlToImage || "https://via.placeholder.com/150",
      source: article.source?.name || "Unknown",
      isFake: detectFakeNews(article),
      biasType: bias.type,
      biasColor: bias.color,
    };
  });

  res.render("index", { news, user: req.session.user });
});

// **Signup Route**
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) return res.render("signup", { message: "⚠️ Username already exists!" });
      res.redirect("/login");
    }
  );
});

// **Login Route**
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
    if (err || result.length === 0) return res.render("login", { message: "⚠️ User not found!" });

    const isMatch = await bcrypt.compare(password, result[0].password);
    if (!isMatch) return res.render("login", { message: "⚠️ Incorrect password!" });

    req.session.user = username;
    res.redirect("/");
  });
});

// **Logout**
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// **Start Server**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
