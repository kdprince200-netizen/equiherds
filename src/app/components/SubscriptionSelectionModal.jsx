"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Tag, Spin, Alert } from "antd";
import { getRequest } from "@/service";
import { getUserData } from "@/app/utils/localStorage";
import { calculateSubscriptionExpiry } from "@/app/utils/subscriptionUtils";
import { CheckCircle, Star, X } from "lucide-react";

export default function SubscriptionSelectionModal({
  visible,
  onCancel,
  onSubscriptionSelected,
  userData
}) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available subscriptions
  useEffect(() => {
    if (visible) {
      fetchSubscriptions();
    }
  }, [visible]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequest('/api/subscriptions');
      if (response && response.subscriptions) {
        setSubscriptions(response.subscriptions);
      } else {
        setError('No subscription plans available');
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  // Render plan name with a line break after the word "Plan" if present
  const renderSplitPlanName = (name) => {
    if (!name || typeof name !== 'string') return name;
    const lower = name.toLowerCase();
    const idx = lower.indexOf('plan');
    if (idx === -1) return name;
    const firstLine = name.slice(0, idx + 4);
    const secondLine = name.slice(idx + 4).trim();
    return (
      <>
        {firstLine}
        {secondLine ? (<><br />{secondLine}</>) : null}
      </>
    );
  };

  const handleSubscriptionSelect = (subscription) => {
    setSelectedSubscription(subscription);
  };

  const handleConfirmSelection = () => {
    if (!selectedSubscription) return;
    // Use exactly the price shown on the Select button (monthly price), no extra calculations
    const displayedMonthlyPrice = Number(selectedSubscription.price || 0);
    const subscriptionDurationDays = 30; // as displayed: "Plan duration: 30 Days"
    const expiryDate = calculateSubscriptionExpiry(subscriptionDurationDays);

    const subscriptionData = {
      subscriptionId: selectedSubscription._id,
      subscriptionName: selectedSubscription.name,
      subscriptionPrice: displayedMonthlyPrice,
      subscriptionDuration: subscriptionDurationDays,
      subscriptionExpiry: expiryDate,
      subscriptionStatus: 'Active',
      description: selectedSubscription.description
    };

    console.log('Subscription data being sent:', subscriptionData);
    onSubscriptionSelected(subscriptionData);
  };

  const handleSpecialOfferSelect = (subscription, offerMonths, discountPercent) => {
    if (subscription) {
      // Special offer charges ONLY the discounted offer months (no base added)
      const pricePerMonth = Number(subscription.price || 0);
      const offerMonthsNum = Number(offerMonths || 0);
      const discountPct = Number(discountPercent || 0);

      const offerSubtotal = pricePerMonth * offerMonthsNum;
      const discountedOffer = Math.round(offerSubtotal * (1 - discountPct / 100));

      // Duration reflects only the offer months
      const totalDurationDays = offerMonthsNum * 30;
      const expiryDate = calculateSubscriptionExpiry(totalDurationDays);

      const subscriptionData = {
        subscriptionId: subscription._id,
        subscriptionName: subscription.name,
        subscriptionPrice: discountedOffer, // Only offer months at discount
        subscriptionDuration: totalDurationDays,
        subscriptionExpiry: expiryDate,
        subscriptionStatus: 'Active',
        description: subscription.description,
        specialOffer: {
          months: offerMonthsNum,
          discountPercent: discountPct,
          originalPrice: pricePerMonth,
          discountedPrice: Math.round(pricePerMonth * (1 - discountPct / 100)),
          totalPrice: discountedOffer,
          savings: offerSubtotal - discountedOffer
        }
      };

      console.log('Special offer subscription data being sent:', subscriptionData);

      onSubscriptionSelected(subscriptionData);
    }
  };

  // Create structured features for each plan (mirrors subscription/page.js)
  const getStructuredFeatures = (subscription, index) => {
    const stables = getStables(subscription.description) || 0;
    const trainers = getTrainers(subscription.description) || 0;
    const veterinarians = getDescValue(subscription.description, ["Equine Veterinarian", "Veterinarian", "Vet"]);
    const farriers = getDescValue(subscription.description, ["Farriers", "Farrier"]);
    const osteopaths = getDescValue(subscription.description, ["Osteopaths", "Osteopath"]);
    const dentists = getDescValue(subscription.description, ["Dentists", "Dentist"]);

    const commonFeatures = [
      
      "Booking calendar (lessons, training, or stable rental)",
      "Access to the professional directory & community groups",
      "Accept secured payments directly through Equiherds",
      "Receive reviews & ratings",
      "Visibility in searches across your region",
      "Access via mobile & desktop",
      "Customer support"
    ];

    if (index === 0) {
      return [
        "Create your personal or professional profile",
        `${stables} Stables and ${Math.min(trainers, veterinarians, farriers, osteopaths, dentists) || 1} service listing for each category.`,
        ...commonFeatures
      ];
    } else if (index === 1) {
      return [
        `${stables} Stables and ${Math.min(trainers, veterinarians, farriers, osteopaths, dentists) || 3} service listings for each category.`,
        "Verified Business badge",
        "Featured placement in search results and promotions",
        "Analytics dashboard: Profile, Clients and others.",
        "Access to early advertising campaigns",
        // ...commonFeatures
      ];
    } else {
      return [
        "Unlimited listings (Stables, Coaching and services)",
        "Homepage and sponsored content banner placement",
        "Highlighted Premium badge in search results",
        "Priority support.",
        "Early access to new tools and beta features",
        // ...commonFeatures
      ];
    }
  };

  // Safely extract a value from a possibly inconsistent description object
  const getDescValue = (description, candidateKeys) => {
    if (!description || typeof description !== 'object') return undefined;
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
      "No of Hourse",
      "No of Horses",
      "Horses",
      "Horse",
      "No Horses",
      "No of Horse",
    ]);

  const getTrainers = (description) =>
    getDescValue(description, [
      "No of Trainer",
      "No of Trainers",
      "Trainers",
      "Trainer",
      "No Trainers",
    ]);

  const getStables = (description) =>
    getDescValue(description, [
      "No Stables",
      "No of Stables",
      "No of Stable",
      "No of Syables",
      "Stables",
      "Stable",
    ]);

  // Transform API data to subscription plans format (same as page.js)
  const subscriptionPlans = subscriptions.map((subscription, index) => {
    const colors = [
      {
        color: "border-blue-200 bg-blue-50",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        accentColor: "text-blue-600"
      },
      {
        color: "border-green-200 bg-green-50",
        buttonColor: "bg-green-600 hover:bg-green-700",
        accentColor: "text-green-600"
      },
      {
        color: "border-purple-200 bg-purple-50",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        accentColor: "text-purple-600"
      }
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
    
    // Calculate annual offer with discount (12 months with discount applied)
    const annualPriceWithoutDiscount = pricePerMonth * 12;
    const annualDiscountAmount = annualPriceWithoutDiscount * (offerDiscountPct / 100);
    const annualOfferPrice = annualPriceWithoutDiscount - annualDiscountAmount;
    const monthlyEquivalent = annualOfferPrice / 12;

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
      features: getStructuredFeatures(subscription, index),
      horses: getHorses(subscription.description),
      trainers: getTrainers(subscription.description),
      stables: getStables(subscription.description),
      // Computed totals used only for amounts, not changing wording
      baseMonths,
      offerMonths,
      pricePerMonth,
      baseSubtotal,
      offerSubtotal,
      discountedOffer,
      totalPayable,
      totalSavings,
      // Annual offer: 12 months with discount applied
      annualOfferPrice: annualOfferPrice,
      monthlyEquivalent: monthlyEquivalent,
      ...colorScheme,
      popular: index === 1 // Make the second plan popular
    };
  });

  const handleAnnualOfferSelect = (subscription) => {
    if (!subscription) return;
    const pricePerMonth = Number(subscription.price || 0);
    const offerDiscountPct = Number(subscription.discountoffermonth || 0);
    const totalDurationDays = 12 * 30;
    const expiryDate = calculateSubscriptionExpiry(totalDurationDays);

    // Calculate annual offer with discount (12 months with discount applied)
    const annualPriceWithoutDiscount = pricePerMonth * 12;
    const annualDiscountAmount = annualPriceWithoutDiscount * (offerDiscountPct / 100);
    const discountedAnnualPrice = annualPriceWithoutDiscount - annualDiscountAmount;
    const monthlyEquivalent = discountedAnnualPrice / 12;

    const subscriptionData = {
      subscriptionId: subscription._id,
      subscriptionName: subscription.name,
      subscriptionPrice: discountedAnnualPrice,
      subscriptionDuration: totalDurationDays,
      subscriptionExpiry: expiryDate,
      subscriptionStatus: 'Active',
      description: subscription.description,
      specialOffer: {
        months: 12,
        discountPercent: offerDiscountPct,
        originalPrice: pricePerMonth,
        discountedPrice: monthlyEquivalent,
        totalPrice: discountedAnnualPrice,
        savings: annualDiscountAmount
      }
    };

    onSubscriptionSelected(subscriptionData);
  };

  return (
    <Modal
      title={<div className="text-xl font-bold text-gray-900">Select Subscription Plan</div>}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          disabled={!selectedSubscription}
          onClick={handleConfirmSelection}
        >
          Select Plan
        </Button>
      ]}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      ) : (
        <div className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${plan.popular ? 'ring-2 ring-green-500 ring-opacity-50 scale-105 shadow-lg' : ''
                  } ${selectedSubscription?._id === plan.id
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : plan.color
                  }`}
                onClick={() => handleSubscriptionSelect(subscriptions.find(s => s._id === plan.id))}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{renderSplitPlanName(plan.name)}</h3>
                  <div className="mb-4">
                    <div>
                      <span className="text-5xl font-bold text-gray-900">€{plan.price}</span>
                      <span className="text-gray-600 text-lg">/month</span>
                    </div>
                  </div>
                  <p className="text-gray-600">Duration: 30 days (1st 60 days free)</p>
                  {plan.details && (
                    <p className="text-gray-500 text-sm mt-2 italic">{plan.details}</p>
                  )}
                  {(plan.offermonth > 0 || plan.discountoffermonth > 0) && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm font-semibold">
                        Special Offer: Annual Plan with {plan.discountoffermonth}% off
                      </p>
                      <p className="text-green-800 text-2xl font-bold leading-tight">
                        € {Number(plan.annualOfferPrice).toFixed(2)} / year
                      </p>
                      <p className="text-green-600 text-sm">
                        Only €{Number(plan.monthlyEquivalent).toFixed(2)}/month (Save {plan.discountoffermonth}%)
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnnualOfferSelect(subscriptions.find(s => s._id === plan.id));
                        }}
                        className={`w-full mt-3 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 bg-green-600 hover:bg-green-700`}
                      >
                        Get Annual Offer
                      </button>
                    </div>
                  )}
                </div>

                {/* Includes section */}
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="space-y-1">
                    {(() => {
                      const idx = subscriptions.findIndex(s => s._id === plan.id);
                      if (idx === 0) {
                        return <p className="text-dark-600 text-sm">Includes:</p>;
                      }
                      if (idx === 1) {
                        return <p className="text-dark-600 text-sm">Includes all Basic features, plus:</p>;
                      }
                      if (idx === 2) {
                        return <p className="text-dark-600 text-sm">Includes all Business features, plus:</p>;
                      }
                      return null;
                    })()}
                  </div>
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
                          <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <X className="w-2 h-2 text-red-500" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <CheckCircle className="w-2 h-2 text-green-500" />
                          </div>
                        )}
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className={`w-full py-3 mt-3 px-4 rounded-xl text-white font-semibold text-center transition-all duration-200 ${selectedSubscription?._id === plan.id
                    ? 'bg-blue-600'
                    : plan.buttonColor
                  }`}>
                  {selectedSubscription?._id === plan.id ? 'Selected' : `Select Plan — €${Number(plan.price).toFixed(2)}/month`}
                </div>
              </div>
            ))}
          </div>

          {selectedSubscription && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Selected Plan Details:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Plan:</span>
                  <span className="font-medium text-blue-800">{selectedSubscription.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Amount:</span>
                  <span className="font-medium text-blue-800">€{selectedSubscription.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Duration:</span>
                  <span className="font-medium text-blue-800">{selectedSubscription.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Expires:</span>
                  <span className="font-medium text-blue-800">
                    {calculateSubscriptionExpiry(selectedSubscription.duration).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
