import mongoose from "mongoose";

const priceRateSchema = new mongoose.Schema({
  PriceRate: { type: Number, required: true },
  RateType: { type: String, required: true }
}, { _id: false });

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, { _id: false });

const coordinatesSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const shortTermStaySchema = new mongoose.Schema({
  inStableStraw: { type: Boolean, default: false },
  inStableShavings: { type: Boolean, default: false },
  inFieldAlone: { type: Boolean, default: false },
  inFieldHerd: { type: Boolean, default: false },
  inStableStrawPrice: { type: Number, default: null },
  inStableShavingsPrice: { type: Number, default: null },
  inFieldAlonePrice: { type: Number, default: null },
  inFieldHerdPrice: { type: Number, default: null }
}, { _id: false });

const longTermStaySchema = new mongoose.Schema({
  inStableStraw: { type: Boolean, default: false },
  inStableShavings: { type: Boolean, default: false },
  inFieldAlone: { type: Boolean, default: false },
  inFieldHerd: { type: Boolean, default: false },
  inStableStrawPrice: { type: Number, default: null },
  inStableShavingsPrice: { type: Number, default: null },
  inFieldAlonePrice: { type: Number, default: null },
  inFieldHerdPrice: { type: Number, default: null }
}, { _id: false });

const eventPricingSchema = new mongoose.Schema({
  eventingCourse: { type: Boolean, default: false },
  canterTrack: { type: Boolean, default: false },
  jumpingTrack: { type: Boolean, default: false },
  dressageTrack: { type: Boolean, default: false },
  eventingCoursePrice: { type: Number, default: null },
  canterTrackPrice: { type: Number, default: null },
  jumpingTrackPrice: { type: Number, default: null },
  dressageTrackPrice: { type: Number, default: null }
}, { _id: false });

const specialFacilitiesSchema = new mongoose.Schema({
  indoorArena: { type: Boolean, default: false },
  walker: { type: Boolean, default: false },
  treadmill: { type: Boolean, default: false },
  spa: { type: Boolean, default: false },
  solarium: { type: Boolean, default: false },
  lungingArena: { type: Boolean, default: false },
  indoorArenaPrice: { type: Number, default: null },
  walkerPrice: { type: Number, default: null },
  treadmillPrice: { type: Number, default: null },
  spaPrice: { type: Number, default: null },
  solariumPrice: { type: Number, default: null },
  lungingArenaPrice: { type: Number, default: null }
}, { _id: false });

const stableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Tittle: { type: String, required: true },
  Deatils: { type: String, required: true },
  image: [{ type: String }],
  Rating: { type: Number, required: false },
  location: { type: String, required: true },
  coordinates: { type: coordinatesSchema, required: true },
  noofRatingCustomers: { type: Number, required: false },
  PriceRate: [priceRateSchema],
  Slotes: [slotSchema],
  status: { type: String, required: true, default: "active" },
  sponsoredType: { type: String, required: true, default: "normal", enum: ["normal", "sponsored", "reported"] },
  // New fields
  shortTermStay: { type: shortTermStaySchema, default: {} },
  longTermStay: { type: longTermStaySchema, default: {} },
  stallionsAccepted: { type: Boolean, default: false },
  stallionsPrice: { type: Number, default: null },
  eventPricing: { type: eventPricingSchema, default: {} },
  specialFacilities: { type: specialFacilitiesSchema, default: {} }
}, {
  timestamps: true
});

const Stable = mongoose.models.Stable || mongoose.model("Stable", stableSchema);

export default Stable;
