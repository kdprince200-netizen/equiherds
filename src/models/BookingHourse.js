import mongoose from "mongoose";

const bookingHorseSchema = new mongoose.Schema(
  {
    horseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HorseMarket",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    visitTime: {
      type: String,
      required: true,
    },
    quotationAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BookingHorse ||
  mongoose.model("BookingHorse", bookingHorseSchema);
