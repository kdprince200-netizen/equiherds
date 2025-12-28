"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import IMask from "imask";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from "react-hot-toast";
import { images } from "../const/images";
import { getUserData } from "../utils/localStorage";
import { postRequest, getRequest, putRequest } from "../../service/index";
import { 
    getSubscriptionDisplayInfo, 
    calculateNewExpiryDate, 
    shouldShowRenewalPrompt,
    formatDate,
    autoCheckSubscriptionStatus,
    SUBSCRIPTION_STATES 
} from "../utils/subscriptionUtils";
import SubscriptionSelectionModal from "../components/SubscriptionSelectionModal";

const dummyHistory = [
    { month: "January", year: 2024, price: 1200, status: "Paid" },
    { month: "February", year: 2024, price: 1200, status: "Paid" },
    { month: "March", year: 2024, price: 1200, status: "Paid" },
    { month: "April", year: 2024, price: 1200, status: "Paid" },
    { month: "May", year: 2024, price: 1200, status: "Pending" },
];

// Stripe Elements Payment Form Component
function PaymentForm({ name, setName, flipped, setFlipped, subscriptionInfo, userData, selectedSubscription, onShowSubscriptionModal, setSelectedSubscription, isFirstPayment, fetchUserPayments }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        
        // If no subscription is selected, show subscription modal instead
        if (!selectedSubscription) {
            // Check if card details are complete before allowing subscription selection
            if (!name.trim() || !cardComplete) {
                toast.error('Please enter cardholder name and complete card details first');
                return;
            }
            onShowSubscriptionModal();
            return;
        }
        
        if (!stripe || !elements) {
            console.error('Stripe not initialized');
            return;
        }

        if (!name.trim()) {
            console.error('Please enter cardholder name');
            toast.error('Please enter cardholder name');
            return;
        }

        if (isFirstPayment) {
            // First-time user: start 60-day free trial and save card, no charge now
            const confirmTrial = () => {
                toast((t) => (
                    <div className="flex flex-col space-y-3">
                        <div className="text-sm font-medium">Start 60-day Free Trial</div>
                        <div className="text-sm">
                            Your card will be saved for auto-renewal. After the free trial ends, we'll charge your selected plan unless you unsubscribe.
                        </div>
                        <div className="flex space-x-2 gap-3">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    processTrialActivation();
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                                Confirm & Start Trial
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ), {
                    duration: 12000,
                    position: 'top-center',
                });
            };
            confirmTrial();
            return;
        }

        // Show confirmation toast before processing immediate payment (non-first-time)
        const paymentAmount = selectedSubscription?.subscriptionPrice 
            ? `€${selectedSubscription.subscriptionPrice}` 
            : (subscriptionInfo?.formattedAmount || '€12.00');
        
        const confirmPayment = () => {
            toast((t) => (
                <div className="flex flex-col space-y-3">
                    <div className="text-sm font-medium">
                        Confirm Payment
                    </div>
                    <div className="text-sm">
                        Do you want to proceed with payment of {paymentAmount}?
                    </div>
                    <div className="flex space-x-2 gap-3">
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                processPayment();
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                            Confirm & Pay
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), {
                duration: 10000, // 10 seconds
                position: 'top-center',
            });
        };

        confirmPayment();
    };

    const processTrialActivation = async () => {
        if (isProcessing) {
            console.log('Trial activation already processing, skipping duplicate call');
            return;
        }
        setIsProcessing(true);
        try {
            const cardElement = elements.getElement(CardElement);
            const localUserData = getUserData();
            const userId = localUserData?.id || localUserData?._id;
            const userFullName = localUserData ? `${localUserData.firstName} ${localUserData.lastName}`.trim() : name;
            if (!userId) {
                toast.error('User not found');
                return;
            }

            // 1) Ensure Stripe customer exists (reuse backend endpoint contract)
            const customerResponse = await fetch('/api/create-setup-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId,
                    email: localUserData?.email,
                    name: `${localUserData?.firstName || ''} ${localUserData?.lastName || ''}`.trim(),
                    metadata: { purpose: 'subscription_autorenew', user_id: userId }
                })
            });
            const customerData = await customerResponse.json();
            if (!customerData?.customerId) {
                console.error('Failed to create/get Stripe customer:', customerData);
                toast.error('Failed to save card. Please try again.');
                return;
            }

            // Persist customerId on user
            await postRequest('/api/users', { id: userId, stripeCustomerId: customerData.customerId });

            // 2) Create setup intent and confirm to save card
            const setupIntentRes = await fetch('/api/create-setup-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId: customerData.customerId, metadata: { purpose: 'subscription_autorenew' } })
            });
            const setupIntentData = await setupIntentRes.json();
            if (!setupIntentData?.clientSecret) {
                toast.error('Failed to initialize card setup.');
                return;
            }
            const { error: setupErr, setupIntent } = await stripe.confirmCardSetup(setupIntentData.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: userFullName, email: localUserData?.email || '' }
                }
            });
            if (setupErr || !setupIntent?.payment_method) {
                console.error('Card setup error:', setupErr);
                toast.error(setupErr?.message || 'Failed to save card');
                return;
            }

            // 3) Save payment method as default
            await postRequest('/api/users/payment-method', {
                userId,
                stripeCustomerId: customerData.customerId,
                paymentMethodId: setupIntent.payment_method,
                makeDefault: true
            });

            // Ensure auto-renew is enabled by default for trial (user can disable later)
            try {
                await putRequest(`/api/users?id=${userId}`, { autoRenewalEnabled: true });
            } catch (_) {}

            // 4) Activate subscription with 60-day free trial (override duration/expiry)
            const trialExpiry = new Date();
            trialExpiry.setDate(trialExpiry.getDate() + 60);
            const trialSubscriptionData = {
                ...selectedSubscription,
                subscriptionDuration: 60,
                subscriptionExpiry: trialExpiry.toISOString(),
                subscriptionStatus: 'Active'
            };
            await postRequest('/api/subscription-selection', {
                userId,
                subscriptionData: trialSubscriptionData
            });

            // 5) Record zero-amount payment for trial start
            await postRequest('/api/users/payments', {
                userId,
                paymentId: `trial_${Date.now()}`,
                amount: 0,
                currency: 'eur',
                status: 'succeeded',
                subscriptionId: selectedSubscription?.subscriptionId || null,
                subscriptionName: selectedSubscription?.subscriptionName || null,
                subscriptionPrice: selectedSubscription?.subscriptionPrice || null,
                subscriptionDuration: 60,
                subscriptionStatus: 'active',
                subscriptionExpiry: trialExpiry.toISOString(),
                metadata: { type: 'trial_start' }
            });

            toast.success('Free trial started! Your card is saved for auto-renewal.');
            setSelectedSubscription(null);
            if (typeof fetchUserPayments === 'function') fetchUserPayments();
            setTimeout(() => { window.location.href = '/profile'; }, 1500);
        } catch (err) {
            console.error('Trial activation error:', err);
            toast.error('Failed to start free trial. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const processPayment = async () => {
        if (isProcessing) {
            console.log('Payment already processing, skipping duplicate call');
            return;
        }
        
        setIsProcessing(true);
        console.log('Starting payment process with Stripe Elements...');

        try {
            // Get payment amount based on selected subscription or default
            const paymentAmount = selectedSubscription?.subscriptionPrice 
                ? Math.round(selectedSubscription.subscriptionPrice * 100) // Convert to cents
                : (subscriptionInfo?.paymentAmount || 1200);
            const currency = subscriptionInfo?.currency || 'eur';
            
            // Create payment intent
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: paymentAmount,
                    currency: currency
                }),
            });

            const { clientSecret, paymentIntentId } = await response.json();
            console.log('Payment intent created:', paymentIntentId);

            // Get the card element
            const cardElement = elements.getElement(CardElement);

            // Get user data for consistent billing details
            const localUserData = getUserData();
            const userFullName = localUserData ? `${localUserData.firstName} ${localUserData.lastName}`.trim() : name;
            
            // Confirm payment with Stripe Elements
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: userFullName, // Use actual user name from database
                        email: localUserData?.email || '',
                    },
                },
            });

            if (error) {
                console.error('Payment failed:', error);
                toast.error(`Payment failed: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded:', paymentIntent);
                
                // Save payment record to user account
                try {
                    const localUserData = getUserData();
                    if (localUserData && (localUserData.id || localUserData._id)) {
                        // Calculate smart expiry date based on current subscription status and selected subscription duration
                        const subscriptionDuration = selectedSubscription?.subscriptionDuration || 30; // Default to 30 days if no subscription selected
                        const newExpiryDate = calculateNewExpiryDate(userData, new Date(), subscriptionDuration);
                        
                        const paymentData = {
                            userId: localUserData.id || localUserData._id,
                            paymentId: paymentIntent.id,
                            amount: paymentAmount,
                            currency: currency,
                            status: 'succeeded',
                            subscriptionId: selectedSubscription?.subscriptionId || null,
                            subscriptionName: selectedSubscription?.subscriptionName || null,
                            subscriptionPrice: selectedSubscription?.subscriptionPrice || null,
                            subscriptionDuration: selectedSubscription?.subscriptionDuration || null,
                            subscriptionStatus: 'active',
                            subscriptionExpiry: newExpiryDate.toISOString()
                        };

                        const paymentResponse = await postRequest('/api/users/payments', paymentData);

                        if (paymentResponse && paymentResponse.user) {
                            // If we have a selected subscription, activate it now
                            if (selectedSubscription?.subscriptionId) {
                                try {
                                    const updateResponse = await postRequest('/api/subscription-selection', {
                                        userId: localUserData.id || localUserData._id,
                                        subscriptionData: selectedSubscription
                                    });
                                    
                                    if (updateResponse.success) {
                                        toast.success('Payment successful! Your subscription has been activated and payment recorded.');
                                        // Clear the selected subscription since it's now activated
                                        setSelectedSubscription(null);
                                    } else {
                                        toast.success('Payment successful! Your subscription has been activated.');
                                    }
                                } catch (updateError) {
                                    console.error('Error updating subscription:', updateError);
                                    toast.success('Payment successful! Your subscription has been activated.');
                                }
                            } else {
                                toast.success('Payment successful! Your subscription has been activated and payment recorded.');
                            }
                            
                            // Refresh payment data
                            fetchUserPayments();
                        } else {
                            toast.success('Payment successful! Your subscription has been activated.');
                            console.warn('Failed to record payment in user account');
                        }
                    } else {
                        toast.success('Payment successful! Your subscription has been activated.');
                        console.warn('User data not found, payment not recorded');
                    }
                } catch (recordError) {
                    console.error('Error recording payment:', recordError);
                    toast.success('Payment successful! Your subscription has been activated.');
                }

                // After successful payment, create Stripe customer and save payment method
                try {
                    const localUserData = getUserData();
                    const userId = localUserData?.id || localUserData?._id;
                    if (userId) {
                        console.log('Creating Stripe customer for user:', userId);
                        
                        // First, create or get Stripe customer
                        const customerResponse = await fetch('/api/create-setup-intent', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                userId: userId,
                                email: localUserData.email,
                                name: `${localUserData.firstName} ${localUserData.lastName}`,
                                metadata: { 
                                    purpose: 'subscription_autorenew',
                                    user_id: userId 
                                } 
                            })
                        });
                        const customerData = await customerResponse.json();
                        
                        if (customerData?.customerId) {
                            console.log('Stripe customer created:', customerData.customerId);
                            
                            // Save the Stripe customer ID to user record
                            await postRequest('/api/users', {
                                id: userId,
                                stripeCustomerId: customerData.customerId
                            });
                            
                            // Now create setup intent for saving payment method
                            const setupIntentRes = await fetch('/api/create-setup-intent', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                    customerId: customerData.customerId, 
                                    metadata: { purpose: 'subscription_autorenew' } 
                                })
                            });
                            const setupIntentData = await setupIntentRes.json();
                            
                            if (setupIntentData?.clientSecret) {
                                const { error: setupErr, setupIntent } = await stripe.confirmCardSetup(setupIntentData.clientSecret, {
                                    payment_method: {
                                        card: elements.getElement(CardElement),
                                        billing_details: { 
                                            name: userFullName, // Use actual user name from database
                                            email: localUserData?.email || ''
                                        }
                                    }
                                });
                                
                                if (!setupErr && setupIntent?.payment_method) {
                                    // Save payment method to user
                                    await postRequest('/api/users/payment-method', {
                                        userId,
                                        stripeCustomerId: customerData.customerId,
                                        paymentMethodId: setupIntent.payment_method,
                                        makeDefault: true
                                    });
                                    console.log('Payment method saved for user:', userId);
                                    toast.success('Card saved for future automatic renewals.', {
                                        duration: 3000,
                                        position: 'top-center',
                                    });
                                    
                                    // Redirect to profile page after a short delay
                                    setTimeout(() => {
                                        window.location.href = '/profile';
                                    }, 2000);
                                }
                            }
                        } else {
                            console.error('Failed to create Stripe customer:', customerData);
                        }
                    }
                } catch (setupError) {
                    console.error('Error saving card for future use:', setupError);
                }
            }
        } catch (err) {
            console.error('Payment error:', err);
            toast.error('An error occurred during payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handlePayment}>
            <div>
                <label className="block text-sm font-medium text-brand mb-1">Cardholder Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    onFocus={() => setFlipped(false)}
                    className="w-full border border-[color:var(--primary)] rounded px-3 py-2 text-sm focus:outline-none"
                    placeholder={userData ? `${userData.firstName} ${userData.lastName}`.toUpperCase() : "JOHN DOE"}
                    autoComplete="cc-name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-brand mb-1">Card Details</label>
                <div className="border border-[color:var(--primary)] rounded px-3 py-2">
                    <CardElement
                        options={{
                            hidePostalCode: true,
                            style: {
                                base: {
                                    fontSize: '14px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                        onFocus={() => setFlipped(false)}
                        onBlur={() => setFlipped(false)}
                        onChange={(event) => {
                            setCardComplete(event.complete);
                        }}
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={
                    isProcessing ||
                    !stripe ||
                    // require card details when no plan selected (to open modal) OR when starting trial/payment
                    (
                        (!selectedSubscription && (!name.trim() || !cardComplete)) ||
                        (selectedSubscription && (!name.trim() || !cardComplete))
                    )
                }
                className={`px-4 py-2 rounded bg-[color:var(--primary)] !text-white font-medium ${
                    isProcessing || !stripe || (!name.trim() || !cardComplete) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isProcessing
                    ? 'Processing...'
                    : selectedSubscription
                        ? (isFirstPayment ? 'Start 60-day Free Trial' : `Pay €${selectedSubscription.subscriptionPrice}`)
                        : 'Select Subscription'}
            </button>
        </form>
    );
}

export default function Subscription() {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [flipped, setFlipped] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [userPayments, setUserPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [subscriptionInfo, setSubscriptionInfo] = useState(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const numberRef = useRef(null);
    const expiryRef = useRef(null);
    const cvcRef = useRef(null);

    // Fetch user payment data and subscription info
    const fetchUserPayments = async () => {
        try {
            const localUserData = getUserData();
            if (localUserData && (localUserData.id || localUserData._id)) {
                const userId = localUserData.id || localUserData._id;
                const response = await getRequest(`/api/users?id=${userId}`);
                if (response && response.user) {
                    const user = response.user;
                    setUserData(user);
                    setUserPayments(user.payments || []);
                    
                    // Auto-check subscription status for expired subscriptions
                    const autoStatus = autoCheckSubscriptionStatus(user);
                    if (autoStatus && autoStatus.needsUpdate) {
                        console.log('Subscription status needs update:', autoStatus);
                        // Optionally show a notification about status change
                        if (autoStatus.isExpired) {
                            toast.warning(`Your subscription has expired ${autoStatus.daysOverdue} days ago. Please renew to continue.`);
                        }
                    }
                    
                    // Calculate subscription info with selected subscription
                    const subInfo = getSubscriptionDisplayInfo(user, selectedSubscription);
                    setSubscriptionInfo(subInfo);
                    
                    // Show renewal prompt if needed
                    if (shouldShowRenewalPrompt(user)) {
                        if (subInfo.isExpired) {
                            toast.error(`Your subscription expired ${subInfo.daysOverdue} days ago. Please renew to continue.`);
                        } else if (subInfo.daysRemaining <= 3) {
                            toast.warning(`Your subscription expires in ${subInfo.daysRemaining} days. Consider renewing now.`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user payments:', error);
            // toast.error('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user payments on component mount
    useEffect(() => {
        fetchUserPayments();
    }, []);

    // Recalculate subscription info when selected subscription changes
    useEffect(() => {
        if (userData && selectedSubscription) {
            const subInfo = getSubscriptionDisplayInfo(userData, selectedSubscription);
            setSubscriptionInfo(subInfo);
        }
    }, [selectedSubscription, userData]);

    // Pre-populate cardholder name with user's actual name (only once)
    useEffect(() => {
        if (userData && !name) {
            const userFullName = `${userData.firstName} ${userData.lastName}`.trim().toUpperCase();
            setName(userFullName);
        }
    }, [userData]); // Removed 'name' from dependencies to prevent re-setting

    // Auto-detect expiry and auto-renew on this page as well (in addition to global manager)
    useEffect(() => {
        if (!userData) return;
        
        try {
            if (userData.accountType === 'seller' && userData.autoRenewalEnabled && userData.stripeCustomerId && userData.defaultPaymentMethodId) {
                const status = autoCheckSubscriptionStatus(userData);
                if (status?.isExpired) {
                    const userId = userData.id || userData._id;
                    if (userId) {
                        console.log('Auto-renewal triggered for expired subscription');
                        postRequest('/api/charge-saved-subscription', { userId })
                            .then((res) => {
                                if (res?.success) {
                                    toast.success('Subscription renewed automatically.');
                                    fetchUserPayments();
                                }
                            })
                            .catch(() => {});
                    }
                }
            }
        } catch (e) {
            console.error('Auto-renew on subscription page error:', e);
        }
    }, [userData]);

    // Initialize Stripe
    useEffect(() => {
        const initializeStripe = async () => {
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            setStripePromise(stripeInstance);
            console.log('Stripe initialized:', stripeInstance ? 'Success' : 'Failed');
        };
        initializeStripe();
    }, []);

    // Input masks
    useEffect(() => {
        if (!numberRef.current) return;
        const mask = IMask(numberRef.current, {
            mask: [
                { mask: "0000 000000 00000", regex: "^3[47]\\d{0,13}", cardtype: "amex" },
                { mask: "0000 0000 0000 0000", regex: "^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}", cardtype: "discover" },
                { mask: "0000 000000 0000", regex: "^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}", cardtype: "diners" },
                { mask: "0000 0000 0000 0000", regex: "^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}", cardtype: "mastercard" },
                { mask: "0000 000000 00000", regex: "^(?:2131|1800)\\d{0,11}", cardtype: "jcb15" },
                { mask: "0000 0000 0000 0000", regex: "^(?:35\\d{0,2})\\d{0,12}", cardtype: "jcb" },
                { mask: "0000 0000 0000 0000", regex: "^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}", cardtype: "maestro" },
                { mask: "0000 0000 0000 0000", regex: "^4\\d{0,15}", cardtype: "visa" },
                { mask: "0000 0000 0000 0000", regex: "^62\\d{0,14}", cardtype: "unionpay" },
                { mask: "0000 0000 0000 0000", cardtype: "unknown" },
            ],
            dispatch: (appended, dynamicMasked) => {
                const nmbr = (dynamicMasked.value + appended).replace(/\D/g, "");
                for (let i = 0; i < dynamicMasked.compiledMasks.length; i++) {
                    const re = new RegExp(dynamicMasked.compiledMasks[i].regex);
                    if (re.test(nmbr)) return dynamicMasked.compiledMasks[i];
                }
                return dynamicMasked.compiledMasks[dynamicMasked.compiledMasks.length - 1];
            },
        });
        mask.on("accept", () => setNumber(mask.value));
        return () => mask.destroy();
    }, []);

    useEffect(() => {
        if (!expiryRef.current) return;
        const mask = IMask(expiryRef.current, {
            mask: "MM{/}YY",
            blocks: {
                YY: { mask: IMask.MaskedRange, from: 0, to: 99 },
                MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
            },
        });
        mask.on("accept", () => setExpiry(mask.value));
        return () => mask.destroy();
    }, []);

    useEffect(() => {
        if (!cvcRef.current) return;
        const mask = IMask(cvcRef.current, { mask: "0000" });
        mask.on("accept", () => setCvc(mask.value));
        return () => mask.destroy();
    }, []);

    const formattedName = useMemo(() => (name.trim() ? name : "MATTHEW EHORN"), [name]);
    const formattedNumber = useMemo(() => (number || "0123 4567 8910 1112"), [number]);
    const formattedExpiry = useMemo(() => (expiry || "01/23"), [expiry]);
    const formattedCvc = useMemo(() => (cvc || "985"), [cvc]);

    // Format payment data for display
    const formatPaymentData = (payments) => {
        return payments.map(payment => {
            const date = new Date(payment.date);
            return {
                month: date.toLocaleString('default', { month: 'long' }),
                year: date.getFullYear(),
                price: payment.amount,
                status: payment.status === 'succeeded' ? 'Paid' : 'Pending',
                date: payment.date,
                paymentId: payment.paymentId,
                currency: payment.currency
            };
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
    };

    // Handle subscription selection
    const handleSubscriptionSelected = async (subscriptionData) => {
        try {
            console.log('Subscription selected:', subscriptionData);
            console.log('User data:', userData);
            
            if (!userData || (!userData.id && !userData._id)) {
                console.error('User data not available');
                toast.error('User data not available. Please refresh the page.');
                return;
            }
            
            // Only store the selected subscription locally, don't activate it yet
            setSelectedSubscription(subscriptionData);
            setShowSubscriptionModal(false);
            
            toast.success('Subscription plan selected! Please add your card details and click Start Free Trial.');
        } catch (error) {
            console.error('Error selecting subscription:', error);
            toast.error('Failed to select subscription');
        }
    };


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-brand">Subscription</h2>
            
            {/* First-time user message */}
            {subscriptionInfo && !subscriptionInfo.expiryDate && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Welcome! Select Your Subscription Plan
                            </h3>
                        </div>
                    </div>
                    <div className="text-sm text-blue-700">
                        <p>You don't have an active subscription yet. Please add your card details below and select a subscription plan to get started.</p>
                    </div>
                </div>
            )}
            
            {/* Subscription Status Dashboard - Only show if user has existing subscription */}
            {subscriptionInfo && subscriptionInfo.expiryDate && (
                <div className="bg-white rounded-lg border border-[color:var(--primary)]/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-brand">Subscription Status</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            subscriptionInfo.status === SUBSCRIPTION_STATES.ACTIVE 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {subscriptionInfo.status === SUBSCRIPTION_STATES.ACTIVE ? 'Active' : 'Expired'}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Status Message</p>
                            <p className="font-medium text-brand">{subscriptionInfo.message}</p>
                        </div>
                        
                        {subscriptionInfo.status === SUBSCRIPTION_STATES.ACTIVE ? (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                                <p className="font-medium text-green-600">{subscriptionInfo.daysRemaining} days</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Days Overdue</p>
                                <p className="font-medium text-red-600">{subscriptionInfo.daysOverdue} days</p>
                            </div>
                        )}
                        
                        {subscriptionInfo.expiryDate && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                                <p className="font-medium text-brand">{formatDate(subscriptionInfo.expiryDate)}</p>
                            </div>
                        )}
                        
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Next Payment</p>
                            <p className="font-medium text-brand">
                                {selectedSubscription?.subscriptionPrice 
                                    ? `€${selectedSubscription.subscriptionPrice}` 
                                    : subscriptionInfo.formattedAmount
                                }
                            </p>
                        </div>
                    </div>
                    
                    {subscriptionInfo.paymentDescription && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">{subscriptionInfo.paymentDescription}</p>
                        </div>
                    )}

                    {/* Subscription Controls */}
                    <div className="mt-4 flex gap-3 flex-wrap">
                        <button
                            onClick={() => setShowSubscriptionModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                            Select Subscription Plan
                        </button>
                        {selectedSubscription && (
                            <button
                                onClick={() => setShowSubscriptionModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                            >
                                Change Plan
                            </button>
                        )}
                        {userData?.accountType === 'seller' && (
                            <>
                                {userData?.autoRenewalEnabled ? (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const userId = userData.id || userData._id;
                                                await putRequest(`/api/users?id=${userId}`, { autoRenewalEnabled: false });
                                                toast.success('Auto-renew disabled. Subscription remains active until expiry.');
                                                fetchUserPayments();
                                            } catch (e) {
                                                toast.error('Failed to update auto-renew settings');
                                            }
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                                    >
                                        Unsubscribe (Stop Auto-renew)
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const userId = userData.id || userData._id;
                                                await putRequest(`/api/users?id=${userId}`, { autoRenewalEnabled: true });
                                                toast.success('Auto-renew enabled. Your subscription will automatically renew.');
                                                fetchUserPayments();
                                            } catch (e) {
                                                toast.error('Failed to update auto-renew settings');
                                            }
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                                    >
                                        Subscribe (Auto-renew)
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    {/* Selected Subscription Display */}
                    {selectedSubscription && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3">Selected Subscription Plan:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700">Plan Name:</span>
                                    <span className="font-medium text-green-800">{selectedSubscription.subscriptionName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Amount:</span>
                                    <span className="font-medium text-green-800">€{selectedSubscription.subscriptionPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Duration:</span>
                                    <span className="font-medium text-green-800">{selectedSubscription.subscriptionDuration} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Expires:</span>
                                    <span className="font-medium text-green-800">
                                        {new Date(selectedSubscription.subscriptionExpiry).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Special Offer Details */}
                            {selectedSubscription.specialOffer && (
                                <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                                    <h5 className="font-semibold text-green-800 mb-2">Special Offer Applied:</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Offer:</span>
                                            <span className="font-medium text-green-800">{selectedSubscription.specialOffer.months} months at {selectedSubscription.specialOffer.discountPercent}% off</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Original Price:</span>
                                            <span className="font-medium text-green-800">€{selectedSubscription.specialOffer.originalPrice}/month</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Discounted Price:</span>
                                            <span className="font-medium text-green-800">€{selectedSubscription.specialOffer.discountedPrice}/month</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Total Savings:</span>
                                            <span className="font-medium text-green-800">€{selectedSubscription.specialOffer.savings}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Card Preview (hidden when subscription active or when no existing subscription) */}
                {subscriptionInfo?.status !== SUBSCRIPTION_STATES.ACTIVE && (
                    <div className="relative h-56 w-[360px] sm:w-[400px] mx-auto [perspective:1000px]">
                        <div
                            className={`creditcard relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 [backface-visibility:hidden]">
                                <div className="flex items-center justify-between">
                                    <img
                                        src={images.chip}
                                        alt="chip"
                                        className="h-6 w-8 object-contain"
                                    />
                                    <span className="text-2xl font-bold">VISA</span>
                                </div>
                                <div className="mt-6 text-sm opacity-80">card number</div>
                                <div id="svgnumber" className="text-2xl tracking-[0.2em] font-semibold mt-1">
                                    {formattedNumber}
                                </div>
                                <div className="flex items-end justify-between mt-6">
                                    <div>
                                        <div className="text-xs opacity-80">cardholder name</div>
                                        <div id="svgname" className="font-semibold">
                                            {formattedName}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs opacity-80">expiration</div>
                                        <div id="svgexpire" className="font-semibold">
                                            {formattedExpiry}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Back */}
                            <div className="absolute inset-0 rounded-2xl shadow-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                <div className="h-10 -mx-6 bg-black/70" />
                                <div className="mt-6">
                                    <div className="text-xs opacity-80">Security Code</div>
                                    <div className="bg-white text-black rounded px-3 py-2 w-28 mt-1 text-right">
                                        <span id="svgsecurity">{formattedCvc}</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-6 text-2xl font-bold">VISA</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stripe Elements Form (hidden when subscription active) */}
                {stripePromise && subscriptionInfo?.status !== SUBSCRIPTION_STATES.ACTIVE && (
                    <Elements stripe={stripePromise}>
                        <PaymentForm 
                            name={name} 
                            setName={setName} 
                            flipped={flipped} 
                            setFlipped={setFlipped}
                            subscriptionInfo={subscriptionInfo}
                            userData={userData}
                            selectedSubscription={selectedSubscription}
                            onShowSubscriptionModal={() => setShowSubscriptionModal(true)}
                            setSelectedSubscription={setSelectedSubscription}
                            isFirstPayment={userPayments.length === 0}
                            fetchUserPayments={fetchUserPayments}
                        />
                    </Elements>
                )}
                {subscriptionInfo?.status === SUBSCRIPTION_STATES.ACTIVE && (
                    <div className="text-sm text-green-700">
                        Your subscription is active. You can manage renewal below.
                    </div>
                )}
            </div>

            {/* Payment History Table */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-brand mb-4">Payment History</h3>
                <div className="rounded border border-[color:var(--primary)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[color:var(--primary)]/10 text-brand">
                                <tr>
                                    <th className="px-4 py-2 border-b text-left text-brand/80 font-medium">Month</th>
                                    <th className="px-4 py-2 border-b text-left text-brand/80 font-medium">Year</th>
                                    <th className="px-4 py-2 border-b text-left text-brand/80 font-medium">Price</th>
                                    <th className="px-4 py-2 border-b text-left text-brand/80 font-medium">Status</th>
                                    <th className="px-4 py-2 border-b text-left text-brand/80 font-medium">Payment ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            Loading payment history...
                                        </td>
                                    </tr>
                                ) : userPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                            No payment history found
                                        </td>
                                    </tr>
                                ) : (
                                    formatPaymentData(userPayments).map((payment, idx) => (
                                        <tr key={payment.paymentId} className="border-t border-[color:var(--primary)]/20">
                                            <td className="px-4 py-3 whitespace-nowrap">{payment.month}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{payment.year}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {payment.currency === 'eur' ? '€' : '$'}{(payment.price / 100).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    payment.status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                                {payment.paymentId}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* Subscription Selection Modal */}
            <SubscriptionSelectionModal
                visible={showSubscriptionModal}
                onCancel={() => setShowSubscriptionModal(false)}
                onSubscriptionSelected={handleSubscriptionSelected}
                userData={userData}
            />
        </div>
    );
}

