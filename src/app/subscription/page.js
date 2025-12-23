"use client";

import { useEffect, useState } from "react";
import { getRequest } from "@/service";
import TopSection from "../components/topSection";
import { Check, Star, Users, Calendar, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/utils/localStorage";

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
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

    // Load user data
    const user = getUserData();
    setUserData(user);

    loadSubscriptions();
  }, []);

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

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    // Here you can add logic to redirect to payment or show a modal
    console.log('Selected plan:', plan);
  };

  const handleGetStarted = () => {
    if (userData) {
      // User is logged in, redirect to profile
      router.push('/profile');
    } else {
      // User is not logged in, redirect to login
      router.push('/login');
    }
  };

  const handleGetAnnualOffer = () => {
    if (userData) {
      router.push('/profile');
    } else {
      router.push('/login');
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

  // Remove the loading return - we'll show static content immediately

  // Create structured features for each plan
  const getStructuredFeatures = (subscription, index) => {
    const stables = getStables(subscription.description) || 0;
    const trainers = getTrainers(subscription.description) || 0;
    const veterinarians = getDescValue(subscription.description, ["Equine Veterinarian", "Veterinarian", "Vet"]);
    const farriers = getDescValue(subscription.description, ["Farriers", "Farrier"]);
    const osteopaths = getDescValue(subscription.description, ["Osteopaths", "Osteopath"]);
    const dentists = getDescValue(subscription.description, ["Dentists", "Dentist"]);

    // Common features for all plans
    const commonFeatures = [
      "Booking calendar (lessons, training, or stable rental)",
      "Access to the professional directory & community groups",
      "Accept secured payments directly through Equiherds",
      "Receive reviews & ratings",
      "Visibility in searches across your region",
      "Access via mobile & desktop",
      "Customer support"
    ];

    if (index === 0) { // Basic Plan
      return [
        "Create your personal or professional profile", 
        `${stables} Stables and ${Math.min(trainers, veterinarians, farriers, osteopaths, dentists) || 1} service listing for each category.`,
        ...commonFeatures
      ];
    } else if (index === 1) { // Premium Plan
      return [
        `${stables} Stables and ${Math.min(trainers, veterinarians, farriers, osteopaths, dentists) || 3} service listings for each category.`,
        "Verified Business badge",
        "Featured placement in search results and promotions",
        "Analytics dashboard: Profile, Clients and others.",
        "Access to early advertising campaigns",
      ];
    } else { // Ultra Pro Plan
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

  // Transform API data to subscription plans format
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

    // Pre-compute special-offer pricing details
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
      period: subscription.duration + " months",
      duration: subscription.duration,
      description: `Duration: ${subscription.duration} days`,
      details: subscription.details || "",
      offermonth: subscription.offermonth || 0,
      discountoffermonth: subscription.discountoffermonth || 0,
      features: getStructuredFeatures(subscription, index),
      horses: getHorses(subscription.description),
      trainers: getTrainers(subscription.description),
      stables: getStables(subscription.description),
      // Special-offer computed fields for rendering
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

  return (
    <div className="font-sans">
      <TopSection title="Subscription Plans" bgImage="/product/1.jpg" />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the full potential of our equestrian platform with our flexible subscription plans.
              Manage your horses, trainers, and stables with ease.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-brand mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage multiple users and permissions</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Calendar className="w-8 h-8 text-brand mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Booking System</h3>
              <p className="text-sm text-gray-600">Advanced scheduling and booking tools</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-brand mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-sm text-gray-600">Enterprise-grade security and privacy</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Star className="w-8 h-8 text-brand mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Premium Support</h3>
              <p className="text-sm text-gray-600">24/7 customer support and assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Available Plans</h3>
            <p className="text-lg text-gray-600">
              Select the plan that best fits your needs
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-brand text-lg">Loading subscription plans</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 ${plan.popular ? 'ring-2 ring-green-500 ring-opacity-50 scale-105 shadow-lg' : ''
                    } ${plan.color} h-full flex flex-col`}
              >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Flexible content wrapper to equalize card heights */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{renderSplitPlanName(plan.name)}</h3>
                      <div className="mb-4">
                        <div>
                          <span className="text-5xl font-bold text-gray-900">€{plan.price}</span>
                          <span className="text-gray-600 text-lg">/month</span>
                        </div>
                      </div>
                      <p className="text-gray-600">Duration: 30 days (1st 60 days free)                    </p>
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
                        </div>
                      )}
                    </div>
                    {/* Includes section */}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="space-y-1">
                        {index === 0 && (
                          <p className="text-dark-600 text-lg">Includes:</p>
                        )}
                        {index === 1 && (
                          <p className="text-dark-600 text-lg">Includes all Basic features, plus:</p>
                        )}
                        {index === 2 && (
                          <p className="text-dark-600 text-lg">Includes all Business features, plus:</p>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start pb-0">
                          <div className="w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <Check className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Includes section */}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="space-y-1">
                        {index === 0 && (
                          <p className="text-dark-600 text-sm">Perfect for individual’s and small professionals ready to join Tomorrow’s Equestrian World.
                          </p>
                        )}
                        {index === 1 && (
                          <p className="text-dark-600 text-sm">Perfect for professionals looking to grow their business Ideal for trainers, vets, newcomers who want exposure and connections.
                          </p>
                        )}
                        {index === 2 && (
                          <p className="text-dark-600 text-sm">Designed for top-tier partners ready to lead Tomorrows Equestrian World.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className={`mt-6 w-full py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 ${plan.buttonColor}`}
                  >
                    Get Started — €{Number(plan.price).toFixed(2)}/month
                  </button>
                 
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of equestrian professionals who trust our platform for their business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Easy Management</h4>
              <p className="text-gray-600">
                Streamline your operations with our intuitive management tools designed specifically for equestrian businesses.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-brand" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Flexible Scheduling</h4>
              <p className="text-gray-600">
                Manage bookings, appointments, and schedules with our advanced calendar system and automated reminders.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-brand" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h4>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security and 99.9% uptime guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join our community of equestrian professionals and take your business to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGetStarted} className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold cursor-pointer">
              Start Now
            </button>
            <button onClick={() => router.push('/contactus')} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}