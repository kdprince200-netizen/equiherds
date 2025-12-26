import mongoose from 'mongoose';

const recordedSessionSchema = new mongoose.Schema(
  {
    // Basic info
    title: { type: String, required: true },
    description: { type: String, required: true, maxlength: 500 },
    
    // Categorization
    category: {
      type: String,
      enum: ['technique', 'fundamentals', 'conditioning', 'mental training', 'competition prep'],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all levels'],
      required: true,
    },
    
    // Duration
    duration: { type: Number, required: true }, // duration in minutes
    
    // Pricing
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 }, // price in USD
    
    // Media
    videoUrl: { type: String, required: true }, // primary video URL from uploadVideos
    videoUrls: [{ type: String }], // array of all video URLs for multiple videos
    thumbnail: { type: String }, // optional thumbnail URL
    
    // Status and moderation
    status: {
      type: String,
      default: 'Pending',
    },
    rejectionReason: { type: String }, // reason if rejected
    
    // Analytics
    views: { type: Number, default: 0 },
    subscribers: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    
    // References
    coach: { type: String }, // coach name
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to creator
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to club if created by club
  },
  { timestamps: true }
);

const RecordedSession =
  mongoose.models.RecordedSession || mongoose.model('RecordedSession', recordedSessionSchema);

export default RecordedSession;

