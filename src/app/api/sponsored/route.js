import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import HorseMarket from "@/models/HorseMarket";
import Equipment from "@/models/Equipment";
import OtherService from "@/models/OtherService";
import Trainer from "@/models/Trainer";
import Stable from "@/models/Stables";

// GET - Fetch all sponsored items from all models
export async function GET() {
  try {
    // Ensure database connection is established
    try {
      await connectDB();
      // Verify connection is ready
      if (mongoose.connection.readyState !== 1) {
        console.warn('Database not ready, readyState:', mongoose.connection.readyState);
        // Return empty response if DB is not ready
        return NextResponse.json(
          { 
            message: "Database not ready",
            horses: [],
            equipment: [],
            otherServices: [],
            trainers: [],
            stables: [],
            all: [],
            summary: {
              total: 0,
              horses: 0,
              equipment: 0,
              otherServices: 0,
              trainers: 0,
              stables: 0
            }
          },
          { status: 200 }
        );
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Return empty response if DB connection fails
      return NextResponse.json(
        { 
          message: "Database connection failed",
          horses: [],
          equipment: [],
          otherServices: [],
          trainers: [],
          stables: [],
          all: [],
          summary: {
            total: 0,
            horses: 0,
            equipment: 0,
            otherServices: 0,
            trainers: 0,
            stables: 0
          }
        },
        { status: 200 }
      );
    }

    // Fetch sponsored items from each model in parallel
    const [
      sponsoredHorses,
      sponsoredEquipment,
      sponsoredOtherServices,
      sponsoredTrainers,
      sponsoredStables
    ] = await Promise.all([
      // Get sponsored horses
      HorseMarket.find({ sponsoredType: "sponsored", status: "active" })
        .populate({
          path: "userId",
          select: "firstName lastName email profilePicture brandImage"
        })
        .sort({ createdAt: -1 })
        .lean()
        .catch(err => {
          console.error('Error fetching sponsored horses:', err);
          return [];
        }),
      
      // Get sponsored equipment
      Equipment.find({ sponsoredType: "sponsored", status: "active" })
        .populate({
          path: "userId",
          select: "firstName lastName email profilePicture brandImage"
        })
        .sort({ createdAt: -1 })
        .lean()
        .catch(err => {
          console.error('Error fetching sponsored equipment:', err);
          return [];
        }),

      // Get sponsored other services
      OtherService.find({ sponsoredType: "sponsored", status: "active" })
        .populate({
          path: "userId",
          select: "firstName lastName email profilePicture brandImage"
        })
        .sort({ createdAt: -1 })
        .lean()
        .catch(err => {
          console.error('Error fetching sponsored other services:', err);
          return [];
        }),

      // Get sponsored trainers
      Trainer.find({ sponsoredType: "sponsored", status: "active" })
        .populate({
          path: "userId",
          select: "firstName lastName email profilePicture brandImage"
        })
        .sort({ createdAt: -1 })
        .lean()
        .catch(err => {
          console.error('Error fetching sponsored trainers:', err);
          return [];
        }),

      // Get sponsored stables
      Stable.find({ sponsoredType: "sponsored", status: "active" })
        .populate({
          path: "userId",
          select: "firstName lastName email profilePicture brandImage"
        })
        .sort({ createdAt: -1 })
        .lean()
        .catch(err => {
          console.error('Error fetching sponsored stables:', err);
          return [];
        })
    ]);

    // Helper function to format user data
    const formatUserData = (userId) => {
      if (!userId) return null;
      return {
        id: userId._id?.toString(),
        name: `${userId.firstName || ''} ${userId.lastName || ''}`.trim(),
        email: userId.email,
        avatar: userId.profilePicture || userId.brandImage || ''
      };
    };

    // Ensure all results are arrays
    const horses = Array.isArray(sponsoredHorses) ? sponsoredHorses : [];
    const equipment = Array.isArray(sponsoredEquipment) ? sponsoredEquipment : [];
    const otherServices = Array.isArray(sponsoredOtherServices) ? sponsoredOtherServices : [];
    const trainers = Array.isArray(sponsoredTrainers) ? sponsoredTrainers : [];
    const stables = Array.isArray(sponsoredStables) ? sponsoredStables : [];

    // Format each category
    const formattedHorses = horses.map(horse => ({
      id: horse._id?.toString() || horse.id,
      type: "horse",
      ...horse,
      _id: horse._id?.toString() || horse.id,
      userId: formatUserData(horse.userId)
    }));

    const formattedEquipment = equipment.map(equip => ({
      id: equip._id?.toString() || equip.id,
      type: "equipment",
      ...equip,
      _id: equip._id?.toString() || equip.id,
      userId: formatUserData(equip.userId)
    }));

    const formattedOtherServices = otherServices.map(service => ({
      id: service._id?.toString() || service.id,
      type: "otherService",
      ...service,
      _id: service._id?.toString() || service.id,
      userId: formatUserData(service.userId)
    }));

    const formattedTrainers = trainers.map(trainer => ({
      id: trainer._id?.toString() || trainer.id,
      type: "trainer",
      ...trainer,
      _id: trainer._id?.toString() || trainer.id,
      userId: formatUserData(trainer.userId)
    }));

    const formattedStables = stables.map(stable => ({
      id: stable._id?.toString() || stable.id,
      type: "stable",
      ...stable,
      _id: stable._id?.toString() || stable.id,
      userId: formatUserData(stable.userId)
    }));

    // Combined array for easier iteration
    const allSponsored = [
      ...formattedHorses,
      ...formattedEquipment,
      ...formattedOtherServices,
      ...formattedTrainers,
      ...formattedStables
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Format the response
    const response = {
      horses: formattedHorses,
      equipment: formattedEquipment,
      otherServices: formattedOtherServices,
      trainers: formattedTrainers,
      stables: formattedStables,
      all: allSponsored,
      summary: {
        total: allSponsored.length,
        horses: formattedHorses.length,
        equipment: formattedEquipment.length,
        otherServices: formattedOtherServices.length,
        trainers: formattedTrainers.length,
        stables: formattedStables.length
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching sponsored items:', error);
    // Return empty response instead of error to prevent UI breaking
    return NextResponse.json(
      { 
        message: error.message || "Failed to fetch sponsored items",
        horses: [],
        equipment: [],
        otherServices: [],
        trainers: [],
        stables: [],
        all: [],
        summary: {
          total: 0,
          horses: 0,
          equipment: 0,
          otherServices: 0,
          trainers: 0,
          stables: 0
        }
      },
      { status: 200 }
    );
  }
}

