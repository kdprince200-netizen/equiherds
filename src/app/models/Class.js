import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    comment: { 
      type: String, 
      required: false 
    },
    userName: { 
      type: String, 
      required: false 
    }, // Store name for quick access
  },
  { timestamps: true, _id: true }
);

const enrolledStudentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    enrolledAt: { 
      type: Date, 
      default: Date.now 
    },
    status: {
      type: String,
      enum: ['pending', 'enrolled', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  { _id: true }
);

const classSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { 
      type: String, 
      required: true 
    },
    instructor: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      enum: ['BJJ', 'Muay Thai', 'Boxing', 'MMA', 'Judo', 'Karate', 'Taekwondo', 'Wrestling']
    },
    level: { 
      type: String, 
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
    },
    description: { 
      type: String, 
      required: false,
      maxlength: 500
    },

    // Schedule Information
    day: { 
      type: String, 
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: { 
      type: String, 
      required: true 
    }, // e.g., "18:00" or "06:00 PM"
    duration: { 
      type: Number, 
      required: true 
    }, // Duration in minutes (30, 45, 60, 90, 120)
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    recurring: { 
      type: Boolean, 
      default: true 
    },

    // Capacity & Pricing
    maxStudents: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 100 
    },
    price: { 
      type: Number, 
      required: false, 
      min: 0, 
      default: 0 
    },
    room: { 
      type: String, 
      required: false,
      default: 'Main Training Area'
    },

    // Enrollment
    enrolledStudents: [enrolledStudentSchema],

    // Ratings & Reviews
    rating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    }, // Average rating
    ratingCount: { 
      type: Number, 
      default: 0 
    }, // Total number of ratings
    reviews: [reviewSchema],

    // Ownership
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }, // Club/User ID who created this class

    // Status
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

// Virtual for enrolled count
classSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.filter(s => s.status === 'enrolled').length;
});

// Method to calculate average rating
classSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.ratingCount = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.ratingCount = this.reviews.length;
};

// Pre-save hook to calculate rating
classSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    this.calculateAverageRating();
  }
  next();
});

// Index for better query performance
classSchema.index({ createdBy: 1, status: 1 });
classSchema.index({ startDate: 1, endDate: 1 });
classSchema.index({ day: 1, time: 1 });

const Class = mongoose.models.Class || mongoose.model('Class', classSchema);

export default Class;








