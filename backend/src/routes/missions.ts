import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: any, res: any) => {
  try {
    const missions = await prisma.volunteerMission.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch missions" });
  }
});

router.post("/", async (req: any, res: any) => {
  const { title, location, description, volunteersNeeded } = req.body;
  if (!title || !location || !description || !volunteersNeeded) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const mission = await prisma.volunteerMission.create({
      data: {
        title,
        location,
        description,
        volunteersNeeded: parseInt(volunteersNeeded)
      }
    });
    res.status(201).json(mission);
  } catch (err) {
    res.status(500).json({ error: "Failed to create mission" });
  }
});

router.patch("/:id/accept", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const mission = await prisma.volunteerMission.update({
      where: { id },
      data: {
        volunteersCount: {
          increment: 1
        }
      }
    });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ error: "Failed to accept mission" });
  }
});

export default router;
