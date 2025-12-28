"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/service";
import EditSubscriptionModal from "../components/EditSubscriptionModal";
import { CheckCircle, X } from "lucide-react";

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const res = await getRequest('/api/subscriptions');
        setSubscriptions(res.subscriptions || []);
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadSubscriptions();
  }, []);

  // Safely extract a value from a possibly inconsistent description object
  const getDescValue = (description, candidateKeys) => {
    if (!description || typeof description !== 'object') return undefined;
    // Build a case-insensitive lookup once per call
    const lowerKeyToValue = Object.keys(description).reduce((acc, key) => {
      acc[key.toLowerCase()] = description[key];
      return acc;
    }, {});
    for (const key of candidateKeys) {
      const exact = description[key];
      if (exact !== undefined && exact !== null && `${exact}`.trim() !== '') return exact;
      const lower = lowerKeyToValue[key.toLowerCase()];
      if (lower !== undefined && lower !== null && `${lower}`.trim() !== '') return lower;
    }
    return undefined;
  };

  const getHorses = (description) =>
    getDescValue(description, [
      "No of Hourse", // Primary field name from API (with typo)
      "No of Horses",
      "Horses",
      "Horse",
      "No Horses",
      "No of Horse",
    ]);

  const getTrainers = (description) =>
    getDescValue(description, [
      "No of Trainer", // Primary field name from API
      "No of Trainers",
      "Trainers",
      "Trainer",
      "No Trainers",
    ]);

  const getStables = (description) =>
    getDescValue(description, [
      "No Stables", // Primary field name from API
      "No of Stables",
      "No of Stable",
      "No of Syables", // Handle the typo in "Ultra Pro" plan
      "Stables",
      "Stable",
    ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleEditSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedSubscription) => {
    // Update the subscription in the list
    setSubscriptions(prev => 
      prev.map(sub => 
        sub._id === updatedSubscription._id ? updatedSubscription : sub
      )
    );
    setIsEditModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubscription(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-brand">Subscription List</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-brand">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  // Transform API data to subscription plans format
  const subscriptionPlans = subscriptions.map((subscription, index) => {
    // Debug: Log subscription structure to understand the data
    console.log('Subscription data:', subscription);
    const colors = [
      { color: "border-blue-200 bg-blue-50", buttonColor: "bg-blue-600 hover:bg-blue-700" },
      { color: "border-green-200 bg-green-50", buttonColor: "bg-green-600 hover:bg-green-700" },
      { color: "border-purple-200 bg-purple-50", buttonColor: "bg-purple-600 hover:bg-purple-700" }
    ];
    
    const colorScheme = colors[index % colors.length];
    
    // Pre-compute special-offer pricing details (keep UI text unchanged)
    const baseMonths = Number(subscription.duration || 0);
    const offerMonths = Number(subscription.offermonth || 0);
    const pricePerMonth = Number(subscription.price || 0);
    const offerDiscountPct = Number(subscription.discountoffermonth || 0);
    const baseSubtotal = pricePerMonth * baseMonths;
    const offerSubtotal = pricePerMonth * offerMonths;
    const discountedOffer = Math.round(offerSubtotal * (1 - offerDiscountPct / 100));
    const totalPayable = baseSubtotal + discountedOffer;
    const totalSavings = offerSubtotal - discountedOffer;

    return {
      id: subscription._id,
      name: subscription.name,
      price: subscription.price,
      period: Math.round(subscription.duration / 30) + " months",
      duration: subscription.duration,
      description: `Duration: ${subscription.duration} days`,
      details: subscription.details || "",
      offermonth: subscription.offermonth || 0,
      discountoffermonth: subscription.discountoffermonth || 0,
      features: subscription.description ? Object.entries(subscription.description).map(([key, value]) => `${key}: ${value}`) : [],
      // Computed fields for special-offer math
      baseMonths,
      offerMonths,
      pricePerMonth,
      baseSubtotal,
      offerSubtotal,
      discountedOffer,
      totalPayable,
      totalSavings,
      ...colorScheme,
      popular: index === 1 // Make the second plan popular
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand">Subscription Plans</h2>
      </div>
      
      {/* Subscription Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg border-2 p-6 transition-all duration-300 hover:shadow-lg ${
              plan.popular ? 'ring-2 ring-green-500 ring-opacity-50 scale-105' : ''
            } ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            {/* Edit Icon */}
            <button 
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => {
                // Find the original subscription data
                const originalSubscription = subscriptions.find(sub => sub._id === plan.id);
                if (originalSubscription) {
                  handleEditSubscription(originalSubscription);
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-2">
                <div>
                  <span className="text-3xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{plan.description}</p>
              {plan.details && (
                <p className="text-gray-500 text-xs mt-2 italic">{plan.details}</p>
              )}
              {(plan.offermonth > 0 || plan.discountoffermonth > 0) && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-xs font-medium">
                    Special Offer: {plan.offermonth} months (1 month free) at {plan.discountoffermonth}% discount
                  </p>
                  {plan.discountoffermonth > 0 && (
                    <p className="text-green-600 text-xs mt-1">
                      Save €{plan.totalSavings.toFixed(2)} total
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => {
                // Extract the value from the feature string (format: "Key: Value")
                const featureValue = feature.split(': ')[1];
                const isZeroValue = featureValue === "0";
                const isNotAllowed = featureValue && featureValue.toLowerCase().includes("not allowed");
                const shouldShowCross = isZeroValue || isNotAllowed;
                
                return (
                  <li key={index} className="flex items-start">
                    {shouldShowCross ? (
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <X className="w-3 h-3 text-red-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                );
              })}
            </ul>
            
            <button className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors duration-200 ${plan.buttonColor}`}>
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
        subscriptionData={selectedSubscription}
      />
    </div>
  );
}


