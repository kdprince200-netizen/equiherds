/**
 * @swagger
 * tags:
 *   - name: HorseMarket
 *     description: Horse market listings
 *
 * /api/horse-market:
 *   get:
 *     summary: List horse market listings
 *     tags: [HorseMarket]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter horses by owning user id
 *     responses:
 *       200:
 *         description: List of horse market listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HorseMarket'
 *   post:
 *     summary: Create a horse market listing
 *     tags: [HorseMarket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - horseName
 *               - ageOrDOB
 *               - gender
 *               - breed
 *               - color
 *               - height
 *               - passportRegistrationNo
 *               - countryAndCity
 *               - temperament
 *               - primaryDiscipline
 *               - trainingLevel
 *               - experienceLevel
 *               - riderSuitability
 *               - healthStatus
 *               - vaccinationStatus
 *               - lastVetCheckDate
 *               - injuriesMedicalConditions
 *               - vices
 *               - askingPrice
 *               - sellerName
 *               - sellerType
 *               - contactPreferences
 *               - ownershipConfirmation
 *               - liabilityDisclaimer
 *               - welfareCompliance
 *             properties:
 *               userId:
 *                 type: string
 *               horseName:
 *                 type: string
 *               ageOrDOB:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Mare, Stallion, Gelding]
 *               breed:
 *                 type: string
 *               color:
 *                 type: string
 *               height:
 *                 type: number
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Horse market listing created
 *       400:
 *         description: Validation error
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HorseMarket from "@/models/HorseMarket";
import "@/models/User";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = {};
    if (userId) query.userId = userId;
    const horses = await HorseMarket.find(query).populate({ 
      path: "userId", 
      select: "firstName lastName email subscriptionExpiry accountType" 
    });
    
    // If userId is provided, return all horses for that user (no subscription filtering)
    // If no userId, filter by subscription status for public marketplace
    if (userId) {
      // Return all horses for the specific user, just convert userId to string
      const horsesWithUserId = horses.map(horse => {
        const horseObj = horse.toObject();
        return {
          ...horseObj,
          userId: horseObj.userId?._id?.toString() || horseObj.userId?.toString() || horseObj.userId
        };
      });
      return NextResponse.json(horsesWithUserId, { status: 200 });
    }
    
    // For public marketplace (no userId filter), show all horses and convert userId to string
    const horsesWithUserId = horses.map(horse => {
      const horseObj = horse.toObject();
      return {
        ...horseObj,
        userId: horseObj.userId?._id?.toString() || horseObj.userId?.toString() || horseObj.userId
      };
    });
    
    return NextResponse.json(horsesWithUserId, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch horse market listings";
    return NextResponse.json({ message }, { status: 500 });
  }
}

async function parseBody(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return req.json();
  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    const data = {};
    for (const [key, value] of form.entries()) data[key] = typeof value === "string" ? value : value.name || "";
    return data;
  }
  const raw = await req.text();
  return raw ? JSON.parse(raw) : {};
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await parseBody(req);
    const {
      userId,
      // Horse Identification
      horseName,
      ageOrDOB,
      gender,
      breed,
      countryOfOrigin,
      breedType,
      typicalUse,
      popularity,
      regionOfPopularity,
      color,
      height,
      microchipNumber,
      passportRegistrationNo,
      ueln,
      countryAndCity,
      coordinates,
      temperament,
      // Training & Discipline
      primaryDiscipline,
      trainingLevel,
      experienceLevel,
      riderSuitability,
      specialSkills,
      competitionExperience,
      competitionResults,
      competitionVideos,
      // Health & Medical
      healthStatus,
      vaccinationStatus,
      insuranceStatus,
      lastVetCheckDate,
      vetReportUpload,
      vetScansReports,
      farrierOsteopathDentalDate,
      wormingHistory,
      injuriesMedicalConditions,
      vices,
      // Pedigree & Breeding
      sire,
      dam,
      studbook,
      breedingSuitability,
      pedigreeDocuments,
      // Media
      photos,
      videos,
      // Pricing & Sale Condition
      askingPrice,
      negotiable,
      trialAvailable,
      paymentTerms,
      transportAssistance,
      returnConditions,
      // Seller & Verification
      sellerName,
      sellerType,
      contactPreferences,
      verificationStatus,
      // Legal & Compliance
      ownershipConfirmation,
      liabilityDisclaimer,
      welfareCompliance,
      // Additional
      status,
      sponsoredType
    } = body || {};

    // Validate required fields
    if (!userId || !horseName || !ageOrDOB || !gender || !breed || !color || !height || 
        !passportRegistrationNo || !countryAndCity || !temperament ||         !primaryDiscipline || 
        !trainingLevel || !experienceLevel || !riderSuitability || !healthStatus || 
        !vaccinationStatus || !lastVetCheckDate || !injuriesMedicalConditions || !vices || 
        !askingPrice || !sellerName || !sellerType || !contactPreferences ||
        ownershipConfirmation === undefined || liabilityDisclaimer === undefined || 
        welfareCompliance === undefined) {
      return NextResponse.json({ 
        message: "Missing required fields" 
      }, { status: 400 });
    }

    // Validate coordinates structure if provided
    let normalizedCoordinates = null;
    if (coordinates) {
      if (!coordinates.lat || !coordinates.lng) {
        return NextResponse.json({ 
          message: "coordinates must have lat and lng properties" 
        }, { status: 400 });
      }
      normalizedCoordinates = {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng)
      };
    }

    const horse = await HorseMarket.create({
      userId,
      // Horse Identification
      horseName: String(horseName).trim(),
      ageOrDOB: String(ageOrDOB).trim(),
      gender: String(gender).trim(),
      breed: String(breed).trim(),
      countryOfOrigin: countryOfOrigin ? String(countryOfOrigin).trim() : "",
      breedType: breedType ? String(breedType).trim() : "",
      typicalUse: typicalUse ? String(typicalUse).trim() : "",
      popularity: popularity ? String(popularity).trim() : "",
      regionOfPopularity: regionOfPopularity ? String(regionOfPopularity).trim() : "",
      color: String(color).trim(),
      height: Number(height),
      microchipNumber: microchipNumber ? String(microchipNumber).trim() : "",
      passportRegistrationNo: String(passportRegistrationNo).trim(),
      ueln: ueln ? String(ueln).trim() : "",
      countryAndCity: String(countryAndCity).trim(),
      coordinates: normalizedCoordinates,
      temperament: String(temperament).trim(),
      // Training & Discipline
      primaryDiscipline: String(primaryDiscipline).trim(),
      trainingLevel: String(trainingLevel).trim(),
      experienceLevel: String(experienceLevel).trim(),
      riderSuitability: String(riderSuitability).trim(),
      specialSkills: specialSkills ? String(specialSkills).trim() : "",
      competitionExperience: Boolean(competitionExperience),
      competitionResults: Array.isArray(competitionResults) ? competitionResults.filter(url => url && url.trim()) : [],
      competitionVideos: Array.isArray(competitionVideos) ? competitionVideos.filter(url => url && url.trim()) : [],
      // Health & Medical
      healthStatus: String(healthStatus).trim(),
      vaccinationStatus: String(vaccinationStatus).trim(),
      insuranceStatus: insuranceStatus ? String(insuranceStatus).trim() : "",
      lastVetCheckDate: String(lastVetCheckDate).trim(),
      vetReportUpload: Array.isArray(vetReportUpload) ? vetReportUpload.filter(url => url && url.trim()) : [],
      vetScansReports: Array.isArray(vetScansReports) ? vetScansReports.filter(url => url && url.trim()) : [],
      farrierOsteopathDentalDate: farrierOsteopathDentalDate ? String(farrierOsteopathDentalDate).trim() : "",
      wormingHistory: wormingHistory ? String(wormingHistory).trim() : "",
      injuriesMedicalConditions: String(injuriesMedicalConditions).trim(),
      vices: String(vices).trim(),
      // Pedigree & Breeding
      sire: sire ? String(sire).trim() : "",
      dam: dam ? String(dam).trim() : "",
      studbook: studbook ? String(studbook).trim() : "",
      breedingSuitability: breedingSuitability ? String(breedingSuitability).trim() : "",
      pedigreeDocuments: Array.isArray(pedigreeDocuments) ? pedigreeDocuments.filter(url => url && url.trim()) : [],
      // Media
      photos: Array.isArray(photos) ? photos.filter(url => url && url.trim()) : [],
      videos: Array.isArray(videos) ? videos.filter(url => url && url.trim()) : [],
      // Pricing & Sale Condition
      askingPrice: Number(askingPrice),
      negotiable: Boolean(negotiable),
      trialAvailable: Boolean(trialAvailable),
      paymentTerms: paymentTerms ? String(paymentTerms).trim() : "",
      transportAssistance: transportAssistance ? String(transportAssistance).trim() : "",
      returnConditions: returnConditions ? String(returnConditions).trim() : "",
      // Seller & Verification
      sellerName: String(sellerName).trim(),
      sellerType: String(sellerType).trim(),
      contactPreferences: String(contactPreferences).trim(),
      verificationStatus: verificationStatus ? String(verificationStatus).trim() : "",
      // Legal & Compliance
      ownershipConfirmation: Boolean(ownershipConfirmation),
      liabilityDisclaimer: Boolean(liabilityDisclaimer),
      welfareCompliance: Boolean(welfareCompliance),
      // Additional
      status: status || "active",
      sponsoredType: sponsoredType || "normal"
    });

    // Populate the userId field before returning
    const populatedHorse = await HorseMarket.findById(horse._id).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });

    return NextResponse.json(populatedHorse, { status: 201 });
  } catch (error) {
    console.error('Horse market creation error:', error);
    const message = error?.message || "Failed to create horse market listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

