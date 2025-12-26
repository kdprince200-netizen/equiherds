import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Subscription name
  price: { type: Number, required: true },        // Price of the subscription
  discount: { type: Number, default: 0 },         // Discount (percentage or amount)
  duration: { type: Number, required: true },     // Duration in days/months (specify in usage)
  description: { type: mongoose.Schema.Types.Mixed, default: {} }, // JSON object for flexible description data
  details: { type: String, default: "" },         // Additional details about the subscription
  offermonth: { type: Number, default: 0 },      // Number of months for the offer
  discountoffermonth: { type: Number, default: 0 }, // Discount percentage for offer months
}, {
  timestamps: true
});

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
