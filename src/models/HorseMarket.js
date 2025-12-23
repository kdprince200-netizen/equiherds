import mongoose from "mongoose";

const coordinatesSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const horseMarketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Horse Identification
  horseName: { type: String, required: true },
  ageOrDOB: { type: String, required: true },
  gender: { type: String, required: true, enum: ["Mare", "Stallion", "Gelding"] },
  breed: { type: String, required: true },
  countryOfOrigin: { type: String, default: "" },
  breedType: { type: String, default: "" },
  typicalUse: { type: String, default: "" },
  popularity: { type: String, default: "" },
  regionOfPopularity: { type: String, default: "" },
  color: { type: String, required: true },
  height: { type: Number, required: true },
  microchipNumber: { type: String, default: "" },
  passportRegistrationNo: { type: String, required: true },
  ueln: { type: String, default: "" },
  countryAndCity: { type: String, required: true },
  coordinates: { type: coordinatesSchema, default: null },
  temperament: { type: String, required: true },
  
  // Training & Discipline
  primaryDiscipline: { type: String, required: true },
  trainingLevel: { type: String, required: true },
  experienceLevel: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
  riderSuitability: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
  specialSkills: { type: String, default: "" },
  competitionExperience: { type: Boolean, default: false },
  competitionResults: [{ type: String }], // Array of file URLs
  competitionVideos: [{ type: String }], // Array of file URLs
  
  // Health & Medical
  healthStatus: { type: String, required: true, enum: ["Healthy", "Condition disclosed"] },
  vaccinationStatus: { type: String, required: true, enum: ["Up to date", "Not up to date"] },
  insuranceStatus: { type: String, default: "", enum: ["", "Insured", "Not Insured"] },
  lastVetCheckDate: { type: String, required: true },
  vetReportUpload: [{ type: String }], // Array of file URLs
  vetScansReports: [{ type: String }], // Array of file URLs
  farrierOsteopathDentalDate: { type: String, default: "" },
  wormingHistory: { type: String, default: "" },
  injuriesMedicalConditions: { type: String, required: true },
  vices: { type: String, required: true, enum: ["None", "Cribbing", "Weaving", "Wood Chewing", "Other"] },
  
  // Pedigree & Breeding
  sire: { type: String, default: "" },
  dam: { type: String, default: "" },
  studbook: { type: String, default: "" },
  breedingSuitability: { type: String, default: "", enum: ["", "Suitable", "Not Suitable"] },
  pedigreeDocuments: [{ type: String }], // Array of file URLs
  
  // Media
  photos: [{ type: String }], // Array of image URLs
  videos: [{ type: String }], // Array of video URLs
  
  // Pricing & Sale Condition
  askingPrice: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  trialAvailable: { type: Boolean, default: false },
  paymentTerms: { type: String, default: "", enum: ["", "Deposit", "Installment", "Full Payment"] },
  transportAssistance: { type: String, default: "", enum: ["", "Provided", "Not Provided"] },
  returnConditions: { type: String, default: "" },
  
  // Seller & Verification
  sellerName: { type: String, required: true },
  sellerType: { type: String, required: true, enum: ["Private", "Professional", "Stable"] },
  contactPreferences: { type: String, required: true, enum: ["Chat", "Phone", "Email"] },
  verificationStatus: { type: String, default: "" },
  
  // Legal & Compliance
  ownershipConfirmation: { type: Boolean, required: true, default: false },
  liabilityDisclaimer: { type: Boolean, required: true, default: false },
  welfareCompliance: { type: Boolean, required: true, default: false },
  
  // Additional
  status: { type: String, required: true, default: "active", enum: ["active", "inactive"] },
  sponsoredType: { type: String, required: true, default: "normal", enum: ["normal", "sponsored", "reported"] }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in Next.js (hot reload)
// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.HorseMarket) {
  delete mongoose.models.HorseMarket;
}

const HorseMarket = mongoose.model("HorseMarket", horseMarketSchema);

export default HorseMarket;

