'use client';

import { useState } from 'react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    student: {
      name: 'Student',
      description: 'Perfect for students looking to learn and grow',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Free account creation',
        'Browse coaches and clubs',
        'Basic messaging',
        'Community access',
        'Pay per session/class',
        'Basic progress tracking'
      ],
      cta: 'Start Free',
      popular: false
    },
    coach: {
      name: 'Coach',
      description: 'For certified coaches ready to teach',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        'Professional profile',
        'Unlimited student connections',
        'Session scheduling',
        'Payment processing',
        'Student progress tracking',
        'Marketing tools',
        'Analytics dashboard',
        'Priority support'
      ],
      cta: 'Start Teaching',
      popular: true
    },
    club: {
      name: 'Club',
      description: 'For clubs and academies',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Club profile & branding',
        'Multiple instructor accounts',
        'Class scheduling system',
        'Member management',
        'Payment processing',
        'Marketing tools',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support'
      ],
      cta: 'List Your Club',
      popular: false
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-slate-200 mb-8">
              Choose the plan that fits your role in the grappling community
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-slate-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                }`}></div>
              </button>
              <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Save 17%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-teal-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-teal-500 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-slate-600">
                        {plan.monthlyPrice === 0 ? 'Free' : `/${billingCycle === 'monthly' ? 'month' : 'year'}`}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-slate-500 mt-1">
                        ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <i className="ri-check-line w-5 h-5 flex items-center justify-center text-teal-500"></i>
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      plan.popular
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

