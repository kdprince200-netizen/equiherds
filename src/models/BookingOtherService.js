import mongoose from "mongoose";

// Schema for additional services (flexible for different service types)
const additionalServicesSchema = new mongoose.Schema({
  // This will be a flexible object that can contain any service options
  // based on the service type (Vets, Farriers, Dentists, Osteopaths)
}, { _id: false, strict: false });

// Schema for service price details
const servicePriceDetailsSchema = new mongoose.Schema({
  // This will be a flexible object that can contain any service price details
  // based on the service type and selected services
}, { _id: false, strict: false });

const bookingOtherServiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtherService",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['hour', 'day'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    startTime: {
      type: String,
      required: false,
    },
    endTime: {
      type: String,
      required: false,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    additionalServices: {
      type: additionalServicesSchema,
      default: {}
    },
    servicePriceDetails: {
      type: servicePriceDetailsSchema,
      default: {}
    },
    additionalServiceCosts: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfHours: {
      type: Number,
      required: true,
      min: 1,
    },
    // Rating user ID (for rating the service)
    ratingUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // Booking status field
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      required: true
    },
    // Payment ID field
    paymentId: {
      type: String,
      required: false
    },
    // Service type for easy filtering
    serviceType: {
      type: String,
      required: false,
    },
    // Service title for easy reference
    serviceTitle: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
bookingOtherServiceSchema.index({ userId: 1, bookingStatus: 1 });
bookingOtherServiceSchema.index({ clientId: 1, bookingStatus: 1 });
bookingOtherServiceSchema.index({ serviceId: 1, bookingStatus: 1 });
bookingOtherServiceSchema.index({ startDate: 1, endDate: 1 });
bookingOtherServiceSchema.index({ bookingStatus: 1 });

export default mongoose.models.BookingOtherService ||
  mongoose.model("BookingOtherService", bookingOtherServiceSchema);
