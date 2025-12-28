/**
 * Automatic Subscription Status Checker
 * Checks and updates subscription status automatically
 */

import { postRequest, getRequest } from "@/service";
import { getUserData } from "./localStorage";
import { autoCheckSubscriptionStatus } from "./subscriptionUtils";
import { toast } from "react-hot-toast";

/**
 * Check and update subscription status for current user
 * @returns {Promise<Object>} - Subscription status result
 */
export const checkUserSubscriptionStatus = async () => {
  try {
    const userData = getUserData();
    if (!userData || !userData.id) {
      return { success: false, message: 'User not logged in' };
    }

    // First get the latest user data to check subscription status
    const userResponse = await getRequest(`/api/users?id=${userData.id}`);
    if (userResponse && userResponse.user) {
      const user = userResponse.user;
      
      // Auto-check subscription status
      const autoStatus = autoCheckSubscriptionStatus(user);
      
      if (autoStatus && autoStatus.needsUpdate) {
        console.log("Subscription status needs update:", autoStatus);
        
        // Call the API to update subscription status
        const updateResponse = await postRequest('/api/check-subscription-status', { userId: userData.id });
        
        if (updateResponse.success && updateResponse.updated) {
          console.log("Subscription status updated:", updateResponse.user.subscriptionStatus);
          
          // Show notification if subscription expired
          if (autoStatus.isExpired) {
            toast.warning(`Your subscription has expired ${autoStatus.daysOverdue} days ago. Please renew to continue.`);
          }
          
          return {
            success: true,
            updated: true,
            subscriptionStatus: autoStatus.status,
            message: autoStatus.message
          };
        }
      }
      
      return {
        success: true,
        updated: false,
        subscriptionStatus: autoStatus?.status || 'active',
        message: autoStatus?.message || 'Subscription is active'
      };
    }

    return { success: false, message: 'Failed to fetch user data' };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Check subscription status on app initialization
 * Call this in your main layout or app component
 */
export const initializeSubscriptionChecker = async () => {
  try {
    const result = await checkUserSubscriptionStatus();
    if (result.success) {
      console.log('Subscription status checked:', result.subscriptionStatus);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Error initializing subscription checker:', error);
    return null;
  }
};
