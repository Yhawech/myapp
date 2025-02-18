const express = require("express");
const path = require("path");
const axios = require("axios");
const Sentiment = require("sentiment");

const app = express();
const NEWS_API_KEY = "679b913ddb014617bcc93a0bb89ee1ee";

const sentimentAnalyzer = new Sentiment();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Trusted and Fake News Sources
const trustedSources = ["bbc.com", "reuters.com", "apnews.com", "theguardian.com"];
const fakeNewsSources = ["infowars.com", "beforeitsnews.com", "worldtruth.tv", "theonion.com"];

// Keywords for bias analysis
const leftBiasKeywords = ["progressive", "liberal", "climate change", "social justice", "welfare"];
const rightBiasKeywords = ["conservative", "right-wing", "gun rights", "border security", "traditional"];

// Function to Fetch News
async function fetchNews(url) {
  try {
    const response = await axios.get(url);
    return response.data.articles || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// Fake News Detection
function detectFakeNews(article) {
  if (!article.url) return false;

  const isFromFakeSource = fakeNewsSources.some((site) => article.url.includes(site));
  const misleadingWords = ["hoax", "conspiracy", "unverified", "clickbait", "misleading"];
  const hasMisleadingWords = misleadingWords.some((word) =>
    (article.title || "").toLowerCase().includes(word) ||
    (article.description || "").toLowerCase().includes(word)
  );

  return isFromFakeSource || hasMisleadingWords;
}

// Political Bias Analysis
function analyzeBias(article) {
  if (!article.url) return "Independent";

  const leftSources = ["cnn.com", "nytimes.com", "theguardian.com", "huffpost.com"];
  const rightSources = ["foxnews.com", "breitbart.com", "dailycaller.com", "washingtonexaminer.com"];

  if (leftSources.some((site) => article.url.includes(site))) return "Left";
  if (rightSources.some((site) => article.url.includes(site))) return "Right";

  const text = (article.title || "") + " " + (article.description || "");
  const sentimentScore = sentimentAnalyzer.analyze(text).score;

  if (sentimentScore > 2) return "Left";
  if (sentimentScore < -2) return "Right";
  return "Independent";
}

// Home Route - Fetch Latest News
app.get("/", async (req, res) => {
  let news = await fetchNews(
    `https://newsapi.org/v2/top-headlines?country=in&apiKey=${NEWS_API_KEY}`
  );

  news = news.map((article) => ({
    ...article,
    isFake: detectFakeNews(article),
    bias: analyzeBias(article),
  }));

  res.render("index", { news });
});

// Search News
app.get("/search", async (req, res) => {
  const searchTerm = req.query.search;
  let news = await fetchNews(
    `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${NEWS_API_KEY}`
  );

  news = news.map((article) => ({
    ...article,
    isFake: detectFakeNews(article),
    bias: analyzeBias(article),
  }));

  res.render("index", { news });
});

// Sort by Date (Newest First) - FIXED ✅
app.get("/sort-by-date", async (req, res) => {
  let news = await fetchNews(
    `https://newsapi.org/v2/everything?q=news&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`
  );

  news = news.map((article) => ({
    ...article,
    isFake: detectFakeNews(article),
    bias: analyzeBias(article),
  }));

  res.render("index", { news });
});

// Get News by Specific Date
app.get("/news-by-date", async (req, res) => {
  const date = req.query.date;
  if (!date) return res.status(400).send("Please provide a valid date.");

  let news = await fetchNews(
    `https://newsapi.org/v2/everything?q=*&from=${date}&to=${date}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
  );

  news = news.map((article) => ({
    ...article,
    isFake: detectFakeNews(article),
    bias: analyzeBias(article),
  }));

  res.render("index", { news });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
