import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

router.post("/", async (req: any, res: any) => {
  const { title, disasterType, place, severity, description, lng, lat, reportedBy } = req.body;
  if (!title || !disasterType || !place || !severity || !description || lng === undefined || lat === undefined || !reportedBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const incident = await prisma.incident.create({
      data: {
        title,
        disasterType,
        place,
        severity,
        description,
        lng: parseFloat(lng),
        lat: parseFloat(lat),
        reportedBy
      }
    });
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: "Failed to create incident" });
  }
});

router.patch("/:id/resolve", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: { status: "resolved" }
    });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: "Failed to resolve incident" });
  }
});

export default router;
