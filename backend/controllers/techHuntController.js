import prisma from "../db/index.js";
import { handleError } from "../utils/errorHandler.js";

// Submit Tech Hunt participation
export const claimReward = async (req, res) => {
  try {
    const { name, rollNumber, teamName, email, phone, college } = req.body;

    // Validation
    if (!name || !rollNumber || !teamName) {
      return handleError(res, 400, "Name, Roll Number, and Team Name are required", "VALIDATION_ERROR");
    }

    // Check if already claimed
    const existing = await prisma.techHuntParticipant.findFirst({
      where: {
        OR: [
          { rollNumber, teamName },
          { email: email || undefined },
        ],
      },
    });

    if (existing) {
      return handleError(res, 409, "You have already claimed your reward!", "ALREADY_CLAIMED");
    }

    // Create participant
    const participant = await prisma.techHuntParticipant.create({
      data: {
        name,
        rollNumber,
        teamName,
        email: email || null,
        phone: phone || null,
        college: college || null,
      },
    });

    return res.status(201).json({
      status: true,
      message: "Congratulations! Reward claimed successfully! 🎉",
      data: {
        id: participant.id,
        name: participant.name,
        teamName: participant.teamName,
        claimedAt: participant.claimedAt,
      },
    });
  } catch (error) {
    console.error("Tech Hunt claim error:", error);
    return handleError(res, 500, "Failed to claim reward", "SERVER_ERROR");
  }
};

// Get all participants (admin only)
export const getAllParticipants = async (req, res) => {
  try {
    const participants = await prisma.techHuntParticipant.findMany({
      orderBy: { claimedAt: 'desc' },
    });

    return res.status(200).json({
      status: true,
      count: participants.length,
      data: participants,
    });
  } catch (error) {
    console.error("Get participants error:", error);
    return handleError(res, 500, "Failed to fetch participants", "SERVER_ERROR");
  }
};

// Get participant stats
export const getStats = async (req, res) => {
  try {
    const totalParticipants = await prisma.techHuntParticipant.count();
    const uniqueTeams = await prisma.techHuntParticipant.groupBy({
      by: ['teamName'],
    });

    return res.status(200).json({
      status: true,
      data: {
        totalParticipants,
        totalTeams: uniqueTeams.length,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return handleError(res, 500, "Failed to fetch stats", "SERVER_ERROR");
  }
};
