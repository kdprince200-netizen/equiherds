"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Plus, X } from "lucide-react";
import { getUserData } from "../utils/localStorage";
import { postRequest, uploadFiles, deleteRequest, putRequest, getRequest } from "@/service";
import { Checkbox } from "antd";
import { toast } from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";

const dummy = [];

export default function OtherServices() {
  const [userSubscription, setUserSubscription] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [serviceLimits, setServiceLimits] = useState({
    "Equine Veterinarian": 0,
    "Farriers": 0,
    "Osteopaths": 0,
    "Dentists": 0
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const SERVICE_OPTIONS = {
    Vets: [
      { key: "generalHealthCheck", label: "General Health Check" },
      { key: "vaccinations", label: "Vaccinations" },
      { key: "emergencyCallOut", label: "Emergency Call-Out" },
      { key: "lamenessExam", label: "Lameness Exam" },
      { key: "ultrasoundImaging", label: "Ultrasound / Imaging" },
      { key: "castration", label: "Castration" },
    ],
    Farriers: [
      { key: "trimBarefoot", label: "Trim (Barefoot)" },
      { key: "frontShoesOnly", label: "Front Shoes Only" },
      { key: "fullSet", label: "Full Set (4 Shoes)" },
      { key: "correctiveShoeing", label: "Corrective / Orthopedic Shoeing" },
    ],
    Dentists: [
      { key: "basicFloat", label: "Basic Float (Manual)" },
      { key: "powerFloat", label: "Power Float (with sedation)" },
      { key: "wolfToothExtraction", label: "Wolf Tooth Extraction" },
    ],
    Osteopaths: [
      { key: "fullSession", label: "Full Osteopathic / Chiropractic Session" },
      { key: "massageSession", label: "Massage / Myotherapy Session" },
    ],
  };

  const labelForOption = (key) => {
    for (const group of Object.values(SERVICE_OPTIONS)) {
      const found = group.find((o) => o.key === key);
      if (found) return found.label;
    }
    return key;
  };

  const toFormServiceOptions = (apiOptions) => {
    // apiOptions shape: { key: number|null }
    if (!apiOptions || typeof apiOptions !== "object") return {};
    const result = {};
    for (const [k, v] of Object.entries(apiOptions)) {
      result[k] = { selected: true, price: v ?? "" };
    }
    return result;
  };
  const [items, setItems] = useState(dummy);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [prevImages, setPrevImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [form, setForm] = useState({
    title: "",
    details: "",
    serviceType: "",
    pricePerHour: "",
    experience: "",
    degree: "",
    location: "",
    coordinates: null,
    images: [],
    slots: [],
    status: "active",
    serviceOptions: {},
  });

  const [slotInput, setSlotInput] = useState({ day: "", startTime: "", endTime: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (coordinates) => setForm((p) => ({ ...p, coordinates }));
  const handleLocationTextChange = (locationText) => setForm((p) => ({ ...p, location: locationText }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleToggleService = (key, checked) => {
    const isChecked = !!(checked?.target?.checked ?? checked?.checked ?? checked);
    setForm((prev) => ({
      ...prev,
      serviceOptions: {
        ...prev.serviceOptions,
        [key]: {
          selected: isChecked,
          price: isChecked ? prev.serviceOptions?.[key]?.price || "" : "",
        },
      },
    }));
  };

  const handleServicePriceChange = (key, price) => {
    setForm((prev) => ({
      ...prev,
      serviceOptions: {
        ...prev.serviceOptions,
        [key]: {
          selected: true,
          price,
        },
      },
    }));
  };

  const handleAddSlot = () => {
    if (!slotInput.day || !slotInput.startTime || !slotInput.endTime) return;
    setForm((prev) => ({ ...prev, slots: [...(prev.slots || []), { ...slotInput }] }));
    setSlotInput({ day: "", startTime: "", endTime: "" });
  };
  const handleDeleteSlot = (idx) => {
    setForm((prev) => ({ ...prev, slots: prev.slots.filter((_, i) => i !== idx) }));
  };

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.details || !form.location || !form.coordinates || !form.pricePerHour || !form.serviceType) return;

    // Check subscription limits for new services (not for editing)
    // Skip validation for superAdmin
    if (!editingId && !isSuperAdmin) {
      if (!subscriptionDetails) {
        toast.error("You need an active subscription to add services. Please subscribe first.");
        return;
      }
      if (!canAddService(form.serviceType)) {
        const limit = serviceLimits[form.serviceType] || 0;
        if (limit === 0) {
          toast.error(`${form.serviceType} services are not allowed in your current subscription plan.`);
        } else {
          toast.error(`Your ${form.serviceType} limit is full. Please upgrade your subscription to add more ${form.serviceType} services.`);
        }
        return;
      }
    }

    const tokenData = getUserData();
    const userId = tokenData?.id || tokenData?.sub || tokenData?._id || null;
    if (!userId) return;

    const allSlots = form.slots && form.slots.length > 0 ? form.slots : [];
    if (allSlots.length === 0 && (!slotInput.day || !slotInput.startTime || !slotInput.endTime)) {
      toast.error("Please add at least one schedule slot.");
      return;
    }
    const finalSlots = [...allSlots];
    if (slotInput.day && slotInput.startTime && slotInput.endTime) finalSlots.push(slotInput);

    setSubmitting(true);
    try {
      let uploadedUrls = [];
      if (editingId) {
        if (form.images && form.images.length > 0) uploadedUrls = await uploadFiles(form.images);
        else if (prevImages && prevImages.length > 0) uploadedUrls = prevImages;
        else {
          toast.error("Please provide at least one image.");
          setSubmitting(false);
          return;
        }
      } else {
        if (!form.images || form.images.length === 0) {
          toast.error("Please provide at least one image.");
          setSubmitting(false);
          return;
        }
        uploadedUrls = await uploadFiles(form.images);
      }

      // build selected services map with numeric prices
      const selectedServices = Object.entries(form.serviceOptions || {})
        .filter(([, val]) => val && val.selected)
        .reduce((acc, [k, v]) => {
          const num = v.price !== "" && v.price !== null && v.price !== undefined ? Number(v.price) : null;
          acc[k] = typeof num === "number" && !Number.isNaN(num) ? num : null;
          return acc;
        }, {});

      const payload = {
        userId,
        title: form.title,
        details: form.details,
        serviceType: form.serviceType,
        pricePerHour: Number(form.pricePerHour),
        experience: form.experience,
        degree: form.degree,
        location: form.location,
        coordinates: form.coordinates ? { lat: form.coordinates.lat, lng: form.coordinates.lng } : null,
        status: form.status || "active",
        schedule: finalSlots,
        images: uploadedUrls,
        serviceOptions: selectedServices,
      };

      if (editingId) {
        await putRequest(`/api/otherService/${editingId}`, payload);
        setItems((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...payload, images: uploadedUrls, slots: payload.schedule } : s)));
        toast.success("Service updated");
      } else {
        const created = await postRequest("/api/otherService", payload);
        const newItem = {
          id: created?._id || Math.random().toString(36).slice(2),
          ...payload,
        };
        setItems((prev) => [newItem, ...prev]);
        toast.success("Service created");
      }

      resetForm();
      setShowModal(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to submit other service", err);
      toast.error("Action failed");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      title: "",
      details: "",
      serviceType: "",
      pricePerHour: "",
      experience: "",
      degree: "",
      location: "",
      coordinates: null,
      images: [],
      slots: [],
      status: "active",
      serviceOptions: {},
    });
    setImagePreviews([]);
    setPrevImages([]);
    setSlotInput({ day: "", startTime: "", endTime: "" });
  }

  function onEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      details: item.details || "",
      serviceType: item.serviceType || "",
      pricePerHour: item.pricePerHour || "",
      experience: item.experience || "",
      degree: item.degree || "",
      location: item.location || "",
      coordinates: item.coordinates || null,
      images: [],
      slots: item.slots || [],
      status: item.status || "active",
      serviceOptions: toFormServiceOptions(item.serviceOptions || {}),
    });
    setImagePreviews(item.images || []);
    setPrevImages(item.images || []);
    setSlotInput({ day: "", startTime: "", endTime: "" });
    setShowModal(true);
  }

  async function onDelete(id) {
    try {
      await deleteRequest(`/api/otherService/${id}`);
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete other service", e);
      toast.error("Delete failed");
    }
  }

  // Function to fetch user subscription details and check limits
  const fetchUserSubscriptionDetails = async () => {
    try {
      const user = getUserData();
      const userId = user?.userId || user?._id || user?.id;
      
      if (!userId) return;
      
      // Get user data with subscription info
      const userResponse = await getRequest(`/api/users?id=${userId}`);
      if (userResponse?.user) {
        const userData = userResponse.user;
        setUserSubscription(userData);
        
        // Check if user is superAdmin
        const isAdmin = userData.accountType === 'superAdmin';
        setIsSuperAdmin(isAdmin);
        
        // Skip subscription validation for superAdmin
        if (isAdmin) {
          setServiceLimits({
            "Equine Veterinarian": 999999,
            "Farriers": 999999,
            "Osteopaths": 999999,
            "Dentists": 999999
          });
          return;
        }
        
        // Check if user has subscription
        if (userData.subscriptionId) {
          // Get subscription details
          const subscriptionResponse = await getRequest(`/api/subscriptions/${userData.subscriptionId}`);
          if (subscriptionResponse?.subscription) {
            const subscription = subscriptionResponse.subscription;
            setSubscriptionDetails(subscription);
            
            // Get service limits from subscription description
            const limits = {
              "Equine Veterinarian": subscription.description?.["Equine Veterinarian"] || "0",
              "Farriers": subscription.description?.["Farriers"] || "0",
              "Osteopaths": subscription.description?.["Osteopaths"] || "0",
              "Dentists": subscription.description?.["Dentists"] || "0"
            };
            
            // Convert limits to numbers, treating "Not Allowed" and "0" as 0
            const processedLimits = {};
            Object.entries(limits).forEach(([key, value]) => {
              if (value === "Not Allowed" || value === "0" || value === 0) {
                processedLimits[key] = 0;
              } else {
                processedLimits[key] = parseInt(value) || 0;
              }
            });
            
            setServiceLimits(processedLimits);
          }
        } else {
          // No subscription - set all limits to 0
          setServiceLimits({
            "Equine Veterinarian": 0,
            "Farriers": 0,
            "Osteopaths": 0,
            "Dentists": 0
          });
        }
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  // Function to check if user can add a specific service type
  const canAddService = (serviceType) => {
    if (isSuperAdmin) return true;
    if (!subscriptionDetails) return false;
    
    const currentCount = items.filter(item => item.serviceType === serviceType).length;
    const limit = serviceLimits[serviceType] || 0;
    
    return currentCount < limit;
  };

  // Function to get service limit status
  const getServiceLimitStatus = (serviceType) => {
    if (isSuperAdmin) return { canAdd: true, current: 0, limit: 999999 };
    if (!subscriptionDetails) return { canAdd: false, current: 0, limit: 0 };
    
    const currentCount = items.filter(item => item.serviceType === serviceType).length;
    const limit = serviceLimits[serviceType] || 0;
    
    return {
      canAdd: currentCount < limit,
      current: currentCount,
      limit: limit
    };
  };

  useEffect(() => {
    async function loadByUser() {
      const tokenData = getUserData();
      const userId = tokenData?.id || null;
      if (!userId) return;
      try {
        setLoadingList(true);
        const res = await fetch(`/api/otherService?userId=${userId}`);
        const list = await res.json();
        if (Array.isArray(list)) {
          const mapped = list.map((t) => ({
            id: t._id,
            title: t.title,
            details: t.details,
            serviceType: t.serviceType,
            pricePerHour: t.pricePerHour,
            experience: t.experience,
            degree: t.degree || "",
            status: t.status || "active",
            rating: t.rating || 0,
            images: Array.isArray(t.images) ? t.images : [],
            slots: Array.isArray(t.schedule) ? t.schedule : [],
            location: t.location || "",
            coordinates: t.coordinates || null,
            serviceOptions: t.serviceOptions || {},
          }));
          setItems(mapped);
          
          // After loading services, check subscription limits
          await fetchUserSubscriptionDetails();
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load other services", e);
      } finally {
        setLoadingList(false);
      }
    }
    loadByUser();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand">Other Services</h2>
          <p className="text-sm text-brand/80">Add and manage Vet’s, Farriers, Osteopaths, Dentists.</p>
        </div>
        <button
          className={`px-4 py-2 rounded font-medium transition ${
            (!isSuperAdmin && !subscriptionDetails)
              ? 'bg-gray-400 !text-white cursor-not-allowed' 
              : 'bg-[color:var(--primary)] !text-white hover:bg-[color:var(--primary)]/90 cursor-pointer'
          }`}
          disabled={!isSuperAdmin && !subscriptionDetails}
          onClick={() => {
            // Skip validation for superAdmin
            if (!isSuperAdmin) {
              if (!subscriptionDetails) {
                window.location.href = '/subscription';
                return;
              }
            }
            setShowModal(true);
          }}
        >
          {isSuperAdmin ? "+ Add New" : !subscriptionDetails ? "Get Subscription" : "+ Add New"}
        </button>
      </div>

      {/* Subscription Info and Limit Display */}
      {subscriptionDetails && !isSuperAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                {subscriptionDetails.name} Plan
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {Object.entries(serviceLimits).map(([serviceType, limit]) => {
                  const status = getServiceLimitStatus(serviceType);
                  return (
                    <div key={serviceType} className="text-sm">
                      <div className="font-medium text-blue-700">{serviceType}:</div>
                      <div className="text-blue-600">
                        {status.current} / {limit === 0 ? "Not Allowed" : limit}
                      </div>
                      {!status.canAdd && limit > 0 && (
                        <div className="text-red-600 text-xs">Limit reached</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SuperAdmin Banner */}
      {isSuperAdmin && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Super Admin Access
              </h3>
              <p className="text-sm text-green-600">
                You have unlimited access to add all service types without subscription limits.
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Subscription Warning */}
      {!subscriptionDetails && userSubscription && !isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                No Active Subscription
              </h3>
              <p className="text-sm text-yellow-600">
                You need an active subscription to add services.
              </p>
            </div>
            <button
              onClick={() => {
                // Navigate to subscription page
                window.location.href = '/subscription';
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              Get Subscription
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-lg border border-[color:var(--primary)] shadow-sm p-4 relative">
            <div className="relative w-full h-40 mb-3 rounded overflow-hidden bg-gray-100">
              {it.images && it.images.length > 0 ? (
                <img src={it.images[0]} alt={it.title} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-brand/40">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-1 rounded hover:bg-gray-100" title="Edit" onClick={() => onEdit(it)}>
                  <Edit className="w-5 h-5 text-blue-600 cursor-pointer" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100" title="Delete" onClick={() => onDelete(it.id)}>
                  <Trash className="w-5 h-5 text-red-600 cursor-pointer" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-brand">{it.title}</h3>
            <p className="text-xs text-brand/70 mb-1">Type: {it.serviceType}</p>
            <p className="text-sm text-brand/80 mb-2">{it.details}</p>
            {it.location && (
              <p className="text-sm text-brand/70 mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {it.location}
              </p>
            )}
            {it.experience && (
              <p className="text-xs text-brand/70 mb-1"><span className="font-semibold">Experience:</span> {it.experience}</p>
            )}
            {it.degree && (
              <p className="text-xs text-brand/70 mb-2"><span className="font-semibold">Degree:</span> {it.degree}</p>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand font-bold text-base">{it.pricePerHour ? `€ ${Number(it.pricePerHour).toLocaleString()}/hr` : ""}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${it.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{it.status || 'active'}</span>
            </div>
            {it.slots && it.slots.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-brand/70">Slots:</span>
                <ul className="text-xs text-brand/80 mt-1 space-y-1">
                  {it.slots.map((slot, idx) => (
                    <li key={idx}>{slot.day} - {slot.startTime} to {slot.endTime}</li>
                  ))}
                </ul>
              </div>
            )}
            {it.serviceOptions && Object.keys(it.serviceOptions).length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-semibold text-brand/70">Services:</span>
                <ul className="text-xs text-brand/80 mt-1 space-y-1">
                  {Object.entries(it.serviceOptions).map(([k, price]) => (
                    <li key={k} className="flex items-center justify-between">
                      <span>{labelForOption(k)}</span>
                        {price !== null && price !== undefined && price !== "" ? (
                        <span className="font-medium">€ {Number(price).toLocaleString()}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-x-hidden">
          <div className="bg-white rounded-lg shadow-lg py-8 px-4 w-full max-w-4xl relative overflow-x-hidden">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => { resetForm(); setShowModal(false); }}
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-brand mb-4">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={submit} className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Details</label>
                <textarea name="details" value={form.details} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" rows={3} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Select Type</label>
                <select name="serviceType" value={form.serviceType} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" required>
                  <option value="">Select</option>
                  <option 
                    value="Vets" 
                    disabled={!isSuperAdmin && !canAddService("Equine Veterinarian")}
                  >
                    Equine Veterinarian {!isSuperAdmin && !canAddService("Equine Veterinarian") ? 
                      (serviceLimits["Equine Veterinarian"] === 0 ? "(Not Allowed)" : "(Limit Reached)") : ""}
                  </option>
                  <option 
                    value="Farriers" 
                    disabled={!isSuperAdmin && !canAddService("Farriers")}
                  >
                    Farriers {!isSuperAdmin && !canAddService("Farriers") ? 
                      (serviceLimits["Farriers"] === 0 ? "(Not Allowed)" : "(Limit Reached)") : ""}
                  </option>
                  <option 
                    value="Osteopaths" 
                    disabled={!isSuperAdmin && !canAddService("Osteopaths")}
                  >
                    Osteopaths {!isSuperAdmin && !canAddService("Osteopaths") ? 
                      (serviceLimits["Osteopaths"] === 0 ? "(Not Allowed)" : "(Limit Reached)") : ""}
                  </option>
                  <option 
                    value="Dentists" 
                    disabled={!isSuperAdmin && !canAddService("Dentists")}
                  >
                    Dentists {!isSuperAdmin && !canAddService("Dentists") ? 
                      (serviceLimits["Dentists"] === 0 ? "(Not Allowed)" : "(Limit Reached)") : ""}
                  </option>
                </select>
                {!isSuperAdmin && form.serviceType && !canAddService(form.serviceType) && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {serviceLimits[form.serviceType] === 0 
                      ? `${form.serviceType} services are not allowed in your current subscription plan.`
                      : `Your ${form.serviceType} limit is full. Please upgrade your subscription to add more ${form.serviceType} services.`
                    }
                  </div>
                )}
              </div>
              {form.serviceType && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h5 className="text-md font-semibold text-brand mb-3">Services</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(SERVICE_OPTIONS[form.serviceType] || []).map((opt) => {
                      const selected = Boolean(form.serviceOptions?.[opt.key]?.selected);
                      const priceVal = form.serviceOptions?.[opt.key]?.price || "";
                      return (
                    <div key={opt.key} className="flex items-center gap-3">
                      <Checkbox
                        checked={selected}
                        onChange={(e) => handleToggleService(opt.key, e)}
                      >
                        <span className="text-sm text-brand">{opt.label}</span>
                      </Checkbox>
                      {selected && (
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={priceVal}
                          onChange={(e) => handleServicePriceChange(opt.key, e.target.value)}
                          className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)] w-28 ml-auto"
                          placeholder="Price"
                        />
                      )}
                    </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand mb-1">Experience</label>
                  <input type="text" name="experience" value={form.experience} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" placeholder="e.g. 5 years" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand mb-1">Degree</label>
                  <input type="text" name="degree" value={form.degree} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" placeholder="e.g. DVM" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Location</label>
                <LocationPicker onLocationChange={handleLocationChange} onLocationTextChange={handleLocationTextChange} initialLocation={form.coordinates} initialLocationText={form.location} height="250px" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Per Hour Price</label>
                <input type="number" name="pricePerHour" value={form.pricePerHour} onChange={handleInputChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" min={0} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Available Slots</label>
                <div className="flex flex-wrap items-stretch gap-2 mb-2">
                  <select name="day" value={slotInput.day} onChange={(e)=>setSlotInput((p)=>({...p, day: e.target.value}))} className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)] flex-1 min-w-0">
                    <option value="">Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                  <input type="time" name="startTime" value={slotInput.startTime} onChange={(e)=>setSlotInput((p)=>({...p, startTime: e.target.value}))} className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)] flex-1 min-w-0" />
                  <input type="time" name="endTime" value={slotInput.endTime} onChange={(e)=>setSlotInput((p)=>({...p, endTime: e.target.value}))} className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)] flex-1 min-w-0" />
                  <button type="button" className="p-1 rounded bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 flex items-center shrink-0" onPointerDown={handleAddSlot} title="Add Slot">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {form.slots && form.slots.length > 0 && (
                  <ul className="space-y-1">
                    {form.slots.map((slot, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1 rounded">
                        <span>{slot.day} - {slot.startTime} to {slot.endTime}</span>
                        <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteSlot(idx)} title="Delete Slot">
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Images</label>
                <input type="file" name="images" accept="image/*" multiple onChange={handleImageChange} className="w-full text-sm" required={!editingId ? imagePreviews.length === 0 : false} />
                {(imagePreviews.length > 0 || (editingId && prevImages.length > 0)) && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(imagePreviews.length > 0 ? imagePreviews : prevImages).map((src, idx) => (
                      <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-14 h-14 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={submitting} className="w-full py-2 rounded bg-[color:var(--primary)] text-white font-medium hover:bg-[color:var(--primary)]/90 transition disabled:opacity-60">
                {submitting ? "Saving…" : editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


