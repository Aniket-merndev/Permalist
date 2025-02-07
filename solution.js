import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import http from "http";

// Load environment variables
dotenv.config();

const app = express();
const sql = neon(process.env.DATABASE_URL);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

// Routes
app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM items ORDER BY id ASC`;
    items = result;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await sql`INSERT INTO items (title) VALUES (${item})`;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await sql`UPDATE items SET title = ${item} WHERE id = ${id}`;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await sql`DELETE FROM items WHERE id = ${id}`;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});