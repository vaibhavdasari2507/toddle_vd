const express = require("express");
const app = express();
const user_route = require("./routes/user_route");
const journal_route = require("./routes/journal_route");
const feed_route = require("./routes/feed_route");
const table_route = require("./routes/table_route");

app.use(express.json());
app.use(user_route);
app.use(journal_route);
app.use(feed_route);
app.use(table_route);
app.get("/", (req, res) => {
    res.send("Hello! Check the postman documentation.")
})
module.exports = app;
