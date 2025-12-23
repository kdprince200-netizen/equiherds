/**
 * Subscription Management Utilities
 * Handles automatic subscription detection, status checking, and amount calculation
 */

export const SUBSCRIPTION_STATES = {
  ACTIVE: 'active',
  EXPIRED: 'expired', 
  PENDING: 'pending',
  CANCELLED: 'cancelled'
};

export const SUBSCRIPTION_DURATION_DAYS = 30;
export const MONTHLY_AMOUNT_CENTS = 1200; // €12.00

/**
 * Check if subscription is active, expired, or needs renewal
 * @param {Object} user - User object with subscription data
 * @returns {Object} - Subscription status and details
 */
export const checkSubscriptionStatus = (user) => {
  if (!user) {
    return {
      status: SUBSCRIPTION_STATES.EXPIRED,
      message: 'No user data found',
      daysRemaining: 0,
      isExpired: true,
      needsRenewal: true
    };
  }

  // First check if user has direct subscription fields
  if (user.subscriptionExpiry) {
    const now = new Date();
    const expiryDate = new Date(user.subscriptionExpiry);
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysRemaining > 0) {
      return {
        status: SUBSCRIPTION_STATES.ACTIVE,
        message: `Subscription active for ${daysRemaining} more days`,
        daysRemaining: daysRemaining,
        isExpired: false,
        needsRenewal: false,
        expiryDate: expiryDate
      };
    } else {
      const daysOverdue = Math.abs(daysRemaining);
      return {
        status: SUBSCRIPTION_STATES.EXPIRED,
        message: `Subscription expired ${daysOverdue} days ago`,
        daysRemaining: 0,
        daysOverdue: daysOverdue,
        isExpired: true,
        needsRenewal: true,
        expiryDate: expiryDate
      };
    }
  }

  // Check payments array for subscription data
  if (user.payments && user.payments.length > 0) {
    // Find the most recent successful payment with subscription data
    const successfulPayments = user.payments
      .filter(payment => payment.status === 'succeeded')
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first

    if (successfulPayments.length > 0) {
      const latestPayment = successfulPayments[0];
      
      // Check if this payment has subscription expiry
      if (latestPayment.subscriptionExpiry) {
        const now = new Date();
        const expiryDate = new Date(latestPayment.subscriptionExpiry);
        const timeDiff = expiryDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysRemaining > 0) {
          return {
            status: SUBSCRIPTION_STATES.ACTIVE,
            message: `Subscription active for ${daysRemaining} more days`,
            daysRemaining: daysRemaining,
            isExpired: false,
            needsRenewal: false,
            expiryDate: expiryDate,
            subscriptionId: latestPayment.subscriptionId,
            paymentId: latestPayment.paymentId
          };
        } else {
          const daysOverdue = Math.abs(daysRemaining);
          return {
            status: SUBSCRIPTION_STATES.EXPIRED,
            message: `Subscription expired ${daysOverdue} days ago`,
            daysRemaining: 0,
            daysOverdue: daysOverdue,
            isExpired: true,
            needsRenewal: true,
            expiryDate: expiryDate,
            subscriptionId: latestPayment.subscriptionId,
            paymentId: latestPayment.paymentId
          };
        }
      }
    }
  }

  // No subscription found
  return {
    status: SUBSCRIPTION_STATES.EXPIRED,
    message: 'No subscription found',
    daysRemaining: 0,
    isExpired: true,
    needsRenewal: true
  };
};

/**
 * Calculate payment amount based on subscription status
 * @param {Object} user - User object with subscription data
 * @param {Object} selectedSubscription - Selected subscription plan (optional)
 * @returns {Object} - Payment details and amount
 */
export const calculatePaymentAmount = (user, selectedSubscription = null) => {
  const subscriptionStatus = checkSubscriptionStatus(user);
  
  // Use selected subscription price or get from user's subscription data
  let paymentAmount = MONTHLY_AMOUNT_CENTS;
  let subscriptionDuration = SUBSCRIPTION_DURATION_DAYS;
  
  if (selectedSubscription?.subscriptionPrice) {
    paymentAmount = Math.round(selectedSubscription.subscriptionPrice * 100); // Convert to cents
    subscriptionDuration = selectedSubscription.subscriptionDuration || SUBSCRIPTION_DURATION_DAYS;
  } else if (user.subscriptionPrice) {
    paymentAmount = Math.round(user.subscriptionPrice * 100);
    subscriptionDuration = user.subscriptionDuration || SUBSCRIPTION_DURATION_DAYS;
  } else if (user.payments && user.payments.length > 0) {
    // Get from most recent payment with subscription data
    const latestPayment = user.payments
      .filter(payment => payment.subscriptionPrice)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (latestPayment) {
      paymentAmount = Math.round(latestPayment.subscriptionPrice * 100);
      subscriptionDuration = latestPayment.subscriptionDuration || SUBSCRIPTION_DURATION_DAYS;
    }
  }
  
  if (subscriptionStatus.status === SUBSCRIPTION_STATES.ACTIVE) {
    // Early renewal - user is paying before expiry
    return {
      amount: paymentAmount,
      currency: 'eur',
      type: 'early_renewal',
      message: `Renew subscription (${subscriptionStatus.daysRemaining} days remaining)`,
      description: `Extend your subscription by ${subscriptionDuration} days from today`,
      isEarlyRenewal: true,
      daysRemaining: subscriptionStatus.daysRemaining,
      subscriptionDuration: subscriptionDuration
    };
  } else {
    // Expired subscription - needs immediate renewal
    return {
      amount: paymentAmount,
      currency: 'eur', 
      type: 'renewal',
      message: subscriptionStatus.daysOverdue > 0 
        ? `Renew expired subscription (${subscriptionStatus.daysOverdue} days overdue)`
        : 'Start new subscription',
      description: `Activate your subscription for ${subscriptionDuration} days`,
      isExpired: true,
      daysOverdue: subscriptionStatus.daysOverdue || 0,
      subscriptionDuration: subscriptionDuration
    };
  }
};

/**
 * Get subscription display information
 * @param {Object} user - User object with subscription data
 * @param {Object} selectedSubscription - Selected subscription plan (optional)
 * @returns {Object} - Display information for UI
 */
export const getSubscriptionDisplayInfo = (user, selectedSubscription = null) => {
  const status = checkSubscriptionStatus(user);
  const paymentInfo = calculatePaymentAmount(user, selectedSubscription);
  
  return {
    status: status.status,
    message: status.message,
    daysRemaining: status.daysRemaining,
    daysOverdue: status.daysOverdue,
    isExpired: status.isExpired,
    needsRenewal: status.needsRenewal,
    expiryDate: status.expiryDate,
    paymentAmount: paymentInfo.amount,
    paymentMessage: paymentInfo.message,
    paymentDescription: paymentInfo.description,
    paymentType: paymentInfo.type,
    isEarlyRenewal: paymentInfo.isEarlyRenewal,
    subscriptionDuration: paymentInfo.subscriptionDuration,
    formattedAmount: `€${(paymentInfo.amount / 100).toFixed(2)}`
  };
};

/**
 * Calculate new expiry date after payment
 * @param {Object} user - Current user object
 * @param {Date} paymentDate - Date of payment (defaults to now)
 * @param {number} duration - Duration in days (optional, defaults to 30)
 * @returns {Date} - New expiry date
 */
export const calculateNewExpiryDate = (user, paymentDate = new Date(), duration = null) => {
  const subscriptionStatus = checkSubscriptionStatus(user);
  
  // Use provided duration or get from user's subscription data
  let subscriptionDuration = duration || SUBSCRIPTION_DURATION_DAYS;
  
  // Try to get duration from user's subscription data
  if (user.subscriptionDuration) {
    subscriptionDuration = user.subscriptionDuration;
  } else if (user.payments && user.payments.length > 0) {
    // Get duration from the most recent payment with subscription data
    const latestPayment = user.payments
      .filter(payment => payment.subscriptionId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (latestPayment && latestPayment.subscriptionDuration) {
      subscriptionDuration = latestPayment.subscriptionDuration;
    }
  }
  
  if (subscriptionStatus.status === SUBSCRIPTION_STATES.ACTIVE && subscriptionStatus.daysRemaining > 0) {
    // Early renewal - extend from current expiry date
    return new Date(subscriptionStatus.expiryDate.getTime() + (subscriptionDuration * 24 * 60 * 60 * 1000));
  } else {
    // Expired or new subscription - start from payment date
    return new Date(paymentDate.getTime() + (subscriptionDuration * 24 * 60 * 60 * 1000));
  }
};

/**
 * Check if user should see renewal prompt
 * @param {Object} user - User object with subscription data
 * @returns {boolean} - Whether to show renewal prompt
 */
export const shouldShowRenewalPrompt = (user) => {
  const status = checkSubscriptionStatus(user);
  return status.needsRenewal || status.daysRemaining <= 3; // Show prompt 3 days before expiry
};

/**
 * Calculate subscription expiry date based on duration
 * @param {number} duration - Duration in days
 * @param {Date} startDate - Start date (defaults to now)
 * @returns {Date} - Expiry date
 */
export const calculateSubscriptionExpiry = (duration, startDate = new Date()) => {
  return new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
};

/**
 * Check if subscription is active based on expiry date
 * @param {string|Date} expiryDate - Subscription expiry date
 * @returns {boolean} - Whether subscription is active
 */
export const isSubscriptionActive = (expiryDate) => {
  if (!expiryDate) return false;
  const now = new Date();
  const expiry = new Date(expiryDate);
  return expiry > now;
};

/**
 * Get subscription status based on expiry date
 * @param {string|Date} expiryDate - Subscription expiry date
 * @returns {string} - Subscription status
 */
export const getSubscriptionStatus = (expiryDate) => {
  if (!expiryDate) return SUBSCRIPTION_STATES.EXPIRED;
  return isSubscriptionActive(expiryDate) ? SUBSCRIPTION_STATES.ACTIVE : SUBSCRIPTION_STATES.EXPIRED;
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Automatically check and update subscription status
 * This should be called on app load to detect expired subscriptions
 * @param {Object} user - User object with subscription data
 * @returns {Object} - Updated subscription status
 */
export const autoCheckSubscriptionStatus = (user) => {
  if (!user) return null;

  const subscriptionStatus = checkSubscriptionStatus(user);
  
  // If subscription is expired, we should update the user's subscription status
  if (subscriptionStatus.isExpired && subscriptionStatus.status === SUBSCRIPTION_STATES.EXPIRED) {
    // Return the updated status for the frontend to handle
    return {
      ...subscriptionStatus,
      needsUpdate: true,
      shouldUpdateUser: true
    };
  }
  
  return subscriptionStatus;
};
