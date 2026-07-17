import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const requests = await prisma.assistanceRequest.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

router.post("/", async (req: any, res: any) => {
  const { disasterType, title, description, location, severity } = req.body;
  if (!disasterType || !title || !description || !location || !severity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const request = await prisma.assistanceRequest.create({
      data: {
        disasterType,
        title,
        description,
        location,
        severity
      }
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to create assistance request" });
  }
});

router.patch("/:id/status", async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body; // "pending", "dispatched", "resolved"
  if (!status) {
    return res.status(400).json({ error: "Missing status field" });
  }

  try {
    const request = await prisma.assistanceRequest.update({
      where: { id },
      data: { status }
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to update request status" });
  }
});

export default router;
