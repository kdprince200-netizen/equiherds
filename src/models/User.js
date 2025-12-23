import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  userId: { type: String, required: false }, // Optional for backward compatibility with existing payments
  customerName: { type: String, required: false }, // Customer display name
  customerEmail: { type: String, required: false }, // Customer email for display
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: false },
  subscriptionName: { type: String, required: false },
  subscriptionPrice: { type: Number, required: false },
  subscriptionDuration: { type: Number, required: false },
  subscriptionStatus: { type: String, required: false },
  subscriptionExpiry: { type: String, required: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountType: { 
    type: String, 
    required: true,
    enum: ['buyer', 'seller', 'superAdmin']
  },
  phoneNumber: { type: String, required: false }, // Made optional for Google auth
  password: { type: String, required: false }, // Made optional for Google auth
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' }, // Track auth method
  companyName: { 
    type: String,
    required: function() { return this.accountType === 'seller'; }
  },
  brandImage: { 
    type: String,
    required: function() { return this.accountType === 'seller'; }
  }, 
  companyInfo: { 
    type: String,
    required: function() { return this.accountType === 'seller'; }
  },
  companyLicence: { type: String },
  vatNo: { 
    type: String,
    required: function() { return this.accountType === 'seller'; }
  },
  stripeAccountId: { 
    type: String,
    required: function() { return this.accountType === 'seller'; }
  },
  street: { type: String },
  city: { type: String },
  country: { type: String },
  zipcode: { type: String },
  address1: { type: String },
  address2: { type: String },
  Details: { type: String, required:  false },
  profilePicture: { type: String, required:  false },
  status: { type: String, required: true },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: false },
  subscriptionName: { type: String, required: false },
  subscriptionPrice: { type: Number, required: false },
  subscriptionDuration: { type: Number, required: false }, // Duration in days
  subscriptionExpiry: { type: Date, required: false },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'pending', 'cancelled'],
    default: 'pending',
    required: false
  },
  payments: { type: [paymentSchema], default: [] }, // Add payments array of JSON objects
  // Stripe billing fields
  stripeCustomerId: { type: String, required: false },
  defaultPaymentMethodId: { type: String, required: false },
  autoRenewalEnabled: { type: Boolean, default: true },
  isProcessingPayment: { type: Boolean, default: false } // Flag to prevent duplicate payment processing
}, {
  timestamps: true 
});

// Remove password from JSON outputs
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (ret && ret.password) {
      delete ret.password;
    }
    return ret;
  }
});

// Hash password before save if modified (only for local auth)
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password') || this.authProvider === 'google') return next();
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Hash password on findOneAndUpdate if provided (only for local auth)
userSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();
    if (update && update.password && update.authProvider !== 'google') {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Custom validation for seller fields
userSchema.pre('save', function(next) {
  if (this.accountType === 'seller') {
    if (!this.companyName || !this.companyInfo || !this.brandImage || !this.vatNo || !this.stripeAccountId) {
      const error = new Error('Company name, company info, brand image, VAT number, and Stripe account ID are required for sellers');
      return next(error);
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
