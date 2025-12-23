"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DatePicker, Form, Button, Card, Row, Col, TimePicker, Select, Checkbox, App, Tag, Spin, Alert } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import TopSection from "../components/topSection";
import BookingPaymentModal from "../components/BookingPaymentModal";
import { postRequest, getRequest } from "@/service";
import { getUserData } from "../utils/localStorage";

// Extend dayjs with required plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;
const { Option } = Select;

// Component that uses useSearchParams
function BookingOtherServiceContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingType, setBookingType] = useState(null); // 'hour' or 'day'
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedSingleDate, setSelectedSingleDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [selectedServices, setSelectedServices] = useState({});
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

  // Fetch service data and set selected service
  useEffect(() => {
    const fetchServiceData = async () => {
      if (searchParams) {
        const serviceId = searchParams.get('serviceId');
        if (serviceId) {
          try {
            setLoading(true);
            const response = await getRequest(`/api/otherService/${serviceId}`);
            
            if (response && response._id) {
              // Normalize the API response data
              const normalizedData = {
                serviceId: response._id,
                title: response.title || "Untitled Service",
                details: response.details || "",
                rating: response.rating || 0,
                images: Array.isArray(response.images) && response.images.length > 0 ? response.images : ["/product/3.jpg"],
                location: response.location || "",
                coordinates: response.coordinates || null,
                userId: response.userId || null,
                ownerName: response.userId ? `${response.userId.firstName || ''} ${response.userId.lastName || ''}`.trim() : '',
                ownerEmail: response.userId?.email || '',
                slots: Array.isArray(response.schedule)
                  ? response.schedule.map((sl) => ({ 
                      day: sl?.day || '', 
                      startTime: sl?.startTime || '', 
                      endTime: sl?.endTime || '' 
                    }))
                  : [],
                status: response.status || "active",
                serviceType: response.serviceType || "",
                pricePerHour: response.pricePerHour || 0,
                experience: response.experience || "",
                degree: response.degree || "",
                serviceOptions: response.serviceOptions || {},
              };

              setSelectedService(normalizedData);
            } else {
              notification.error({
                message: 'Service Not Found',
                description: 'The requested service could not be found',
                placement: 'topRight',
              });
            }
          } catch (error) {
            console.error('Error fetching service data:', error);
            notification.error({
              message: 'Error Loading Service',
              description: 'Failed to load service information',
              placement: 'topRight',
            });
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchServiceData();
  }, [searchParams, notification]);

  // Handle booking type selection
  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    setSelectedDateRange(null);
    setSelectedSingleDate(null);
    setSelectedTime(null);
  };

  // Handle date range selection (for day bookings)
  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  // Handle single date selection (for hour bookings)
  const handleSingleDateChange = (date) => {
    setSelectedSingleDate(date);
  };

  // Handle time selection
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  // Handle service selection
  const handleServiceChange = (serviceKey, checked) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceKey]: checked
    }));
  };

  // Calculate number of hours in booking
  const getNumberOfHours = () => {
    if (bookingType === 'hour' && selectedTime) {
      return 1; // Single hour booking
    } else if (bookingType === 'day' && selectedDateRange && selectedDateRange.length === 2) {
      return selectedDateRange[1].diff(selectedDateRange[0], 'day') + 1;
    }
    return 0;
  };

  // Calculate additional service costs
  const getAdditionalServiceCosts = () => {
    if (!selectedService || (!selectedDateRange && !selectedSingleDate)) return 0;
    
    const numberOfHours = getNumberOfHours();
    let totalAdditionalCost = 0;

    // Calculate costs for selected services
    Object.entries(selectedServices).forEach(([serviceKey, isSelected]) => {
      if (isSelected && selectedService.serviceOptions[serviceKey]) {
        const servicePrice = selectedService.serviceOptions[serviceKey];
        if (typeof servicePrice === 'number' && servicePrice > 0) {
          totalAdditionalCost += servicePrice * numberOfHours;
        }
      }
    });

    return totalAdditionalCost;
  };

  // Get base booking price based on booking type
  const getBaseBookingPrice = () => {
    if (!selectedService || !bookingType) return 0;
    
    const hourlyRate = selectedService.pricePerHour || 0;
    const numberOfHours = getNumberOfHours();
    
    return hourlyRate * numberOfHours;
  };

  // Get total booking price including additional services
  const getTotalBookingPrice = () => {
    const basePrice = getBaseBookingPrice();
    const additionalCosts = getAdditionalServiceCosts();
    return basePrice + additionalCosts;
  };

  // Calculate service price details
  const getServicePriceDetails = () => {
    if (!selectedService || (!selectedDateRange && !selectedSingleDate)) return {};
    
    const numberOfHours = getNumberOfHours();
    const priceDetails = {};

    // Calculate prices for selected services
    Object.entries(selectedServices).forEach(([serviceKey, isSelected]) => {
      if (isSelected && selectedService.serviceOptions[serviceKey]) {
        const servicePrice = selectedService.serviceOptions[serviceKey];
        if (typeof servicePrice === 'number' && servicePrice > 0) {
          priceDetails[serviceKey] = {
            selected: true,
            pricePerHour: servicePrice,
            totalPrice: servicePrice * numberOfHours
          };
        }
      }
    });

    return priceDetails;
  };

  // Handle form submission - show payment modal
  const handleSubmit = async (values) => {
    // Validate required fields
    const hasValidDate = (bookingType === 'hour' && selectedSingleDate && selectedTime) || 
                        (bookingType === 'day' && selectedDateRange && selectedDateRange.length === 2);
    
    if (!bookingType || !hasValidDate) {
      notification.error({
        message: 'Validation Error',
        description: 'Please select booking type, date, and time',
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
      const servicePriceDetails = getServicePriceDetails();
      
      // Determine start and end dates based on booking type
      let startDate, endDate, startTime, endTime;
      if (bookingType === 'hour' && selectedSingleDate && selectedTime) {
        // For hour bookings, start and end date are the same
        startDate = selectedSingleDate.format('YYYY-MM-DD');
        endDate = selectedSingleDate.format('YYYY-MM-DD');
        startTime = selectedTime.format('HH:mm');
        endTime = selectedTime.add(1, 'hour').format('HH:mm');
      } else if (bookingType === 'day' && selectedDateRange && selectedDateRange.length === 2) {
        startDate = selectedDateRange[0].format('YYYY-MM-DD');
        endDate = selectedDateRange[1].format('YYYY-MM-DD');
        startTime = "09:00"; // Default start time for day bookings
        endTime = "17:00"; // Default end time for day bookings
      }

      const bookingPayload = {
        clientId: userData.id,
        userId: selectedService?.userId?._id || selectedService?.userId,
        serviceId: selectedService?.serviceId,
        serviceTitle: selectedService?.title,
        serviceType: selectedService?.serviceType,
        bookingType: bookingType,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        basePrice: getBaseBookingPrice(),
        additionalServices: selectedServices,
        servicePriceDetails: servicePriceDetails,
        additionalServiceCosts: getAdditionalServiceCosts(),
        totalPrice: getTotalBookingPrice(),
        numberOfHours: getNumberOfHours(),
        bookingStatus: 'pending'
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
      description: 'Your service booking has been confirmed and payment processed!',
      placement: 'topRight',
    });
    
    // Reset form
    form.resetFields();
    setBookingType(null);
    setSelectedDateRange(null);
    setSelectedSingleDate(null);
    setSelectedTime(null);
    setSelectedServices({});
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  const serviceOptionLabels = {
    'generalHealthCheck': 'General Health Check',
    'vaccinations': 'Vaccinations',
    'emergencyCallOut': 'Emergency Call-Out',
    'lamenessExam': 'Lameness Exam',
    'ultrasoundImaging': 'Ultrasound / Imaging',
    'castration': 'Castration',
    'trimBarefoot': 'Trim (Barefoot)',
    'frontShoesOnly': 'Front Shoes Only',
    'fullSet': 'Full Set (4 Shoes)',
    'correctiveShoeing': 'Corrective / Orthopedic Shoeing',
    'basicFloat': 'Basic Float (Manual)',
    'powerFloat': 'Power Float (with sedation)',
    'wolfToothExtraction': 'Wolf Tooth Extraction',
    'fullSession': 'Full Osteopathic / Chiropractic Session',
    'massageSession': 'Massage / Myotherapy Session'
  };

  return (
    <div className="font-sans">
      <TopSection title="Booking Other Service" />
      
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Top Section: Selected Service and Service Schedule - 50% each */}
        <Row gutter={[24, 24]} className="mb-6">
          {/* Selected Service Information - 50% width */}
          <Col xs={24} lg={12}>
            {selectedService && (
              <Card title="Selected Service" className="h-full">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    {selectedService.images && selectedService.images.length > 0 && (
                      <img 
                        src={selectedService.images[0]} 
                        alt={selectedService.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </Col>
                  <Col xs={24} md={16}>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-brand">{selectedService.title}</h3>
                      {selectedService.details && (
                        <p className="text-gray-600">{selectedService.details}</p>
                      )}
                      {selectedService.experience && (
                        <p className="text-sm text-gray-500">
                          <strong>Experience:</strong> {selectedService.experience}
                        </p>
                      )}
                      {selectedService.degree && (
                        <p className="text-sm text-gray-500">
                          <strong>Degree:</strong> {selectedService.degree}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand/10 text-brand border border-brand/20">
                          €{selectedService.pricePerHour}/hour
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-brand/10 text-brand border border-brand/20">
                          {selectedService.serviceType}
                        </span>
                      </div>
                      {selectedService.ownerName && (
                        <p className="text-sm text-gray-500">
                          Provider: {selectedService.ownerName}
                          {selectedService.ownerEmail && ` (${selectedService.ownerEmail})`}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>

          {/* Service Schedule Panel - 50% width */}
          <Col xs={24} lg={12}>
            <Card title="Service Schedule" className="h-full">
              {selectedService && selectedService.slots && Array.isArray(selectedService.slots) && selectedService.slots.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Available Days & Times</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedService.slots.map((slot, index) => (
                      <Tag key={index} color="green" className="text-sm">
                        {slot.day} {slot.startTime} - {slot.endTime}
                      </Tag>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This service provider is available during the times shown above.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No schedule information available</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Bottom Section: Booking Information - 100% width */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card title="Booking Information">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                {/* Basic Booking Information - 3 columns */}
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Select Booking Type"
                      name="bookingType"
                      rules={[{ required: true, message: 'Please select booking type' }]}
                    >
                      <Select
                        size="large"
                        placeholder="Choose booking type"
                        onChange={handleBookingTypeChange}
                        value={bookingType}
                      >
                        <Option value="hour">Hour</Option>
                        <Option value="day">Day</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    {bookingType && (
                      <Form.Item
                        label={bookingType === 'hour' ? "Select Date" : "Select Date Range"}
                        name={bookingType === 'hour' ? "singleDate" : "dateRange"}
                        rules={[{ required: true, message: `Please select a ${bookingType === 'hour' ? 'date' : 'date range'}` }]}
                      >
                        {bookingType === 'hour' ? (
                          <DatePicker
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleSingleDateChange}
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            placeholder="Select Date"
                          />
                        ) : (
                          <RangePicker
                            style={{ width: '100%' }}
                            size="large"
                            onChange={handleDateRangeChange}
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            placeholder={['Start Date', 'End Date']}
                          />
                        )}
                      </Form.Item>
                    )}
                  </Col>

                  <Col xs={24} md={8}>
                    {bookingType === 'hour' && selectedSingleDate && (
                      <Form.Item
                        label="Select Time"
                        name="time"
                        rules={[{ required: true, message: 'Please select a time' }]}
                      >
                        <TimePicker
                          style={{ width: '100%' }}
                          size="large"
                          onChange={handleTimeChange}
                          format="HH:mm"
                          placeholder="Select Time"
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                {/* Additional Services Section */}
                {selectedService && selectedService.serviceOptions && Object.keys(selectedService.serviceOptions).length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Services</h4>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24}>
                        <div className="border rounded-lg p-4 bg-blue-50">
                          <h5 className="font-semibold text-blue-800 mb-3">Available Services</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selectedService.serviceOptions).map(([serviceKey, price]) => (
                              <div key={serviceKey} className="flex items-center justify-between">
                                <Checkbox
                                  checked={selectedServices[serviceKey] || false}
                                  onChange={(e) => handleServiceChange(serviceKey, e.target.checked)}
                                >
                                  <span className="text-sm">{serviceOptionLabels[serviceKey] || serviceKey}</span>
                                </Checkbox>
                                {price && price > 0 && (
                                  <span className="text-sm font-medium text-blue-700">
                                    €{price}/hour
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Price Display */}
                {bookingType && ((bookingType === 'hour' && selectedSingleDate && selectedTime) || (bookingType === 'day' && selectedDateRange)) && (
                  <div className="mb-4 p-4 bg-brand/5 rounded-lg border border-brand/20 mt-3">
                    <h4 className="font-semibold text-gray-800 mb-2">Booking Summary:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Type:</span>
                        <span className="font-medium capitalize">{bookingType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{bookingType === 'hour' ? 'Date & Time:' : 'Date Range:'}</span>
                        <span className="font-medium">
                          {bookingType === 'hour' && selectedSingleDate && selectedTime ? (
                            `${selectedSingleDate.format('MMM DD, YYYY')} at ${selectedTime.format('HH:mm')}`
                          ) : selectedDateRange && selectedDateRange.length === 2 ? (
                            `${selectedDateRange[0].format('MMM DD')} - ${selectedDateRange[1].format('MMM DD, YYYY')}`
                          ) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Hours:</span>
                        <span className="font-medium">{getNumberOfHours()} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price per hour:</span>
                        <span className="font-bold text-brand">€{selectedService?.pricePerHour || 0}</span>
                      </div>
                      
                      {/* Additional Services Breakdown */}
                      {getAdditionalServiceCosts() > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">Additional Services:</div>
                          {Object.entries(selectedServices).map(([serviceKey, isSelected]) => {
                            if (isSelected && selectedService.serviceOptions[serviceKey]) {
                              const servicePrice = selectedService.serviceOptions[serviceKey];
                              if (typeof servicePrice === 'number' && servicePrice > 0) {
                                return (
                                  <div key={serviceKey} className="flex justify-between text-sm">
                                    <span>{serviceOptionLabels[serviceKey] || serviceKey} × {getNumberOfHours()} hours:</span>
                                    <span>€{(servicePrice * getNumberOfHours()).toFixed(2)}</span>
                                  </div>
                                );
                              }
                            }
                            return null;
                          })}
                          <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-200">
                            <span>Additional Services Total:</span>
                            <span>€{getAdditionalServiceCosts().toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">Total Price:</span>
                          <span className="text-xl font-bold text-brand">€{getTotalBookingPrice().toFixed(2)}</span>
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
                    className="w-full mt-4"
                    disabled={!bookingType || ((bookingType === 'hour' && (!selectedSingleDate || !selectedTime)) || (bookingType === 'day' && !selectedDateRange))}
                  >
                    Save Card & Create Booking (€{getTotalBookingPrice().toFixed(2)})
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
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
export default function BookingOtherServicePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BookingOtherServiceContent />
    </Suspense>
  );
}
