"use client";

import { useState, useEffect } from "react";
import { getRequest } from "@/service";
import { getUserData } from "../utils/localStorage";
import { Eye, Home, User, Edit, Check, X, ShoppingBag } from "lucide-react";
import { Pagination, App } from "antd";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

export default function Client() {
  const [activeTab, setActiveTab] = useState("stable"); // "stable", "trainer", "otherservice", "horsemarket", or "marketplace"
  const [stableBookings, setStableBookings] = useState([]);
  const [trainerBookings, setTrainerBookings] = useState([]);
  const [otherServiceBookings, setOtherServiceBookings] = useState([]);
  const [horseMarketBookings, setHorseMarketBookings] = useState([]);
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const { notification } = App.useApp();

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userData = getUserData();
      if (!userData.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      let response;
      if (activeTab === "stable") {
        response = await getRequest(
          `/api/bookingStables?userId=${userData.id}&page=${pagination.page}&limit=${pagination.limit}`
        );
        if (response.success && response.data) {
          setStableBookings(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || response.data.length || 0,
            pages: response.pagination?.pages || 1
          }));
        } else {
          setStableBookings([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            pages: 0
          }));
          setError("Failed to fetch stable bookings");
        }
      } else if (activeTab === "trainer") {
        response = await getRequest(
          `/api/bookingTrainers?userId=${userData.id}&page=${pagination.page}&limit=${pagination.limit}`
        );
        if (response.success && response.data) {
          setTrainerBookings(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || response.data.length || 0,
            pages: response.pagination?.pages || 1
          }));
        } else {
          setTrainerBookings([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            pages: 0
          }));
          setError("Failed to fetch trainer bookings");
        }
      } else if (activeTab === "horsemarket") {
        response = await getRequest(
          `/api/bookingHorses?sellerId=${userData.id}&page=${pagination.page}&limit=${pagination.limit}`
        );
        if (response.success && response.data) {
          setHorseMarketBookings(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || response.data.length || 0,
            pages: response.pagination?.pages || 1
          }));
        } else {
          setHorseMarketBookings([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            pages: 0
          }));
          setError("Failed to fetch horse market bookings");
        }
      } else if (activeTab === "marketplace") {
        response = await getRequest(
          `/api/bookingEquipments?sellerId=${userData.id}`
        );
        if (response.success && response.data) {
          setEquipmentBookings(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.data.length || 0,
            pages: 1
          }));
        } else {
          setEquipmentBookings([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            pages: 0
          }));
          setError("Failed to fetch equipment bookings");
        }
      } else {
        response = await getRequest(
          `/api/bookingOtherServices?userId=${userData.id}&page=${pagination.page}&limit=${pagination.limit}`
        );
        if (response.success && response.data) {
          setOtherServiceBookings(response.data);
          setPagination(prev => ({
            ...prev,
            total: response.pagination?.total || response.data.length || 0,
            pages: response.pagination?.pages || 1
          }));
        } else {
          setOtherServiceBookings([]);
          setPagination(prev => ({
            ...prev,
            total: 0,
            pages: 0
          }));
          setError("Failed to fetch other service bookings");
        }
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Error loading bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "Pending";
    } else if (now >= start && now <= end) {
      return "Active";
    } else {
      return "Completed";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getServiceType = (bookingType, serviceType) => {
    if (serviceType === 'trainer') {
      if (bookingType === 'day') return 'Daily Training';
      if (bookingType === 'week') return 'Weekly Training';
      return bookingType || 'Training';
    } else if (serviceType === 'otherservice') {
      return bookingType || 'Other Service';
    } else {
      if (bookingType === 'day') return 'Daily Stable';
      if (bookingType === 'week') return 'Weekly Stable';
      return bookingType || 'Stable';
    }
  };

  const formatServiceName = (serviceKey) => {
    return serviceKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/In Stable On Straw/g, 'In Stable (on straw)')
      .replace(/In Stable On Shavings/g, 'In Stable (on shavings)')
      .replace(/In Field Alone/g, 'In Field (alone)')
      .replace(/In Field Herd/g, 'In Field (herd)');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      let apiEndpoint;
      if (activeTab === 'stable') {
        apiEndpoint = '/api/charge-saved-payment';
      } else if (activeTab === 'trainer') {
        apiEndpoint = '/api/charge-saved-payment-trainer';
      } else if (activeTab === 'marketplace') {
        apiEndpoint = '/api/charge-saved-payment-equipment';
      } else {
        apiEndpoint = '/api/charge-saved-payment-other-service';
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Booking confirmed and payment charged successfully!');
        // Refresh the bookings list
        fetchBookings();
        closeModal();
      } else {
        toast.error('Failed to confirm booking: ' + result.message);
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Error confirming booking. Please try again.');
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
    setReason(booking.reason || "");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBooking(null);
    setReason("");
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      let response;
      
      if (activeTab === 'horsemarket') {
        // For horse market bookings, update status and reason
        response = await fetch(`/api/bookingHorses/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
            reason: reason || undefined
          }),
        });
      } else if (activeTab === 'marketplace') {
        // For equipment bookings, handle confirm/cancel similar to other bookings
        if (newStatus === 'confirmed') {
          // Charge payment first
          response = await fetch('/api/charge-saved-payment-equipment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId: bookingId
            }),
          });
        } else {
          // Cancel booking
          response = await fetch(`/api/bookingEquipments/${bookingId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingStatus: newStatus,
              reason: reason || undefined
            }),
          });
        }
      } else if (newStatus === 'confirmed') {
        // If confirming, charge the payment first
        let apiEndpoint;
        if (activeTab === 'stable') {
          apiEndpoint = '/api/charge-saved-payment';
        } else if (activeTab === 'trainer') {
          apiEndpoint = '/api/charge-saved-payment-trainer';
        } else {
          apiEndpoint = '/api/charge-saved-payment-other-service';
        }
        
        response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: bookingId
          }),
        });
      } else {
        // If cancelling, just update the status
        let apiEndpoint;
        if (activeTab === 'stable') {
          apiEndpoint = `/api/bookingStables/${bookingId}`;
        } else if (activeTab === 'trainer') {
          apiEndpoint = `/api/bookingTrainers/${bookingId}`;
        } else if (activeTab === 'marketplace') {
          apiEndpoint = `/api/bookingEquipments/${bookingId}`;
        } else {
          apiEndpoint = `/api/bookingOtherServices/${bookingId}`;
        }
        
        response = await fetch(apiEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingStatus: newStatus,
            reason: activeTab === 'marketplace' ? (reason || undefined) : undefined
          }),
        });
      }

      const result = await response.json();
      
      if (result.success) {
        if (newStatus === 'confirmed' || newStatus === 'approved') {
          toast.success('Booking confirmed successfully!');
        } else if (newStatus === 'cancelled' || newStatus === 'rejected') {
          toast.success('Booking cancelled successfully!');
        } else {
          toast.success('Booking status updated successfully!');
        }
        // Refresh the bookings list
        fetchBookings();
        closeEditModal();
        setReason("");
      } else {
        if (newStatus === 'confirmed' || newStatus === 'approved') {
          toast.error('Failed to confirm booking: ' + result.message);
        } else {
          toast.error('Failed to cancel booking: ' + result.message);
        }
      }
    } catch (error) {
      console.error(`Error ${newStatus} booking:`, error);
      if (newStatus === 'confirmed' || newStatus === 'approved') {
        toast.error('Error confirming booking. Please try again.');
      } else {
        toast.error('Error cancelling booking. Please try again.');
      }
    }
  };

  // Get current bookings for the active tab
  const currentBookings = activeTab === "stable" 
    ? stableBookings 
    : activeTab === "trainer" 
    ? trainerBookings 
    : activeTab === "horsemarket"
    ? horseMarketBookings
    : activeTab === "marketplace"
    ? equipmentBookings
    : otherServiceBookings;

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({ 
      ...prev, 
      page: page,
      limit: pageSize || prev.limit
    }));
  };
  return (
    <App>
      <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand">Clients</h2>
        <div className="text-sm text-gray-600">
          Total: {pagination.total} bookings
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab("stable");
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "stable"
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Home size={16} />
            Stable Clients
          </button>
          <button
            onClick={() => {
              setActiveTab("trainer");
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "trainer"
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <User size={16} />
            Trainer Clients
          </button>
          <button
            onClick={() => {
              setActiveTab("otherservice");
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "otherservice"
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <User size={16} />
            Other Service Clients
          </button>
          <button
            onClick={() => {
              setActiveTab("horsemarket");
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "horsemarket"
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ShoppingBag size={16} />
            Horse Market Clients
          </button>
          <button
            onClick={() => {
              setActiveTab("marketplace");
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "marketplace"
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ShoppingBag size={16} />
            Market Place Clients
          </button>
        </nav>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading bookings...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-700">{error}</div>
          <button 
            onClick={fetchBookings}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block rounded border border-[color:var(--primary)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
                <thead className="bg-[color:var(--primary)]/10 text-brand">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium min-w-[140px]">Client Name</th>
                    <th className="px-3 py-3 text-left font-medium min-w-[130px]">Phone</th>
                    {activeTab === "horsemarket" ? (
                      <>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Appointment Date</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Visit Time</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[120px]">Horse</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Status</th>
                      </>
                    ) : activeTab === "marketplace" ? (
                      <>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Booking Date</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Quantity</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[120px]">Product</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Status</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">Start Date</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[100px]">End Date</th>
                        <th className="px-3 py-3 text-left font-medium min-w-[120px]">Service</th>
                        {activeTab === "stable" && (
                          <th className="px-3 py-3 text-left font-medium min-w-[100px]">Stable</th>
                        )}
                        {activeTab === "trainer" && (
                          <th className="px-3 py-3 text-left font-medium min-w-[100px]">Trainer</th>
                        )}
                        {activeTab === "otherservice" && (
                          <th className="px-3 py-3 text-left font-medium min-w-[100px]">Service Provider</th>
                        )}
                      </>
                    )}
                    <th className="px-3 py-3 text-left font-medium min-w-[90px]">Price</th>
                    <th className="px-3 py-3 text-center font-medium min-w-[80px]">Actions</th>
                  </tr>
                </thead>
            <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === "horsemarket" || activeTab === "marketplace" ? 7 : 8} className="px-4 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((booking) => {
                      let status, clientName, phoneNumber;
                      
                      if (activeTab === "horsemarket") {
                        status = booking.status || "pending";
                        clientName = `${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`.trim();
                        phoneNumber = booking.userId?.phoneNumber || booking.userId?.email || 'N/A';
                      } else if (activeTab === "marketplace") {
                        status = booking.bookingStatus || "pending";
                        clientName = `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim();
                        phoneNumber = booking.customerId?.phoneNumber || booking.customerId?.email || 'N/A';
                      } else {
                        status = getStatus(booking.startDate, booking.endDate);
                        clientName = `${booking.clientId?.firstName || ''} ${booking.clientId?.lastName || ''}`.trim();
                        phoneNumber = booking.clientId?.phoneNumber || 'N/A';
                      }
                      
                      return (
                        <tr key={booking._id} className="border-t border-[color:var(--primary)]/20">
                          <td className="px-3 py-3 font-medium">
                            <div className="max-w-[140px] truncate" title={clientName || 'Unknown Client'}>
                              {clientName || 'Unknown Client'}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="max-w-[130px] truncate" title={phoneNumber}>
                              {phoneNumber}
                            </div>
                          </td>
                          {activeTab === "horsemarket" ? (
                            <>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={dayjs(booking.appointmentDate).format('MMM DD, YYYY')}>
                                  {dayjs(booking.appointmentDate).format('MMM DD, YYYY')}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={booking.visitTime}>
                                  {booking.visitTime}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[120px] truncate" title={booking.horseId?.horseName || 'Unknown Horse'}>
                                  {booking.horseId?.horseName || 'Unknown Horse'}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  status === "approved" || status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "rejected" || status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {status}
                                </span>
                              </td>
                            </>
                          ) : activeTab === "marketplace" ? (
                            <>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={dayjs(booking.bookingDate).format('MMM DD, YYYY')}>
                                  {dayjs(booking.bookingDate).format('MMM DD, YYYY')}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={booking.quantity}>
                                  {booking.quantity}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[120px] truncate" title={booking.equipmentId?.productName || 'Unknown Product'}>
                                  {booking.equipmentId?.productName || 'Unknown Product'}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {status}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={formatDate(booking.startDate)}>
                                  {formatDate(booking.startDate)}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[100px] truncate" title={formatDate(booking.endDate)}>
                                  {formatDate(booking.endDate)}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="max-w-[120px] truncate" title={getServiceType(booking.bookingType, activeTab)}>
                                  {getServiceType(booking.bookingType, activeTab)}
                                </div>
                              </td>
                              {activeTab === "stable" && (
                                <td className="px-3 py-3">
                                  <div className="max-w-[100px] truncate" title={booking.stableId?.Tittle || 'Unknown Stable'}>
                                    {booking.stableId?.Tittle || 'Unknown Stable'}
                                  </div>
                                </td>
                              )}
                              {activeTab === "trainer" && (
                                <td className="px-3 py-3">
                                  <div className="max-w-[100px] truncate" title={booking.trainerId?.title || 'Unknown Trainer'}>
                                    {booking.trainerId?.title || 'Unknown Trainer'}
                                  </div>
                                </td>
                              )}
                              {activeTab === "otherservice" && (
                                <td className="px-3 py-3">
                                  <div className="max-w-[100px] truncate" title={booking.otherServiceId?.title || 'Unknown Service Provider'}>
                                    {booking.otherServiceId?.title || 'Unknown Service Provider'}
                                  </div>
                                </td>
                              )}
                            </>
                          )}
                          <td className="px-3 py-3 font-medium text-right">
                            <div className="max-w-[90px] truncate" title={`€${activeTab === "horsemarket" ? booking.quotationAmount : activeTab === "marketplace" ? booking.totalPrice : booking.totalPrice}`}>
                              €{activeTab === "horsemarket" ? booking.quotationAmount : activeTab === "marketplace" ? booking.totalPrice : booking.totalPrice}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-brand hover:bg-brand/10 rounded-full transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditBooking(booking)}
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Status"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {currentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No bookings found
              </div>
            ) : (
              currentBookings.map((booking) => {
                let status, clientName, phoneNumber;
                
                if (activeTab === "horsemarket") {
                  status = booking.status || "pending";
                  clientName = `${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`.trim();
                  phoneNumber = booking.userId?.phoneNumber || booking.userId?.email || 'N/A';
                } else if (activeTab === "marketplace") {
                  status = booking.bookingStatus || "pending";
                  clientName = `${booking.customerId?.firstName || ''} ${booking.customerId?.lastName || ''}`.trim();
                  phoneNumber = booking.customerId?.phoneNumber || booking.customerId?.email || 'N/A';
                } else {
                  status = getStatus(booking.startDate, booking.endDate);
                  clientName = `${booking.clientId?.firstName || ''} ${booking.clientId?.lastName || ''}`.trim();
                  phoneNumber = booking.clientId?.phoneNumber || 'N/A';
                }
                
                return (
                  <div key={booking._id} className="bg-white rounded-lg border border-[color:var(--primary)]/20 p-4 shadow-sm">
                    {/* Header with Client Name and Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {clientName || 'Unknown Client'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activeTab === "horsemarket"
                            ? (booking.horseId?.horseName || 'Unknown Horse')
                            : activeTab === "marketplace"
                            ? (booking.equipmentId?.productName || 'Unknown Product')
                            : activeTab === "stable" 
                            ? (booking.stableId?.Tittle || 'Unknown Stable')
                            : activeTab === "trainer"
                            ? (booking.trainerId?.title || 'Unknown Trainer')
                            : (booking.otherServiceId?.title || 'Unknown Service Provider')
                          }
                        </p>
                      </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activeTab === "horsemarket"
                          ? (status === "approved" || status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : status === "rejected" || status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700")
                          : activeTab === "marketplace"
                          ? (status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700")
                          : (status === "Active"
                            ? "bg-green-100 text-green-700"
                            : status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700")
                    }`}>
                        {status}
                      </span>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="text-sm text-gray-900">
                        {phoneNumber}
                      </p>
                    </div>

                    {/* Booking Details */}
                    {activeTab === "horsemarket" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Appointment Date</p>
                          <p className="text-sm text-gray-900">
                            {dayjs(booking.appointmentDate).format('MMM DD, YYYY')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Visit Time</p>
                          <p className="text-sm text-gray-900">
                            {booking.visitTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Quotation</p>
                          <p className="text-sm text-gray-900">
                            €{booking.quotationAmount}
                          </p>
                        </div>
                      </div>
                    ) : activeTab === "marketplace" ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Booking Date</p>
                          <p className="text-sm text-gray-900">
                            {dayjs(booking.bookingDate).format('MMM DD, YYYY')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
                          <p className="text-sm text-gray-900">
                            {booking.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Price</p>
                          <p className="text-sm text-gray-900">
                            €{booking.totalPrice}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.startDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                          <p className="text-sm text-gray-900">
                            {getServiceType(booking.bookingType, activeTab)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Price and Action */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{activeTab === "horsemarket" ? "Quotation Amount" : activeTab === "marketplace" ? "Total Price" : "Total Price"}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-brand">€{activeTab === "horsemarket" ? booking.quotationAmount : activeTab === "marketplace" ? booking.totalPrice : booking.totalPrice}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-brand hover:bg-brand/10 rounded-full transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditBooking(booking)}
                              className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Edit Status"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 text-center sm:text-left">
            <span className="hidden sm:inline">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} bookings
            </span>
            <span className="sm:hidden">
              {pagination.total} bookings
            </span>
          </div>
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            pageSizeOptions={['5', '10', '20', '50']}
            className="flex justify-center"
          />
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-brand">Booking Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Booking ID: {selectedBooking._id}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {activeTab === "horsemarket" ? (
                  /* Horse Market Booking Details */
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Buyer Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Buyer Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">
                              {`${selectedBooking.userId?.firstName || ''} ${selectedBooking.userId?.lastName || ''}`.trim() || 'Unknown Buyer'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{selectedBooking.userId?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone Number</label>
                            <p className="text-gray-900">{selectedBooking.userId?.phoneNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Appointment Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Appointment Date</label>
                            <p className="text-gray-900">{dayjs(selectedBooking.appointmentDate).format('MMM DD, YYYY')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Visit Time</label>
                            <p className="text-gray-900">{selectedBooking.visitTime}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Created</label>
                            <p className="text-gray-900">
                              {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Booking Status */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Booking Status
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <div className="mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedBooking.status === "approved" || selectedBooking.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : selectedBooking.status === "rejected" || selectedBooking.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {selectedBooking.status || 'pending'}
                              </span>
                            </div>
                          </div>
                          {selectedBooking.reason && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Reason</label>
                              <p className="text-gray-900">{selectedBooking.reason}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-600">Quotation Amount</label>
                            <p className="text-lg font-bold text-brand">€{selectedBooking.quotationAmount}</p>
                          </div>
                        </div>
                      </div>

                      {/* Horse Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Horse Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Horse Name</label>
                            <p className="text-gray-900">{selectedBooking.horseId?.horseName || 'Unknown Horse'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Breed</label>
                            <p className="text-gray-900">{selectedBooking.horseId?.breed || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Asking Price</label>
                            <p className="text-gray-900">€{selectedBooking.horseId?.askingPrice || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : activeTab === "marketplace" ? (
                  /* Marketplace Booking Details */
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Customer Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">
                              {`${selectedBooking.customerId?.firstName || ''} ${selectedBooking.customerId?.lastName || ''}`.trim() || 'Unknown Customer'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{selectedBooking.customerId?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone Number</label>
                            <p className="text-gray-900">{selectedBooking.customerId?.phoneNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Booking Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Booking Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Date</label>
                            <p className="text-gray-900">{dayjs(selectedBooking.bookingDate).format('MMM DD, YYYY')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Quantity</label>
                            <p className="text-gray-900">{selectedBooking.quantity}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Created</label>
                            <p className="text-gray-900">
                              {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Booking Status */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Booking Status
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <div className="mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedBooking.bookingStatus === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : selectedBooking.bookingStatus === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : selectedBooking.bookingStatus === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {selectedBooking.bookingStatus || 'pending'}
                              </span>
                            </div>
                          </div>
                          {selectedBooking.reason && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Reason</label>
                              <p className="text-gray-900">{selectedBooking.reason}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium text-gray-600">Payment Status</label>
                            <div className="mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedBooking.paymentId
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {selectedBooking.paymentId ? 'Payment Method Saved' : 'No Payment Method'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Total Price</label>
                            <p className="text-lg font-bold text-brand">€{selectedBooking.totalPrice}</p>
                          </div>
                        </div>
                      </div>

                      {/* Product Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Product Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Product Name</label>
                            <p className="text-gray-900">{selectedBooking.equipmentId?.productName || 'Unknown Product'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Unit Price</label>
                            <p className="text-gray-900">€{selectedBooking.unitPrice || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Discount</label>
                            <p className="text-gray-900">{selectedBooking.discount || 0}%</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Delivery Charges</label>
                            <p className="text-gray-900">€{selectedBooking.deliveryCharges || 0}</p>
                          </div>
                          {selectedBooking.address && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Address</label>
                              <p className="text-gray-900">{selectedBooking.address}</p>
                            </div>
                          )}
                          {selectedBooking.zipCode && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Zip Code</label>
                              <p className="text-gray-900">{selectedBooking.zipCode}</p>
                            </div>
                          )}
                          {selectedBooking.country && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Country</label>
                              <p className="text-gray-900">{selectedBooking.country}</p>
                            </div>
                          )}
                          {selectedBooking.description && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Description</label>
                              <p className="text-gray-900">{selectedBooking.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Regular Booking Details */
                  <>
                    {/* First Row: Client Information and Booking Dates */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Client Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Client Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">
                              {`${selectedBooking.clientId?.firstName || ''} ${selectedBooking.clientId?.lastName || ''}`.trim() || 'Unknown Client'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{selectedBooking.clientId?.email || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone Number</label>
                            <p className="text-gray-900">{selectedBooking.clientId?.phoneNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Booking Dates */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Booking Dates
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Start Date</label>
                            <p className="text-gray-900">{formatDate(selectedBooking.startDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">End Date</label>
                            <p className="text-gray-900">{formatDate(selectedBooking.endDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Created</label>
                            <p className="text-gray-900">
                              {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                {/* Second Row: Booking Information and Stable Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Booking Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Booking Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Booking Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBooking.bookingStatus === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : selectedBooking.bookingStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : selectedBooking.bookingStatus === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {selectedBooking.bookingStatus || 'pending'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Payment Status</label>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBooking.paymentId
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {selectedBooking.paymentId ? 'Payment Method Saved' : 'No Payment Method'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Service Type</label>
                        <p className="text-gray-900">{getServiceType(selectedBooking.bookingType, activeTab)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Number of Horses</label>
                        <p className="text-gray-900">{selectedBooking.numberOfHorses}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Number of Days</label>
                        <p className="text-gray-900">{selectedBooking.numberOfDays} days</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Base Price per {selectedBooking.bookingType}</label>
                        <p className="text-gray-900">€{selectedBooking.basePrice || selectedBooking.price}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Total Price</label>
                        <p className="text-lg font-bold text-brand">€{selectedBooking.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      {activeTab === "stable" ? "Stable Information" : activeTab === "trainer" ? "Trainer Information" : "Service Provider Information"}
                    </h4>
                    <div className="space-y-3">
                      {activeTab === "stable" ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Stable Name</label>
                            <p className="text-gray-900">{selectedBooking.stableId?.Tittle || 'Unknown Stable'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="text-gray-900">{selectedBooking.stableId?.Deatils || 'No description available'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-900">{selectedBooking.stableId?.location || 'Location not specified'}</p>
                          </div>
                          {selectedBooking.stableId?.coordinates && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Coordinates</label>
                              <p className="text-gray-900 text-sm">
                                Lat: {selectedBooking.stableId.coordinates.lat}, 
                                Lng: {selectedBooking.stableId.coordinates.lng}
                              </p>
                            </div>
                          )}
                        </>
                      ) : activeTab === "trainer" ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Trainer Name</label>
                            <p className="text-gray-900">{selectedBooking.trainerId?.title || 'Unknown Trainer'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="text-gray-900">{selectedBooking.trainerId?.details || 'No description available'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Experience</label>
                            <p className="text-gray-900">{selectedBooking.trainerId?.Experience || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-900">{selectedBooking.trainerId?.location || 'Location not specified'}</p>
                          </div>
                          {selectedBooking.trainerId?.coordinates && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Coordinates</label>
                              <p className="text-gray-900 text-sm">
                                Lat: {selectedBooking.trainerId.coordinates.lat}, 
                                Lng: {selectedBooking.trainerId.coordinates.lng}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Service Provider Name</label>
                            <p className="text-gray-900">{selectedBooking.otherServiceId?.title || 'Unknown Service Provider'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <p className="text-gray-900">{selectedBooking.otherServiceId?.details || 'No description available'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Service Type</label>
                            <p className="text-gray-900">{selectedBooking.otherServiceId?.serviceType || 'Not specified'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-900">{selectedBooking.otherServiceId?.location || 'Location not specified'}</p>
                          </div>
                          {selectedBooking.otherServiceId?.coordinates && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Coordinates</label>
                              <p className="text-gray-900 text-sm">
                                Lat: {selectedBooking.otherServiceId.coordinates.lat}, 
                                Lng: {selectedBooking.otherServiceId.coordinates.lng}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Services & Pricing Breakdown */}
                {selectedBooking.additionalServices && selectedBooking.servicePriceDetails && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Additional Services & Pricing
                    </h4>
                    <div className="space-y-4">
                      {/* Base Price */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">Base Price ({selectedBooking.bookingType})</span>
                          <span className="font-bold text-gray-900">€{selectedBooking.basePrice || selectedBooking.price}</span>
                        </div>
                      </div>

                      {/* Additional Services */}
                      {selectedBooking.additionalServiceCosts > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-700">Additional Services:</h5>
                          
                          {/* Stable Services (for stable bookings) */}
                          {activeTab === "stable" && (
                            <>
                              {/* Short-term Stay */}
                              {selectedBooking.additionalServices.shortTermStay?.selected && selectedBooking.servicePriceDetails.shortTermStay && (
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-800">
                                      Short-term Stay ({formatServiceName(selectedBooking.additionalServices.shortTermStay.selected)})
                                    </span>
                                    <span className="text-sm font-medium text-blue-700">
                                      €{selectedBooking.servicePriceDetails.shortTermStay.pricePerDay}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.shortTermStay.price}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Long-term Stay */}
                              {selectedBooking.additionalServices.longTermStay?.selected && selectedBooking.servicePriceDetails.longTermStay && (
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-green-800">
                                      Long-term Stay ({formatServiceName(selectedBooking.additionalServices.longTermStay.selected)})
                                    </span>
                                    <span className="text-sm font-medium text-green-700">
                                      €{selectedBooking.servicePriceDetails.longTermStay.pricePerDay}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.longTermStay.price}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Stallions */}
                              {selectedBooking.additionalServices.stallionsAccepted && selectedBooking.servicePriceDetails.stallions && (
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-yellow-800">Accommodation for the riders</span>
                                    <span className="text-sm font-medium text-yellow-700">
                                      €{selectedBooking.servicePriceDetails.stallions.pricePerDay}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.stallions.price}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Event Pricing */}
                              {selectedBooking.additionalServices.eventPricing && (
                                <div className="space-y-2">
                                  {selectedBooking.additionalServices.eventPricing.eventingCourse && selectedBooking.servicePriceDetails.eventPricing.eventingCoursePrice > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-800">Eventing Course</span>
                                        <span className="text-sm font-medium text-purple-700">
                                          €{selectedBooking.servicePriceDetails.eventPricing.eventingCoursePrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.eventPricing.eventingCoursePrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.eventPricing.canterTrack && selectedBooking.servicePriceDetails.eventPricing.canterTrackPrice > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-800">Canter Track</span>
                                        <span className="text-sm font-medium text-purple-700">
                                          €{selectedBooking.servicePriceDetails.eventPricing.canterTrackPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.eventPricing.canterTrackPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.eventPricing.jumpingTrack && selectedBooking.servicePriceDetails.eventPricing.jumpingTrackPrice > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-800">Jumping Track</span>
                                        <span className="text-sm font-medium text-purple-700">
                                          €{selectedBooking.servicePriceDetails.eventPricing.jumpingTrackPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.eventPricing.jumpingTrackPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.eventPricing.dressageTrack && selectedBooking.servicePriceDetails.eventPricing.dressageTrackPrice > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-800">Dressage Track</span>
                                        <span className="text-sm font-medium text-purple-700">
                                          €{selectedBooking.servicePriceDetails.eventPricing.dressageTrackPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.eventPricing.dressageTrackPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {/* Other Service Additional Services (for other service bookings) */}
                          {activeTab === "otherservice" && (
                            <>
                              {/* Service Options */}
                              {selectedBooking.additionalServices && (
                                <div className="space-y-2">
                                  <h6 className="font-medium text-gray-600 text-sm">Selected Services:</h6>
                                  {Object.entries(selectedBooking.additionalServices).map(([serviceKey, serviceData]) => {
                                    if (serviceData && serviceData.selected) {
                                      return (
                                        <div key={serviceKey} className="bg-blue-50 p-3 rounded-lg">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm text-blue-800">
                                              {formatServiceName(serviceKey)}
                                            </span>
                                            <span className="text-sm font-medium text-blue-700">
                                              €{serviceData.price || 0}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )}
                            </>
                          )}

                          {/* Trainer Services (for trainer bookings) */}
                          {activeTab === "trainer" && (
                            <>
                              {/* Disciplines */}
                              {selectedBooking.additionalServices.disciplines && (
                                <div className="space-y-2">
                                  <h6 className="font-medium text-gray-600 text-sm">Disciplines:</h6>
                                  {selectedBooking.additionalServices.disciplines.dressage && selectedBooking.servicePriceDetails.disciplines.dressagePrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Dressage</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.dressagePrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.dressagePrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.disciplines.showJumping && selectedBooking.servicePriceDetails.disciplines.showJumpingPrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Show Jumping</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.showJumpingPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.showJumpingPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.disciplines.eventing && selectedBooking.servicePriceDetails.disciplines.eventingPrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Eventing</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.eventingPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.eventingPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.disciplines.endurance && selectedBooking.servicePriceDetails.disciplines.endurancePrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Endurance</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.endurancePrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.endurancePrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.disciplines.western && selectedBooking.servicePriceDetails.disciplines.westernPrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Western</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.westernPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.westernPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.disciplines.vaulting && selectedBooking.servicePriceDetails.disciplines.vaultingPrice > 0 && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-blue-800">Vaulting</span>
                                        <span className="text-sm font-medium text-blue-700">
                                          €{selectedBooking.servicePriceDetails.disciplines.vaultingPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.disciplines.vaultingPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Training */}
                              {selectedBooking.additionalServices.training && (
                                <div className="space-y-2">
                                  <h6 className="font-medium text-gray-600 text-sm">Training:</h6>
                                  {selectedBooking.additionalServices.training.onLocationLessons && selectedBooking.servicePriceDetails.training.onLocationLessonsPrice > 0 && (
                                    <div className="bg-green-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-green-800">On Location Lessons</span>
                                        <span className="text-sm font-medium text-green-700">
                                          €{selectedBooking.servicePriceDetails.training.onLocationLessonsPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.training.onLocationLessonsPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {selectedBooking.additionalServices.training.lessonsOnTrainersLocation && selectedBooking.servicePriceDetails.training.lessonsOnTrainersLocationPrice > 0 && (
                                    <div className="bg-green-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-green-800">Lessons on Trainer's Location</span>
                                        <span className="text-sm font-medium text-green-700">
                                          €{selectedBooking.servicePriceDetails.training.lessonsOnTrainersLocationPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.training.lessonsOnTrainersLocationPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Competition Coaching */}
                              {selectedBooking.additionalServices.competitionCoaching && (
                                <div className="space-y-2">
                                  <h6 className="font-medium text-gray-600 text-sm">Competition Coaching:</h6>
                                  {selectedBooking.additionalServices.competitionCoaching.onLocationCoaching && selectedBooking.servicePriceDetails.competitionCoaching.onLocationCoachingPrice > 0 && (
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-purple-800">On Location Coaching</span>
                                        <span className="text-sm font-medium text-purple-700">
                                          €{selectedBooking.servicePriceDetails.competitionCoaching.onLocationCoachingPrice / selectedBooking.numberOfDays}/day × {selectedBooking.numberOfDays} days = €{selectedBooking.servicePriceDetails.competitionCoaching.onLocationCoachingPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                          {/* Additional Services Total */}
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Additional Services Total</span>
                              <span className="font-bold text-gray-900">€{selectedBooking.additionalServiceCosts}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div className="bg-brand/10 p-4 rounded-lg border-2 border-brand/20">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-brand">Grand Total</span>
                          <span className="text-xl font-bold text-brand">€{selectedBooking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                  </>
                )}

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between p-6 border-t border-gray-200">
              <div className="flex gap-2">
                {activeTab === "horsemarket" ? (
                  <>
                    {(selectedBooking.status === 'pending' || !selectedBooking.status) && (
                      <>
                        <button
                          onClick={() => {
                            closeModal();
                            handleEditBooking(selectedBooking);
                          }}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            closeModal();
                            handleEditBooking(selectedBooking);
                          }}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </>
                ) : activeTab === "marketplace" ? (
                  selectedBooking.bookingStatus === 'pending' && selectedBooking.paymentId && (
                    <button
                      onClick={() => handleConfirmBooking(selectedBooking._id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm Booking & Charge Payment
                    </button>
                  )
                ) : (
                  selectedBooking.bookingStatus === 'pending' && selectedBooking.paymentId && (
                    <button
                      onClick={() => handleConfirmBooking(selectedBooking._id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm Booking & Charge Payment
                    </button>
                  )
                )}
              </div>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
        </div>
      </div>
      )}

      {/* Edit Status Modal */}
      {isEditModalOpen && editingBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-brand">Update Booking Status</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Booking ID: {editingBooking._id}
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="py-2 px-4">
              <div className="space-y-4">
                {activeTab === "horsemarket" ? (
                  <>
                    {/* Current Status and Buyer in one row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingBooking.status === "approved" || editingBooking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : editingBooking.status === "rejected" || editingBooking.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {editingBooking.status || 'pending'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buyer</label>
                        <p className="text-gray-900">
                          {`${editingBooking.userId?.firstName || ''} ${editingBooking.userId?.lastName || ''}`.trim() || 'Unknown Buyer'}
                        </p>
                      </div>
                    </div>

                    {/* Horse and Quotation Amount in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horse</label>
                        <p className="text-gray-900">
                          {editingBooking.horseId?.horseName || 'Unknown Horse'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Amount</label>
                        <p className="text-lg font-bold text-brand">€{editingBooking.quotationAmount}</p>
                      </div>
                    </div>

                    {/* Appointment Date - full width */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                      <p className="text-gray-900">
                        {dayjs(editingBooking.appointmentDate).format('MMM DD, YYYY')} at {editingBooking.visitTime}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason </label>
                        <textarea
                          rows={2}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Enter reason for status change..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="space-y-3">
                        {(editingBooking.status === 'pending' || !editingBooking.status) && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'approved')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check size={20} />
                            Approve Booking
                          </button>
                        )}
                        
                        {(editingBooking.status === 'pending' || !editingBooking.status) && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'rejected')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={20} />
                            Reject Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : activeTab === "marketplace" ? (
                  <>
                    {/* Current Status and Customer in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingBooking.bookingStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : editingBooking.bookingStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : editingBooking.bookingStatus === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {editingBooking.bookingStatus || 'pending'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                        <p className="text-gray-900">
                          {`${editingBooking.customerId?.firstName || ''} ${editingBooking.customerId?.lastName || ''}`.trim() || 'Unknown Customer'}
                        </p>
                      </div>
                    </div>

                    {/* Product and Total Amount in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                        <p className="text-gray-900">
                          {editingBooking.equipmentId?.productName || 'Unknown Product'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                        <p className="text-lg font-bold text-brand">€{editingBooking.totalPrice}</p>
                      </div>
                    </div>

                    {/* Quantity and Payment Method in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <p className="text-gray-900">{editingBooking.quantity}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingBooking.paymentId
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {editingBooking.paymentId ? 'Payment Method Saved' : 'No Payment Method'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason </label>
                        <textarea
                          rows={2}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Enter reason for status change..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                        />
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Update Status To:</h4>
                      <div className="space-y-3">
                        {editingBooking.bookingStatus !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'confirmed')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            disabled={!editingBooking.paymentId}
                          >
                            <Check size={20} />
                            Confirm Booking & Charge Payment
                          </button>
                        )}
                        
                        {editingBooking.bookingStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'cancelled')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={20} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                      
                      {!editingBooking.paymentId && editingBooking.bookingStatus !== 'confirmed' && (
                        <p className="text-sm text-red-600 mt-2">
                          Cannot confirm booking without a saved payment method.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Current Status and Client in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingBooking.bookingStatus === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : editingBooking.bookingStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : editingBooking.bookingStatus === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {editingBooking.bookingStatus || 'pending'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                        <p className="text-gray-900">
                          {`${editingBooking.clientId?.firstName || ''} ${editingBooking.clientId?.lastName || ''}`.trim() || 'Unknown Client'}
                        </p>
                      </div>
                    </div>

                    {/* Total Amount and Payment Method in one row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                        <p className="text-lg font-bold text-brand">€{editingBooking.totalPrice}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          editingBooking.paymentId
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {editingBooking.paymentId ? 'Payment Method Saved' : 'No Payment Method'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Update Status To:</h4>
                      <div className="space-y-3">
                        {editingBooking.bookingStatus !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'confirmed')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            disabled={!editingBooking.paymentId}
                          >
                            <Check size={20} />
                            Confirm Booking & Charge Payment
                          </button>
                        )}
                        
                        {editingBooking.bookingStatus !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(editingBooking._id, 'cancelled')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={20} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                      
                      {!editingBooking.paymentId && editingBooking.bookingStatus !== 'confirmed' && (
                        <p className="text-sm text-red-600 mt-2">
                          Cannot confirm booking without a saved payment method.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </App>
  );
}
