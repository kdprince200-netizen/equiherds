"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Spin, Alert, Divider, Card, Row, Col, Tag } from "antd";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from "react-hot-toast";
import { postRequest } from "../../service/index";
import { getUserData } from "../utils/localStorage";
import SubscriptionSelectionModal from "./SubscriptionSelectionModal";
import { getSubscriptionDisplayInfo, calculateSubscriptionExpiry, getSubscriptionStatus } from "../utils/subscriptionUtils";

// Stripe Elements Payment Form Component
function PaymentForm({ 
  name, 
  setName, 
  bookingData, 
  onPaymentSuccess, 
  onPaymentError,
  isProcessing,
  setIsProcessing 
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      console.error('Stripe not initialized');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }

    setIsProcessing(true);
    console.log('Starting booking payment process...');

    try {
      // Create setup intent to save card without charging
      const response = await fetch('/api/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: bookingData.customerId || bookingData.clientId, // Use customerId or clientId as customer ID
          metadata: {
            equipmentId: bookingData.equipmentId,
            stableId: bookingData.stableId,
            trainerId: bookingData.trainerId,
            serviceId: bookingData.serviceId,
            bookingType: bookingData.bookingType,
            numberOfDays: bookingData.numberOfDays,
            clientId: bookingData.clientId || bookingData.customerId
          }
        }),
      });

      const { clientSecret, setupIntentId } = await response.json();
      console.log('Setup intent created:', setupIntentId);
      console.log('Saving card for future payment');

      // Get the card element
      const cardElement = elements.getElement(CardElement);

      // Confirm setup intent to save the payment method
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
          },
        },
      });

      if (error) {
        console.error('Card setup failed:', error);
        toast.error(`Card setup failed: ${error.message}`);
        onPaymentError(error);
      } else if (setupIntent.status === 'succeeded') {
        console.log('Card setup succeeded:', setupIntent);
        console.log('Payment method saved:', setupIntent.payment_method);
        
        // Create the booking with pending status (no payment charged yet)
        try {
          const bookingPayload = {
            ...bookingData,
            paymentId: setupIntent.payment_method, // Store the saved payment method ID
            bookingStatus: 'pending', // Always pending until payment is charged later
          };

          console.log('Creating booking with payment info:', bookingPayload);
          
          // Determine which API endpoint to use based on booking type
          let apiEndpoint;
          if (bookingData.equipmentId) {
            apiEndpoint = '/api/bookingEquipments';
          } else if (bookingData.trainerId) {
            apiEndpoint = '/api/bookingTrainers';
          } else if (bookingData.serviceId) {
            apiEndpoint = '/api/bookingOtherServices';
          } else {
            apiEndpoint = '/api/bookingStables';
          }
          const bookingResponse = await postRequest(apiEndpoint, bookingPayload);

          if (bookingResponse.success) {
            // Booking created successfully with saved payment method
            toast.success('Card saved successfully! Your booking has been created and will be charged later.');
            onPaymentSuccess(bookingResponse, setupIntent);
          } else {
            // Booking failed
            toast.error('Card saved but booking failed. Please contact support.');
            onPaymentError(new Error('Booking creation failed after card setup'));
          }
        } catch (bookingError) {
          console.error('Error creating booking:', bookingError);
          toast.error('Card saved but booking failed. Please contact support.');
          onPaymentError(bookingError);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('An error occurred during payment. Please try again.');
      onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handlePayment}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
        <Input
          size="large"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="JOHN DOE"
          autoComplete="cc-name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
        <div className="border border-gray-300 rounded-lg px-3 py-2">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
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
          />
        </div>
      </div>
      
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={isProcessing}
        disabled={isProcessing || !stripe}
        className="w-full"
        style={{ 
          backgroundColor: '#1890ff',
          borderColor: '#1890ff',
          height: '48px',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        {isProcessing ? 'Saving Card...' : 'Save Card'}
      </Button>
    </form>
  );
}

export default function BookingPaymentModal({ 
  visible, 
  onCancel, 
  bookingData, 
  onBookingSuccess 
}) {
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  // Initialize Stripe and load user data
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripeInstance);
    };
    initializeStripe();

    // Load user data and subscription info
    const user = getUserData();
    if (user) {
      setUserData(user);
      const subInfo = getSubscriptionDisplayInfo(user);
      setSubscriptionInfo(subInfo);
    }
  }, []);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setName("");
      setIsProcessing(false);
    }
  }, [visible]);

  const handlePaymentSuccess = (bookingResponse, paymentIntent) => {
    onBookingSuccess(bookingResponse, paymentIntent);
    onCancel();
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Error handling is done in the form component
  };

  const handleSubscriptionSelected = async (subscriptionData) => {
    try {
      setSelectedSubscription(subscriptionData);
      setShowSubscriptionModal(false);
      
      // Update user with subscription data
      const response = await postRequest('/api/subscription-selection', {
        userId: userData.id,
        subscriptionData: subscriptionData
      });

      if (response.success) {
        toast.success('Subscription selected successfully!');
        // Update local user data
        const updatedUser = { ...userData, ...response.subscriptionData };
        setUserData(updatedUser);
        const subInfo = getSubscriptionDisplayInfo(updatedUser);
        setSubscriptionInfo(subInfo);
      } else {
        toast.error('Failed to select subscription');
      }
    } catch (error) {
      console.error('Error selecting subscription:', error);
      toast.error('Failed to select subscription');
    }
  };

  const formatBookingSummary = () => {
    if (!bookingData) return null;
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
        <div className="space-y-2 text-sm">
          {bookingData.equipmentId ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment:</span>
                <span className="font-medium">{bookingData.equipmentName || 'Selected Equipment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{bookingData.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span className="font-medium">{bookingData.bookingDate}</span>
              </div>
              {bookingData.deliveryCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charges:</span>
                  <span className="font-medium">€{bookingData.deliveryCharges.toFixed(2)}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">{bookingData.trainerId ? 'Trainer:' : bookingData.serviceId ? 'Service:' : 'Stable:'}</span>
                <span className="font-medium">{bookingData.trainerTitle || bookingData.serviceTitle || bookingData.stableTitle || 'Selected Service'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Type:</span>
                <span className="font-medium capitalize">{bookingData.bookingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{bookingData.numberOfDays || bookingData.numberOfHours} {bookingData.numberOfDays ? 'days' : 'hours'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{bookingData.startDate === bookingData.endDate ? 'Date:' : 'Date Range:'}</span>
                <span className="font-medium">
                  {bookingData.startDate === bookingData.endDate ? 
                    bookingData.startDate : 
                    `${bookingData.startDate} - ${bookingData.endDate}`
                  }
                </span>
              </div>
              {bookingData.numberOfHorses && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Horses:</span>
                  <span className="font-medium">{bookingData.numberOfHorses}</span>
                </div>
              )}
              {bookingData.additionalServiceCosts > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Services:</span>
                  <span className="font-medium">€{bookingData.additionalServiceCosts.toFixed(2)}</span>
                </div>
              )}
            </>
          )}
          <Divider className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span className="text-green-600">€{bookingData.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={`Save Card for ${bookingData?.equipmentId ? 'Equipment' : bookingData?.trainerId ? 'Training' : bookingData?.serviceId ? 'Other Service' : 'Stable'} Booking`}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={700}
        centered
        maskClosable={false}
        closable={!isProcessing}
      >
        <div className="space-y-6">
          {formatBookingSummary()}
          
          {/* Subscription Status Section
          {subscriptionInfo && (
            <Card title="Subscription Status" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Tag color={subscriptionInfo.status === 'active' ? 'green' : 'red'} className="ml-2">
                      {subscriptionInfo.status === 'active' ? 'Active' : 'Expired'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="text-sm">
                    <span className="text-gray-600">Message:</span>
                    <span className="ml-2 font-medium">{subscriptionInfo.message}</span>
                  </div>
                </Col>
                {subscriptionInfo.daysRemaining > 0 && (
                  <Col span={12}>
                    <div className="text-sm">
                      <span className="text-gray-600">Days Remaining:</span>
                      <span className="ml-2 font-medium text-green-600">{subscriptionInfo.daysRemaining}</span>
                    </div>
                  </Col>
                )}
                {subscriptionInfo.daysOverdue > 0 && (
                  <Col span={12}>
                    <div className="text-sm">
                      <span className="text-gray-600">Days Overdue:</span>
                      <span className="ml-2 font-medium text-red-600">{subscriptionInfo.daysOverdue}</span>
                    </div>
                  </Col>
                )}
              </Row>
              
              {!selectedSubscription && (
                <div className="mt-4">
                  <Button 
                    type="primary" 
                    onClick={() => setShowSubscriptionModal(true)}
                    className="w-full"
                  >
                    Select Subscription Plan
                  </Button>
                </div>
              )}
              
              {selectedSubscription && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Selected Subscription:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Plan:</span>
                      <span className="font-medium text-blue-800">{selectedSubscription.subscriptionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Amount:</span>
                      <span className="font-medium text-blue-800">€{selectedSubscription.subscriptionPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Duration:</span>
                      <span className="font-medium text-blue-800">{selectedSubscription.subscriptionDuration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Expires:</span>
                      <span className="font-medium text-blue-800">
                        {new Date(selectedSubscription.subscriptionExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )} */}
          
          {/* <Alert
            message="Save Card for Future Payment"
            description="Your card will be saved securely through Stripe. No charge will be made now - payment will be processed later when the booking is confirmed."
            type="info"
            showIcon
            className="mb-4"
          /> */}
          
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <PaymentForm 
                name={name} 
                setName={setName} 
                bookingData={bookingData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </Elements>
          ) : (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
              <span className="ml-3">Loading payment form...</span>
            </div>
          )}
          
          <div className="text-center text-xs text-gray-500">
            <p>By saving your card, you agree to our terms of service.</p>
            <p>Your booking will be created with pending status and charged later.</p>
          </div>
        </div>
      </Modal>

      {/* Subscription Selection Modal */}
      <SubscriptionSelectionModal
        visible={showSubscriptionModal}
        onCancel={() => setShowSubscriptionModal(false)}
        onSubscriptionSelected={handleSubscriptionSelected}
        userData={userData}
      />
    </>
  );
}
