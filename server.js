const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const axios = require("axios");
const db = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "RGAPI-d22ac9fa-8b61-4ec7-bf57-b1b0cf5b4629",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth", "login.html"));
});

app.get("/auth/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth", "register.html"));
});

app.get("/api/champions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/champion.json"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champion data" });
  }
});

app.get("/api/champions/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/14.17.1/data/fr_FR/champion/${req.params.id}.json`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch champion details" });
  }
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      res.status(500).send("Server error");
      return;
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

app.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send("Server error");
      return;
    }
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            res.status(400).send("Username already taken");
          } else {
            res.status(500).send("Server error");
          }
        } else {
          res.redirect("/auth/login");
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
