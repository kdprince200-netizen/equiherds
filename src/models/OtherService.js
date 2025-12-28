import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { _id: false });

const coordinatesSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const otherServiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  details: { type: String, required: true },
  // type: Vet's, Farriers, Osteopaths, Dentists
  serviceType: { type: String, enum: ["Vets", "Farriers", "Osteopaths", "Dentists"], required: true },
  pricePerHour: { type: Number, required: true },
  experience: { type: String, required: true },
  degree: { type: String, required: false },
  schedule: [scheduleSchema],
  status: { type: String, required: true, default: "active" },
  location: { type: String, required: true },
  coordinates: { type: coordinatesSchema, required: true },
  images: [{ type: String }],
  // key: option key, value: numeric price or null
  serviceOptions: { type: Map, of: Number, default: undefined },
  // Rating fields
  Rating: { type: Number, default: 0 },
  noofRatingCustomers: { type: Number, default: 0 },
  // Sponsored type
  sponsoredType: { type: String, required: true, default: "normal", enum: ["normal", "sponsored", "reported"] }
}, {
  timestamps: true
});

const OtherService = mongoose.models.OtherService || mongoose.model("OtherService", otherServiceSchema);

export default OtherService;


