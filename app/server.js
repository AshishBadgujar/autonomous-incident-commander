const express = require("express");
const { port, staticDir } = require("./config");
const demo = require("./demoService");
const { ensureStore } = require("./incidentStore");
const { registerRoutes } = require("./routes");

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.static(staticDir));

registerRoutes(app);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    ok: false,
    error: error.message,
    details: error.body || null,
  });
});

demo.logEvent("INFO", "App started.");

app.listen(port, () => {
  ensureStore();
  console.log(`app listening on http://localhost:${port}`);
});
