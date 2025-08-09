import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all mosques
  app.get("/api/mosques", async (req, res) => {
    try {
      const { search, city, size } = req.query;
      
      let mosques;
      if (search || city || size) {
        mosques = await storage.searchMosques(
          search as string || "",
          city as string,
          size as string
        );
      } else {
        mosques = await storage.getAllMosques();
      }
      
      res.json(mosques);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mosques" });
    }
  });

  // Get mosque by ID
  app.get("/api/mosques/:id", async (req, res) => {
    try {
      const mosque = await storage.getMosqueById(req.params.id);
      if (!mosque) {
        return res.status(404).json({ error: "Mosque not found" });
      }
      res.json(mosque);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mosque" });
    }
  });

  // Get donations for a mosque
  app.get("/api/mosques/:id/donations", async (req, res) => {
    try {
      const donations = await storage.getDonationsByMosqueId(req.params.id);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
