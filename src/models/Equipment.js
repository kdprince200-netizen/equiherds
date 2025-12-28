import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  deliveryCharges: { type: Number, default: 0, min: 0 },
  noOfDaysDelivery: { type: Number, default: 0, min: 0 },
  totalStock: { type: Number, default: 0, min: 0 },
  details: { type: String, default: "" },
  mainCategory: { type: String, required: true },
  subcategory: { type: String, required: true },
  subSubcategory: { type: String, required: true },
  category: { type: String, default: "" }, // For backward compatibility
  photos: [{ type: String }], // Array of image URLs
  status: { type: String, required: true, default: "active", enum: ["active", "inactive"] },
  sponsoredType: { type: String, required: true, default: "normal", enum: ["normal", "sponsored", "reported"] }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in Next.js (hot reload)
if (mongoose.models.Equipment) {
  delete mongoose.models.Equipment;
}

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;


