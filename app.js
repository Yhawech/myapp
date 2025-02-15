const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const NEWS_API_KEY = "679b913ddb014617bcc93a0bb89ee1ee";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Function to fetch news
async function fetchNews(url) {
  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// Home Route - Fetch latest headlines
app.get("/", async (req, res) => {
  const news = await fetchNews(
    `https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`
  );
  res.render("index", { news });
});

// Search News
app.get("/search", async (req, res) => {
  const searchTerm = req.query.search;
  const news = await fetchNews(
    `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${NEWS_API_KEY}`
  );
  res.render("index", { news });
});

// Sort by Date (Newest First)
app.get("/sort-by-date", async (req, res) => {
  let news = await fetchNews(
    `https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`
  );
  news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  res.render("index", { news });
});

// Get News by Specific Date (Fix for current-day issue)
app.get("/news-by-date", async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).send("Please provide a valid date.");
    }

    // Adjusting the search range for better results
    const fromDate = new Date(date);
    fromDate.setDate(fromDate.getDate() - 1); // Previous day

    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + 1); // Next day

    const news = await fetchNews(
      `https://newsapi.org/v2/everything?q=*&from=${fromDate.toISOString().split("T")[0]}&to=${toDate.toISOString().split("T")[0]}&sortBy=popularity&apiKey=${NEWS_API_KEY}`
    );

    res.render("index", { news });
  } catch (error) {
    console.error("Error fetching news by date:", error);
    res.status(500).send("Error fetching news by date. Please try again later.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

