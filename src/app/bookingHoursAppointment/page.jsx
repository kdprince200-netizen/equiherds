"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DatePicker, Form, Button, Card, Row, Col, TimePicker, Input, App, Tag, Spin, Alert, InputNumber } from "antd";
import dayjs from "dayjs";
import TopSection from "../components/topSection";
import { postRequest, getRequest } from "@/service";
import { getUserData } from "../utils/localStorage";
import Image from "next/image";

// Component that uses useSearchParams
function BookingHorseAppointmentContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [visitTime, setVisitTime] = useState(null);
  const [quotationAmount, setQuotationAmount] = useState(0);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notification } = App.useApp();

  // Check authentication on component mount
  useEffect(() => {
    const userData = getUserData();
    if (!userData || !userData.id) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please login to book an appointment',
        placement: 'topRight',
      });
      router.push('/login');
      return;
    }
    setAuthChecked(true);
  }, [router, notification]);

  // Fetch horse data and set selected horse
  useEffect(() => {
    const fetchHorseData = async () => {
      if (searchParams) {
        const horseId = searchParams.get('horseId');
        if (horseId) {
          try {
            setLoading(true);
            const response = await getRequest(`/api/horse-market/${horseId}`);
            
            if (response && response._id) {
              const normalizedData = {
                horseId: response._id,
                name: response.horseName || "Horse",
                breed: response.breed || "",
                gender: response.gender || "",
                images: Array.isArray(response.photos) && response.photos.length > 0 ? response.photos : ["/product/3.jpg"],
                videos: Array.isArray(response.videos) && response.videos.length > 0 ? response.videos : [],
                price: typeof response.askingPrice === "number" ? response.askingPrice : Number(response.askingPrice) || 0,
                location: response.countryAndCity || "",
                sellerId: response.userId?._id || response.userId,
                sellerName: response.userId ? `${response.userId.firstName || ''} ${response.userId.lastName || ''}`.trim() : '',
                sellerEmail: response.userId?.email || '',
                negotiable: response.negotiable || false,
              };

              setSelectedHorse(normalizedData);
              setQuotationAmount(normalizedData.price);
              
              // Fetch existing appointments for this horse
              fetchExistingAppointments(horseId);
            } else {
              notification.error({
                message: 'Horse Not Found',
                description: 'The requested horse could not be found',
                placement: 'topRight',
              });
            }
          } catch (error) {
            console.error('Error fetching horse data:', error);
            notification.error({
              message: 'Error Loading Horse',
              description: 'Failed to load horse information',
              placement: 'topRight',
            });
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchHorseData();
  }, [searchParams, notification]);

  // Fetch existing appointments
  const fetchExistingAppointments = async (horseId) => {
    if (!horseId) return;
    
    setAppointmentsLoading(true);
    try {
      const response = await getRequest(`/api/bookingHorses?horseId=${horseId}`);
      if (response.success && response.data) {
        setExistingAppointments(response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setAppointmentDate(date);
    if (date && selectedHorse?.horseId) {
      fetchExistingAppointments(selectedHorse.horseId);
    }
  };

  // Handle time change
  const handleTimeChange = (time) => {
    setVisitTime(time);
  };

  // Handle quotation amount change
  const handleQuotationChange = (value) => {
    setQuotationAmount(value || 0);
  };

  // Multiple appointments allowed for the same horse at the same time
  // No duplicate check needed

  // Handle form submission
  const handleSubmit = async (values) => {
    // Validate required fields
    if (!appointmentDate || !visitTime) {
      notification.error({
        message: 'Validation Error',
        description: 'Please select appointment date and time',
        placement: 'topRight',
      });
      return;
    }

    // Multiple appointments are allowed - no duplicate check needed

    // Check user authentication
    const userData = getUserData();
    if (!userData || !userData.id) {
      notification.error({
        message: 'Authentication Required',
        description: 'Please login to book an appointment',
        placement: 'topRight',
      });
      return;
    }

    if (!selectedHorse || !selectedHorse.sellerId) {
      notification.error({
        message: 'Error',
        description: 'Horse information is missing',
        placement: 'topRight',
      });
      return;
    }

    try {
      setSubmitting(true);

      const bookingPayload = {
        horseId: selectedHorse.horseId,
        sellerId: selectedHorse.sellerId,
        userId: userData.id,
        appointmentDate: appointmentDate.format('YYYY-MM-DD'),
        visitTime: visitTime.format('HH:mm'),
        quotationAmount: quotationAmount || selectedHorse.price || 0,
        status: "pending",
      };

      const response = await postRequest('/api/bookingHorses', bookingPayload);

      if (response.success) {
        notification.success({
          message: 'Appointment Booked Successfully',
          description: 'Your appointment has been confirmed!',
          placement: 'topRight',
        });

        // Reset form
        form.resetFields();
        setAppointmentDate(null);
        setVisitTime(null);
        setQuotationAmount(selectedHorse.price || 0);
        
        // Refresh appointments
        if (selectedHorse?.horseId) {
          fetchExistingAppointments(selectedHorse.horseId);
        }

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        notification.error({
          message: 'Booking Failed',
          description: response.message || 'Failed to book appointment',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      notification.error({
        message: 'Error',
        description: error?.message || 'Failed to book appointment',
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
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
      <TopSection title="Book Horse Appointment" />
      
      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Top Section: Selected Horse and Existing Appointments - 50% each */}
        <Row gutter={[24, 24]} className="mb-6">
          {/* Selected Horse Information - 50% width */}
          <Col xs={24} lg={12}>
            {loading ? (
              <Card className="h-full">
                <div className="flex justify-center items-center py-8">
                  <Spin size="large" />
                </div>
              </Card>
            ) : selectedHorse ? (
              <Card title="Selected Horse" className="h-full">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    {selectedHorse.images && selectedHorse.images.length > 0 && (
                      <Image 
                        src={selectedHorse.images[0]} 
                        alt={selectedHorse.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </Col>
                  <Col xs={24} md={16}>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-brand">{selectedHorse.name}</h3>
                      <p className="text-gray-600">
                        {selectedHorse.breed} {selectedHorse.gender ? `• ${selectedHorse.gender}` : ''}
                      </p>
                      {selectedHorse.location && (
                        <p className="text-sm text-gray-500">{selectedHorse.location}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-brand">
                          €{selectedHorse.price.toLocaleString()}
                        </span>
                        {selectedHorse.negotiable && (
                          <Tag color="blue">Negotiable</Tag>
                        )}
                      </div>
                      {selectedHorse.sellerName && (
                        <p className="text-sm text-gray-500">
                          Seller: {selectedHorse.sellerName}
                          {selectedHorse.sellerEmail && ` (${selectedHorse.sellerEmail})`}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card className="h-full">
                <Alert
                  message="No Horse Selected"
                  description="Please select a horse from the market to book an appointment"
                  type="warning"
                  showIcon
                />
              </Card>
            )}
          </Col>

          {/* Existing Appointments Panel - 50% width */}
          <Col xs={24} lg={12}>
            <Card 
              title="Existing Appointments"
              className="h-full"
              extra={
                selectedHorse && (
                  <Button 
                    size="small" 
                    onClick={() => selectedHorse?.horseId && fetchExistingAppointments(selectedHorse.horseId)}
                    loading={appointmentsLoading}
                  >
                    Refresh
                  </Button>
                )
              }
            >
              {appointmentsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Spin size="large" />
                </div>
              ) : existingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments booked yet</p>
                  <p className="text-sm text-gray-400 mt-2">This time slot appears to be available!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Booked Appointments</h4>
                    <span className="text-sm text-gray-500">
                      {existingAppointments.length} appointment{existingAppointments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {existingAppointments.map((apt) => (
                      <div key={apt._id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {dayjs(apt.appointmentDate).format('MMM DD, YYYY')} at {apt.visitTime}
                            </p>
                            {apt.userId && (
                              <p className="text-xs text-gray-500">
                                By: {apt.userId.firstName} {apt.userId.lastName}
                              </p>
                            )}
                          </div>
                          <Tag color="red">Booked</Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Multiple appointments can be booked for the same time slot. These are existing appointments for reference.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Bottom Section: Booking Form - 100% width */}
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card title="Appointment Information">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Appointment Date"
                      name="appointmentDate"
                      rules={[{ required: true, message: 'Please select appointment date' }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        size="large"
                        value={appointmentDate}
                        onChange={handleDateChange}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                        placeholder="Select Date"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Visit Time"
                      name="visitTime"
                      rules={[{ required: true, message: 'Please select visit time' }]}
                    >
                      <TimePicker
                        style={{ width: '100%' }}
                        size="large"
                        value={visitTime}
                        onChange={handleTimeChange}
                        format="HH:mm"
                        placeholder="Select Time"
                        minuteStep={15}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Quotation Amount (€)"
                      name="quotationAmount"
                      rules={[{ required: true, message: 'Please enter quotation amount' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        size="large"
                        value={quotationAmount}
                        onChange={handleQuotationChange}
                        min={0}
                        step={100}
                        formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/€\s?|(,*)/g, '')}
                        placeholder="Enter amount"
                      />
                    </Form.Item>
                    {selectedHorse && (
                      <p className="text-xs text-gray-500 mt-1">
                        Asking Price: €{selectedHorse.price.toLocaleString()}
                        {selectedHorse.negotiable && ' (Negotiable)'}
                      </p>
                    )}
                  </Col>
                </Row>

                {/* Multiple appointments allowed - no warning needed */}

                {/* Booking Summary */}
                {appointmentDate && visitTime && (
                  <div className="mb-4 p-4 bg-brand/5 rounded-lg border border-brand/20 mt-3">
                    <h4 className="font-semibold text-gray-800 mb-2">Appointment Summary:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Horse:</span>
                        <span className="font-medium">{selectedHorse?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{appointmentDate.format('MMM DD, YYYY')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{visitTime.format('HH:mm')}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">Quotation Amount:</span>
                          <span className="text-xl font-bold text-brand">€{quotationAmount.toLocaleString()}</span>
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
                    loading={submitting}
                    disabled={!appointmentDate || !visitTime}
                  >
                    {submitting ? 'Booking Appointment...' : 'Book Appointment'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}

// Main export function with Suspense boundary
export default function BookingHorseAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BookingHorseAppointmentContent />
    </Suspense>
  );
}
