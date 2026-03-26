import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

/**
 * Sentinel-Ops Backend Engine
 * 
 * Academic Note: This server simulates the Python/FastAPI analytics layer.
 * In a production BCA project, this would interface with Meta Prophet via a Python microservice.
 */
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  /**
   * Telegram Alert Simulation
   * Logic: Simulates a Python function `simulate_telegram_alert(message: str)`
   * Why: Real-time alerting is critical for incident response in cloud governance.
   */
  const simulateTelegramAlert = (message: string, interactive: boolean = false) => {
    const timestamp = new Date().toISOString();
    console.log(`[TELEGRAM ALERT] - [${timestamp}] - ${message}`);
    if (interactive) {
      console.log(`[TELEGRAM BOT] - Waiting for user reply... (Reply 'STAY' to cancel)`);
    }
  };

  app.post("/api/alert", (req, res) => {
    const { type, message, interactive } = req.body;
    
    // Simulate the Python function call
    simulateTelegramAlert(message, interactive);
    
    res.json({ status: "alert_sent", timestamp: new Date().toISOString() });
  });

  // --- Analytics API Endpoints ---

  /**
   * Consolidated Analytics Summary
   * This endpoint provides all the data needed for the dashboard in one call.
   * Academic Note: Reducing API calls improves mobile performance and reduces latency.
   */
  app.get("/api/analytics/summary", (req, res) => {
    const kwh_saved = 150.5;
    const co2_offset_kg = kwh_saved * 0.4;
    
    res.json({
      carbon: {
        kwh_saved,
        co2_offset_kg,
        trees_equivalent: (co2_offset_kg / 21).toFixed(2)
      },
      optimization: [
        { id: "i-0a1b2c3d", type: "t3.medium", avgCpu: 2.1, recommendedAction: "DOWNSIZE" },
        { id: "i-9i8j7k6l", type: "m5.large", avgCpu: 4.8, recommendedAction: "DOWNSIZE" },
        { id: "i-5x4y3z2w", type: "t3.small", avgCpu: 1.2, recommendedAction: "DOWNSIZE" },
        { id: "i-8h7g6f5e", type: "t3.nano", avgCpu: 45.2, recommendedAction: "OPTIMAL" }
      ],
      budget: {
        limit: 100,
        predictedDailySpend: 4.25,
        daysRemaining: 12,
        exhaustionDate: "2026-04-15" // Simulated Prophet output
      }
    });
  });

  /**
   * Carbon Footprint Calculator
   * Logic: 1 kWh = 0.4kg CO2
   * Why: Sustainability is a key metric in modern Cloud Governance (FinOps + GreenOps).
   */
  app.get("/api/analytics/carbon", (req, res) => {
    const kwh = parseFloat(req.query.kwh as string) || 100;
    const carbon = kwh * 0.4;
    res.json({ kwh, carbon_kg: carbon, unit: "kg CO2" });
  });

  /**
   * Ghost Resource Detection Logic
   * Flagged if CPU utilization < 5% for a 4-hour trend.
   * Why: Identifying underutilized resources is the first step in cost optimization.
   */
  app.get("/api/analytics/ghost-resources", (req, res) => {
    // Simulated detection logic
    const resources = [
      { id: "i-0a1b2c3d", type: "t3.medium", cpu_avg: 2.1, status: "flagged" },
      { id: "i-9i8j7k6l", type: "m5.large", cpu_avg: 4.8, status: "flagged" },
      { id: "i-5x4y3z2w", type: "t3.small", cpu_avg: 1.2, status: "flagged" }
    ];
    res.json({ count: resources.length, resources });
  });

  /**
   * Predictive Forecasting (Mock Prophet Logic)
   * Simulates Time-Series forecasting for budget exhaustion.
   */
  app.get("/api/analytics/forecast", (req, res) => {
    const days = 30;
    const forecast = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      predicted_cost: 500 + (Math.sin(i / 3) * 50) + (i * 10) // Trend + Seasonality
    }));
    res.json({ 
      model: "Meta Prophet Simulation",
      forecast,
      budget_exhaustion_date: "2026-04-15"
    });
  });

  // --- Vite Integration ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sentinel-Ops Server running on http://localhost:${PORT}`);
  });
}

startServer();
