import mongoose from 'mongoose';

const scheduleItemSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true }, // e.g. "10:00"
    endTime: { type: String, required: true },   // e.g. "11:00"
  },
  { _id: false }
);

const lectureSchema = new mongoose.Schema(
  {
    // basic info
    courseTitle: { type: String, required: true },
    description: { type: String, required: true },

    // media (stored as URL strings)
    coverImageUrl: { type: String, required: true }, // from uploadFile / uploadFiles
    demoVideoUrl: { type: String, required: true },  // from uploadVideos or uploadFiles
    lectureVideos: [{ type: String }],               // array of video URLs for offline courses

    // categorization
    courseType: [{ type: String }], // tags like "Beginner", "No-Gi"

    // pricing
    coursePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    // type of lecture
    lectureType: {
      type: String,
      enum: ['offline', 'live'],
      required: true,
    },

    // offline-specific
    duration: { type: String }, // e.g. "10 hours", "5 days"

    // live-specific
    courseLengthWeeks: { type: Number }, // number of weeks
    classSchedule: [scheduleItemSchema],

    // optional reference to the creator/coach
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

const Lecture =
  mongoose.models.Lecture || mongoose.model('Lecture', lectureSchema);

export default Lecture;


