"use client";

import { useEffect, useRef } from "react";
import { getUserData } from "../utils/localStorage";
import { getRequest, postRequest } from "../../service";
import { autoCheckSubscriptionStatus } from "../utils/subscriptionUtils";

// Function to log all expired users in the system
const logAllExpiredUsers = async () => {
  try {
    console.log('🔍 Checking all users for expired subscriptions...');
    const allUsersRes = await getRequest('/api/users');
    const allUsers = allUsersRes?.users || [];

    const expiredUsers = [];
    const activeUsers = [];

    allUsers.forEach(user => {
      if (user.accountType === 'seller') {
        const status = autoCheckSubscriptionStatus(user);
        if (status && status.isExpired) {
          expiredUsers.push({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            expiryDate: user.subscriptionExpiry,
            stripeCustomerId: user.stripeCustomerId,
            defaultPaymentMethodId: user.defaultPaymentMethodId,
            hasPaymentMethod: !!(user.stripeCustomerId && user.defaultPaymentMethodId),
            autoRenewal: user.autoRenewalEnabled
          });
        } else {
          activeUsers.push({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.subscriptionStatus
          });
        }
      }
    });

    console.log(`📊 SUBSCRIPTION SUMMARY:`);
    console.log(`   Total Sellers: ${allUsers.filter(u => u.accountType === 'seller').length}`);
    console.log(`   ❌ Expired Users: ${expiredUsers.length}`);
    console.log(`   ✅ Active Users: ${activeUsers.length}`);

    if (expiredUsers.length > 0) {
      console.log(`\n❌ EXPIRED USERS LIST:`);
      expiredUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email})`);
        console.log(`      - ID: ${user.id}`);
        console.log(`      - Expiry: ${user.expiryDate}`);
        console.log(`      - Stripe Customer ID: ${user.stripeCustomerId || 'Not set'}`);
        console.log(`      - Payment Method ID: ${user.defaultPaymentMethodId || 'Not set'}`);
        console.log(`      - Payment Method: ${user.hasPaymentMethod ? 'Yes' : 'No'}`);
        console.log(`      - Auto Renewal: ${user.autoRenewal ? 'Enabled' : 'Disabled'}`);
        console.log('');
      });
    }

    if (activeUsers.length > 0) {
      console.log(`\n✅ ACTIVE USERS:`);
      activeUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Status: ${user.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking all users:', error);
  }
};

export default function AutoSubscriptionManager() {
  const ranRef = useRef(false);

  // Make the function available globally for manual testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.checkExpiredUsers = logAllExpiredUsers;
      window.checkAllSellers = async () => {
        console.log('🚀 Manual system-wide seller subscription check...');
        const allUsersRes = await getRequest('/api/users');
        const allUsers = allUsersRes?.users || [];
        const sellers = allUsers.filter(user => user.accountType === 'seller');

        console.log(`📊 Found ${sellers.length} sellers in the system`);

        for (const seller of sellers) {
          const status = autoCheckSubscriptionStatus(seller);
          console.log(`\n👤 ${seller.firstName} ${seller.lastName} (${seller.email})`);
          console.log(`   - Stripe Customer ID: ${seller.stripeCustomerId || '❌ Not set'}`);
          console.log(`   - Payment Method ID: ${seller.defaultPaymentMethodId || '❌ Not set'}`);
          console.log(`   - Subscription Status: ${seller.subscriptionStatus || 'No status'}`);
          console.log(`   - Expiry: ${seller.subscriptionExpiry || 'No expiry'}`);
          if (status && status.isExpired) {
            console.log(`   - Status: ❌ EXPIRED`);
          } else {
            console.log(`   - Status: ✅ ACTIVE`);
          }
        }
      };

      window.checkCustomerIds = async () => {
        console.log('🔍 Checking all customer IDs...');
        const allUsersRes = await getRequest('/api/users');
        const allUsers = allUsersRes?.users || [];
        const sellers = allUsers.filter(user => user.accountType === 'seller');

        console.log(`📊 Found ${sellers.length} sellers`);

        const withCustomerId = sellers.filter(s => s.stripeCustomerId);
        const withoutCustomerId = sellers.filter(s => !s.stripeCustomerId);

        console.log(`✅ Sellers with Stripe Customer ID: ${withCustomerId.length}`);
        console.log(`❌ Sellers without Stripe Customer ID: ${withoutCustomerId.length}`);

        if (withCustomerId.length > 0) {
          console.log('\n✅ SELLERS WITH CUSTOMER ID:');
          withCustomerId.forEach(seller => {
            console.log(`   - ${seller.firstName} ${seller.lastName}: ${seller.stripeCustomerId}`);
          });
        }

        if (withoutCustomerId.length > 0) {
          console.log('\n❌ SELLERS WITHOUT CUSTOMER ID:');
          withoutCustomerId.forEach(seller => {
            console.log(`   - ${seller.firstName} ${seller.lastName} (${seller.email})`);
          });
        }
      };
      console.log('💡 You can manually check expired users by running: checkExpiredUsers()');
      console.log('💡 You can check all sellers by running: checkAllSellers()');
      console.log('💡 You can check customer IDs by running: checkCustomerIds()');
    }
  }, []);

  useEffect(() => {
    // We disable the automatic system-wide check here to prevent performance issues and crashes
    // as the user base grows. System-wide checks should be handled by a backend service/cron job.
    /*
    if (ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      try {
        console.log('🚀 AutoSubscriptionManager: Starting system-wide subscription check...');
        
        // Get all users from the system
        const allUsersRes = await getRequest('/api/users');
        const allUsers = allUsersRes?.users || [];
        
        // Filter only sellers
        const sellers = allUsers.filter(user => user.accountType === 'seller');
        console.log(`📊 Found ${sellers.length} sellers in the system`);

        if (sellers.length === 0) {
          console.log('ℹ️ No sellers found in the system');
          return;
        }

        // ... (rest of the bulk logic)
      } catch (err) {
        console.error('❌ AutoSubscriptionManager error:', err);
      }
    };

    run();
    */
    console.log('ℹ️ AutoSubscriptionManager: Automatic system-wide check is disabled to optimize performance.');
  }, []);

  return null;
}


