/**
 * @swagger
 * /api/horse-market/{id}:
 *   get:
 *     summary: Get a horse market listing by id
 *     tags: [HorseMarket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Horse market listing found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HorseMarket'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a horse market listing by id
 *     tags: [HorseMarket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated horse market listing
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a horse market listing by id
 *     tags: [HorseMarket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HorseMarket from "@/models/HorseMarket";
import "@/models/User";

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

export async function GET(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const horse = await HorseMarket.findById(id).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });
    if (!horse) return NextResponse.json({ message: "Horse market listing not found" }, { status: 404 });
    return NextResponse.json(horse, { status: 200 });
  } catch (error) {
    const message = error?.message || "Failed to fetch horse market listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
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

    const update = {};

    // Update fields only if they are provided
    if (userId !== undefined) update.userId = userId;
    if (horseName !== undefined) update.horseName = String(horseName).trim();
    if (ageOrDOB !== undefined) update.ageOrDOB = String(ageOrDOB).trim();
    if (gender !== undefined) update.gender = String(gender).trim();
    if (breed !== undefined) update.breed = String(breed).trim();
    if (countryOfOrigin !== undefined) update.countryOfOrigin = countryOfOrigin ? String(countryOfOrigin).trim() : "";
    if (breedType !== undefined) update.breedType = breedType ? String(breedType).trim() : "";
    if (typicalUse !== undefined) update.typicalUse = typicalUse ? String(typicalUse).trim() : "";
    if (popularity !== undefined) update.popularity = popularity ? String(popularity).trim() : "";
    if (regionOfPopularity !== undefined) update.regionOfPopularity = regionOfPopularity ? String(regionOfPopularity).trim() : "";
    if (color !== undefined) update.color = String(color).trim();
    if (height !== undefined) update.height = Number(height);
    if (microchipNumber !== undefined) update.microchipNumber = microchipNumber ? String(microchipNumber).trim() : "";
    if (passportRegistrationNo !== undefined) update.passportRegistrationNo = String(passportRegistrationNo).trim();
    if (ueln !== undefined) update.ueln = ueln ? String(ueln).trim() : "";
    if (countryAndCity !== undefined) update.countryAndCity = String(countryAndCity).trim();
    if (temperament !== undefined) update.temperament = String(temperament).trim();
    
    // Training & Discipline
    if (primaryDiscipline !== undefined) update.primaryDiscipline = String(primaryDiscipline).trim();
    if (trainingLevel !== undefined) update.trainingLevel = String(trainingLevel).trim();
    if (experienceLevel !== undefined) update.experienceLevel = String(experienceLevel).trim();
    if (riderSuitability !== undefined) update.riderSuitability = String(riderSuitability).trim();
    if (specialSkills !== undefined) update.specialSkills = specialSkills ? String(specialSkills).trim() : "";
    if (competitionExperience !== undefined) update.competitionExperience = Boolean(competitionExperience);
    if (competitionResults !== undefined) update.competitionResults = Array.isArray(competitionResults) ? competitionResults.filter(url => url && url.trim()) : [];
    if (competitionVideos !== undefined) update.competitionVideos = Array.isArray(competitionVideos) ? competitionVideos.filter(url => url && url.trim()) : [];
    
    // Health & Medical
    if (healthStatus !== undefined) update.healthStatus = String(healthStatus).trim();
    if (vaccinationStatus !== undefined) update.vaccinationStatus = String(vaccinationStatus).trim();
    if (insuranceStatus !== undefined) update.insuranceStatus = insuranceStatus ? String(insuranceStatus).trim() : "";
    if (lastVetCheckDate !== undefined) update.lastVetCheckDate = String(lastVetCheckDate).trim();
    if (vetReportUpload !== undefined) update.vetReportUpload = Array.isArray(vetReportUpload) ? vetReportUpload.filter(url => url && url.trim()) : [];
    if (vetScansReports !== undefined) update.vetScansReports = Array.isArray(vetScansReports) ? vetScansReports.filter(url => url && url.trim()) : [];
    if (farrierOsteopathDentalDate !== undefined) update.farrierOsteopathDentalDate = farrierOsteopathDentalDate ? String(farrierOsteopathDentalDate).trim() : "";
    if (wormingHistory !== undefined) update.wormingHistory = wormingHistory ? String(wormingHistory).trim() : "";
    if (injuriesMedicalConditions !== undefined) update.injuriesMedicalConditions = String(injuriesMedicalConditions).trim();
    if (vices !== undefined) update.vices = String(vices).trim();
    
    // Pedigree & Breeding
    if (sire !== undefined) update.sire = sire ? String(sire).trim() : "";
    if (dam !== undefined) update.dam = dam ? String(dam).trim() : "";
    if (studbook !== undefined) update.studbook = studbook ? String(studbook).trim() : "";
    if (breedingSuitability !== undefined) update.breedingSuitability = breedingSuitability ? String(breedingSuitability).trim() : "";
    if (pedigreeDocuments !== undefined) update.pedigreeDocuments = Array.isArray(pedigreeDocuments) ? pedigreeDocuments.filter(url => url && url.trim()) : [];
    
    // Media
    if (photos !== undefined) update.photos = Array.isArray(photos) ? photos.filter(url => url && url.trim()) : [];
    if (videos !== undefined) update.videos = Array.isArray(videos) ? videos.filter(url => url && url.trim()) : [];
    
    // Pricing & Sale Condition
    if (askingPrice !== undefined) update.askingPrice = Number(askingPrice);
    if (negotiable !== undefined) update.negotiable = Boolean(negotiable);
    if (trialAvailable !== undefined) update.trialAvailable = Boolean(trialAvailable);
    if (paymentTerms !== undefined) update.paymentTerms = paymentTerms ? String(paymentTerms).trim() : "";
    if (transportAssistance !== undefined) update.transportAssistance = transportAssistance ? String(transportAssistance).trim() : "";
    if (returnConditions !== undefined) update.returnConditions = returnConditions ? String(returnConditions).trim() : "";
    
    // Seller & Verification
    if (sellerName !== undefined) update.sellerName = String(sellerName).trim();
    if (sellerType !== undefined) update.sellerType = String(sellerType).trim();
    if (contactPreferences !== undefined) update.contactPreferences = String(contactPreferences).trim();
    if (verificationStatus !== undefined) update.verificationStatus = verificationStatus ? String(verificationStatus).trim() : "";
    
    // Legal & Compliance
    if (ownershipConfirmation !== undefined) update.ownershipConfirmation = Boolean(ownershipConfirmation);
    if (liabilityDisclaimer !== undefined) update.liabilityDisclaimer = Boolean(liabilityDisclaimer);
    if (welfareCompliance !== undefined) update.welfareCompliance = Boolean(welfareCompliance);
    
    // Additional
    if (status !== undefined) update.status = status;
    if (sponsoredType !== undefined) update.sponsoredType = sponsoredType;
    
    // Handle coordinates separately
    if (coordinates !== undefined) {
      if (coordinates === null) {
        update.coordinates = null;
      } else if (coordinates.lat && coordinates.lng) {
        update.coordinates = {
          lat: Number(coordinates.lat),
          lng: Number(coordinates.lng)
        };
      } else {
        return NextResponse.json({ 
          message: "coordinates must have lat and lng properties" 
        }, { status: 400 });
      }
    }

    const horse = await HorseMarket.findByIdAndUpdate(id, update, { 
      new: true, 
      runValidators: true 
    }).populate({ 
      path: "userId", 
      select: "firstName lastName email" 
    });
    
    if (!horse) return NextResponse.json({ message: "Horse market listing not found" }, { status: 404 });
    return NextResponse.json(horse, { status: 200 });
  } catch (error) {
    console.error('Horse market update error:', error);
    const message = error?.message || "Failed to update horse market listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const result = await HorseMarket.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ message: "Horse market listing not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error?.message || "Failed to delete horse market listing";
    return NextResponse.json({ message }, { status: 400 });
  }
}

