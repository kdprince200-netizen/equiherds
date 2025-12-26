import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  palnType: { type: String, enum: ['monthly','yearly'], required: false },
  userId: { type: String, required: false },
  customerName: { type: String, required: false },
  customerEmail: { type: String, required: false },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: false },
  subscriptionName: { type: String, required: false },
  subscriptionPrice: { type: Number, required: false },
  subscriptionDuration: { type: Number, required: false },
  subscriptionStatus: { type: String, required: false },
  subscriptionExpiry: { type: String, required: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName:      { type: String, required: true },
  lastName:       { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  phoneNumber:    { type: String },
  password:       { type: String, required: true },
  confirmPassword:{ type: String, required: true },
  grapplingExperience: { type: String },
  trainingGoals:       { type: String },
  coachingBusinessName: { type: String },
  yearsOfExperience:   { type: Number },
  location:            { type: String },
  cityStateCountry:    { type: String },
  certificationsCredentials: { type: String },
  clubGymName:         { type: String },
  clubImages:         [{ type: String }],  // URLs of club images
  companyName:         { type: String },
  businessType:        { type: String },
  businessDescription: { type: String },
  amenities:           { type: String, required: false },  // Optional: list/description of amenities
  subscriptionCharges: { type: Number, required: false },  // Optional: subscription charges for this user/coach/club
  // Rating info (optional)
  rating:              { type: Number, required: false, default: 0 },   // e.g. 4.1
  ratingCount:         { type: Number, required: false, default: 0 },   // number of ratings
  ratingsDetail: [ // optional per-user ratings
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
      value:  { type: Number, required: false }
    }
  ],
  parentClubId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  vatNo:               { type: String },
  companyLicence:      { type: String },
  stripeAccountId:     { type: String },
  status:              { type: String },
  profilePicture:      { type: String },

  accountType: {
    type: String,
    enum: ['student', 'coach','club','vendor', 'superAdmin'],
    required: true
  },

  payments: [paymentSchema],

  stripeCustomerId: { type: String, required: false },
  defaultPaymentMethodId: { type: String, required: false },
  autoRenewalEnabled: { type: Boolean, default: true },
  isProcessingPayment: { type: Boolean, default: false },

  subscriptionDuration: { type: Number, required: false }, // Duration in days
  subscriptionExpiry: { type: Date, required: false },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'pending', 'cancelled'],
    default: 'pending',
    required: false
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
