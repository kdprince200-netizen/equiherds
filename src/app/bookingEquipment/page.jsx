"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Button, Card, Row, Col, InputNumber, Input, Select, App, Spin, Alert } from "antd";
import dayjs from "dayjs";
import TopSection from "../components/topSection";
import BookingPaymentModal from "../components/BookingPaymentModal";
import { postRequest, getRequest } from "@/service";
import { getUserData } from "../utils/localStorage";
import countriesData from "../utils/countery.json";

// Component that uses useSearchParams
function BookingEquipmentContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notification } = App.useApp();

  // Check authentication on component mount
  useEffect(() => {
    const userData = getUserData();
    if (!userData || !userData.id) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please login to make a booking',
        placement: 'topRight',
      });
      router.push('/login');
      return;
    }
    setAuthChecked(true);
  }, [router, notification]);

  // Fetch equipment data and set selected equipment
  useEffect(() => {
    const fetchEquipmentData = async () => {
      if (searchParams) {
        const equipmentId = searchParams.get('equipmentId');
        if (equipmentId) {
          try {
            setLoading(true);
            const response = await getRequest(`/api/equipments/${equipmentId}`);
            
            if (response && response._id) {
              // Normalize the API response data
              const normalizedData = {
                equipmentId: response._id,
                productName: response.productName || "Untitled Equipment",
                details: response.details || "",
                price: Number(response.price) || 0,
                discount: Number(response.discount) || 0,
                deliveryCharges: Number(response.deliveryCharges) || 0,
                noOfDaysDelivery: Number(response.noOfDaysDelivery) || 0,
                photos: Array.isArray(response.photos) && response.photos.length > 0 ? response.photos : ["/product/1.jpg"],
                mainCategory: response.mainCategory || "",
                subcategory: response.subcategory || "",
                subSubcategory: response.subSubcategory || "",
                userId: response.userId || null,
                ownerName: response.userId ? `${response.userId.firstName || ''} ${response.userId.lastName || ''}`.trim() : '',
                ownerEmail: response.userId?.email || '',
                status: response.status || "active",
              };

              setSelectedEquipment(normalizedData);
            } else {
              notification.error({
                message: 'Equipment Not Found',
                description: 'The requested equipment could not be found',
                placement: 'topRight',
              });
            }
          } catch (error) {
            console.error('Error fetching equipment data:', error);
            notification.error({
              message: 'Error Loading Equipment',
              description: 'Failed to load equipment information',
              placement: 'topRight',
            });
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchEquipmentData();
  }, [searchParams, notification]);

  // Calculate final price with discount
  const calculateFinalPrice = (price, discount) => {
    if (!price) return 0;
    const p = Number(price);
    const d = Number(discount) || 0;
    return p - (p * d) / 100;
  };

  // Calculate total price
  const getTotalPrice = () => {
    if (!selectedEquipment) return 0;
    
    const unitPrice = calculateFinalPrice(selectedEquipment.price, selectedEquipment.discount);
    const subtotal = unitPrice * quantity;
    const delivery = selectedEquipment.deliveryCharges || 0;
    
    return subtotal + delivery;
  };

  // Handle form submission - show payment modal
  const handleSubmit = async (values) => {
    // Validate required fields
    if (!quantity || quantity < 1) {
      notification.error({
        message: 'Validation Error',
        description: 'Please enter a valid quantity (at least 1)',
        placement: 'topRight',
      });
      return;
    }

    // Check user authentication
    const userData = getUserData();
    if (!userData.id) {
      notification.error({
        message: 'Authentication Required',
        description: 'Please login to make a booking',
        placement: 'topRight',
      });
      return;
    }

    try {
      const unitPrice = calculateFinalPrice(selectedEquipment.price, selectedEquipment.discount);
      const subtotal = unitPrice * quantity;
      const deliveryCharges = selectedEquipment.deliveryCharges || 0;
      const totalPrice = subtotal + deliveryCharges;

      // Get form values for address, zipCode, country, and description
      const formValues = form.getFieldsValue();
      
      // Set booking date to today's date automatically
      const bookingDate = dayjs().format('YYYY-MM-DD');
      
      const bookingPayload = {
        equipmentId: selectedEquipment.equipmentId,
        equipmentName: selectedEquipment.productName,
        customerId: userData.id,
        sellerId: selectedEquipment.userId?._id || selectedEquipment.userId,
        quantity: quantity,
        bookingDate: bookingDate,
        unitPrice: unitPrice,
        discount: selectedEquipment.discount || 0,
        deliveryCharges: deliveryCharges,
        totalPrice: totalPrice,
        bookingStatus: 'pending', // Always pending - no amount detection
        address: formValues.address || "",
        zipCode: formValues.zipCode || "",
        country: formValues.country || "",
        description: formValues.description || ""
      };
      
      console.log('Preparing booking data for payment:', bookingPayload);
      
      // Set booking data and show payment modal
      setBookingData(bookingPayload);
      setPaymentModalVisible(true);
      
    } catch (error) {
      console.error('Error preparing booking:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to prepare booking data',
        placement: 'topRight',
      });
    }
  };

  // Handle successful booking after payment
  const handleBookingSuccess = (bookingResponse, paymentIntent) => {
    notification.success({
      message: 'Booking Successful',
      description: 'Your booking has been confirmed and payment processed!',
      placement: 'topRight',
    });
    
    // Reset form
    form.resetFields();
    setQuantity(1);
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <TopSection title="Market Place" />
      
      <section className="mx-auto max-w-6xl px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
            <span className="ml-3">Loading equipment...</span>
          </div>
        ) : selectedEquipment ? (
          <Row gutter={[24, 24]}>
            {/* Selected Equipment Information - 50% width */}
            <Col xs={24} lg={12}>
              <Card title="Selected Equipment" className="h-full">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    {selectedEquipment.photos && selectedEquipment.photos.length > 0 && (
                      <img 
                        src={selectedEquipment.photos[0]} 
                        alt={selectedEquipment.productName}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </Col>
                  <Col xs={24} md={16}>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-brand">{selectedEquipment.productName}</h3>
                      {selectedEquipment.details && (
                        <p className="text-gray-600 text-sm">{selectedEquipment.details}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {selectedEquipment.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            €{Number(selectedEquipment.price).toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-bold text-brand">
                          €{calculateFinalPrice(selectedEquipment.price, selectedEquipment.discount).toLocaleString()}
                        </span>
                        {selectedEquipment.discount > 0 && (
                          <span className="text-xs text-red-600 font-medium">
                            -{selectedEquipment.discount}%
                          </span>
                        )}
                      </div>
                      {selectedEquipment.deliveryCharges > 0 && (
                        <p className="text-sm text-gray-600">
                          Delivery: €{Number(selectedEquipment.deliveryCharges).toLocaleString()}
                        </p>
                      )}
                      {selectedEquipment.noOfDaysDelivery > 0 && (
                        <p className="text-sm text-gray-600">
                          Delivery Time: {selectedEquipment.noOfDaysDelivery} day{selectedEquipment.noOfDaysDelivery !== 1 ? 's' : ''}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Category: {selectedEquipment.subSubcategory || selectedEquipment.subcategory || selectedEquipment.mainCategory}
                      </p>
                      {selectedEquipment.ownerName && (
                        <p className="text-sm text-gray-500">
                          Seller: {selectedEquipment.ownerName}
                          {selectedEquipment.ownerEmail && ` (${selectedEquipment.ownerEmail})`}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Booking Information - 50% width */}
            <Col xs={24} lg={12}>
              <Card title="Booking Information">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                >
                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                    initialValue={1}
                  >
                    <InputNumber
                      size="large"
                      min={1}
                      max={1000}
                      value={quantity}
                      onChange={(value) => setQuantity(value || 1)}
                      className="w-full"
                      placeholder="Enter quantity"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    name="address"
                  >
                    <Input
                      size="large"
                      placeholder="Enter delivery address"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Zip Code"
                    name="zipCode"
                  >
                    <Input
                      size="large"
                      placeholder="Enter zip/postal code"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Country"
                    name="country"
                  >
                    <Select
                      size="large"
                      showSearch
                      placeholder="Select country"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={countriesData.map((country) => ({
                        value: country.name,
                        label: country.name
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Description"
                    name="description"
                  >
                    <Input.TextArea
                      size="large"
                      rows={4}
                      placeholder="Enter any additional notes or description"
                    />
                  </Form.Item>

                  {/* Price Display */}
                  {quantity > 0 && (
                    <div className="mb-4 p-4 bg-brand/5 rounded-lg border border-brand/20">
                      <h4 className="font-semibold text-gray-800 mb-2">Booking Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="font-medium">
                            €{calculateFinalPrice(selectedEquipment.price, selectedEquipment.discount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium">
                            €{(calculateFinalPrice(selectedEquipment.price, selectedEquipment.discount) * quantity).toLocaleString()}
                          </span>
                        </div>
                        {selectedEquipment.deliveryCharges > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Charges:</span>
                            <span className="font-medium">
                              €{Number(selectedEquipment.deliveryCharges).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Total Price:</span>
                            <span className="text-xl font-bold text-brand">€{getTotalPrice().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full"
                      disabled={!quantity || quantity < 1}
                    >
                      Save Card & Create Booking
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        ) : (
          <Alert
            message="Equipment Not Found"
            description="The equipment you are looking for could not be found. Please check the URL and try again."
            type="error"
            showIcon
          />
        )}
      </section>
      
      {/* Payment Modal */}
      <BookingPaymentModal
        visible={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        bookingData={bookingData}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

// Main export function with Suspense boundary
export default function BookingEquipmentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BookingEquipmentContent />
    </Suspense>
  );
}
