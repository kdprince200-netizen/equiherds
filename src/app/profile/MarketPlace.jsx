"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, X } from "lucide-react";
import { Select } from "antd";
import { getUserData } from "../utils/localStorage";
import { postRequest, uploadFiles, deleteRequest, putRequest, getRequest } from "@/service";
import { toast } from "react-hot-toast";

export default function MarketPlace() {
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [marketLimit, setMarketLimit] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const [form, setForm] = useState({
    productName: "",
    price: "",
    discount: "",
    totalStock: "",
    deliveryCharges: "",
    noOfDaysDelivery: "",
    details: "",
    mainCategory: "",
    subcategory: "",
    subSubcategory: "",
    photos: [],
    status: "active",
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  // Hierarchical category structure
  const categoryStructure = {
    "For the Horse": {
      "Tack & Equipment": [
        "Saddles (Dressage)",
        "Saddles (Jumping)",
        "Saddles (Eventing)",
        "Saddles (Western)",
        "Saddles (Endurance)",
        "Saddles (Pony)",
        "Bridles & Bits",
        "Reins & Girths",
        "Stirrup Leathers & Irons",
        "Breastplates & Martingales",
        "Saddle Pads & Numnahs",
        "Training & Lunging Equipment",
        "Halters & Lead Ropes",
        "Boots, Bandages & Protection",
        "Fly Masks & Ear Bonnets"
      ],
      "Blankets & Sheets": [
        "Stable Blankets",
        "Turnout Rugs",
        "Fly Sheets",
        "Coolers & Exercise Sheets",
        "Rain & Winter Rugs"
      ],
      "Supplements": [
        "General Health Supplements",
        "Joint & Mobility Supplements",
        "Hoof & Coat Supplements",
        "Digestive / Gut Health Supplements",
        "Vitamins & Minerals",
        "Electrolytes & Hydration",
        "Calming / Behavioral Supplements",
        "Performance / Endurance Supplements",
        "Reproductive / Breeding Supplements",
        "Senior Horse Supplements"
      ],
      "Feed Form": [
        "Pellets / Granules",
        "Muesli / Textured Feed",
        "Extruded Feed",
        "Cubes / Blocks",
        "Mash",
        "Alfalfa Pellets / Alfalfa Cubes",
        "Forage Replacer / Complete Feed",
        "Cereal Mix",
        "Oil-Coated Feed",
        "Fibrous Feed"
      ]
    },
    "For the Rider": {
      "Rider Apparel": [
        "Riding Breeches",
        "Show Shirts & Jackets",
        "Riding Gloves",
        "Casual & Training Wear",
        "Rain & Winter Wear"
      ],
      "Footwear & Safety": [
        "Riding Boots (Tall)",
        "Riding Boots (Short)",
        "Half Chaps & Gaiters",
        "Safety Helmets",
        "Body Protectors & Air Vests"
      ]
    },
    "Stable & Yard": {
      "Stable & Barn Essentials": [
        "Stable Tools & Equipment",
        "Haynets & Feed Accessories",
        "Watering & Feeding Systems",
        "Tack Room Storage & Organizers",
        "Bedding & Stable Mats",
        "Stable Safety Gear"
      ],
      "Grooming & Care": [
        "Grooming Kits & Brushes",
        "Shampoo & Coat Care",
        "Mane & Tail Care",
        "Hoof Care",
        "First Aid & Cooling Products",
        "Fly & Pest Control"
      ]
    },
    "Sport & Competition": {
      "Training & Schooling": [
        "Training Aids & Gadgets",
        "Lunging & Groundwork Tools"
      ],
      "Competition Essentials": [
        "Jumping Equipment",
        "Dressage Equipment",
        "Timing & Scoring Tools",
        "Horse Travel Gear"
      ]
    },
    "Gifts & Lifestyle": {
      "Equestrian Lifestyle & Gifts": [
        "Home Décor & Art",
        "Personalized Items",
        "Books & Journals",
        "Jewelry & Accessories",
        "Kids & Equestrian Toys",
        "Seasonal Gift Sets"
      ]
    }
  };

  // Get subcategories based on main category
  const getSubcategories = (mainCategory) => {
    if (!mainCategory || !categoryStructure[mainCategory]) return [];
    return Object.keys(categoryStructure[mainCategory]);
  };

  // Get sub-subcategories based on main category and subcategory
  const getSubSubcategories = (mainCategory, subcategory) => {
    if (!mainCategory || !subcategory || !categoryStructure[mainCategory] || !categoryStructure[mainCategory][subcategory]) return [];
    return categoryStructure[mainCategory][subcategory];
  };

  // Validation function
  const validateForm = () => {
    const errors = [];

    if (!form.productName?.trim()) errors.push("Product Name is required");
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errors.push("Valid Price is required");
    if (form.discount && (isNaN(form.discount) || Number(form.discount) < 0))
      errors.push("Discount must be a valid number");
    if (
      form.totalStock === "" ||
      form.totalStock === null ||
      form.totalStock === undefined ||
      isNaN(form.totalStock) ||
      Number(form.totalStock) < 0
    ) {
      errors.push("Total Stock must be a valid non-negative number");
    }
    if (
      form.deliveryCharges &&
      (isNaN(form.deliveryCharges) || Number(form.deliveryCharges) < 0)
    )
      errors.push("Delivery Charges must be a valid number");
    if (
      form.noOfDaysDelivery &&
      (isNaN(form.noOfDaysDelivery) || Number(form.noOfDaysDelivery) <= 0)
    )
      errors.push("Number of Days Delivery must be a valid positive number");
    if (!form.mainCategory) errors.push("Main Category is required");
    if (!form.subcategory) errors.push("Subcategory is required");
    if (!form.subSubcategory) errors.push("Sub-Subcategory is required");

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

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
          setMarketLimit(999999);
          return;
        }
        
        // Check if user has subscription
        if (userData.subscriptionId) {
          // Get subscription details
          const subscriptionResponse = await getRequest(`/api/subscriptions/${userData.subscriptionId}`);
          if (subscriptionResponse?.subscription) {
            const subscription = subscriptionResponse.subscription;
            setSubscriptionDetails(subscription);
            
            // Get market limit from subscription description
            const limit = subscription.description?.["Market"] || "0";
            
            // Convert limit to number, treating "Not Allowed" and "0" as 0
            if (limit === "Not Allowed" || limit === "0" || limit === 0) {
              setMarketLimit(0);
            } else {
              setMarketLimit(parseInt(limit) || 0);
            }
          }
        } else {
          // No subscription - set limit to 0
          setMarketLimit(0);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  // Function to check if user can add an equipment
  const canAddEquipment = () => {
    if (isSuperAdmin) return true;
    if (!subscriptionDetails) return false;
    
    const currentCount = equipments.length;
    return currentCount < marketLimit;
  };

  // Function to get market limit status
  const getMarketLimitStatus = () => {
    if (isSuperAdmin) return { canAdd: true, current: 0, limit: 999999 };
    if (!subscriptionDetails) return { canAdd: false, current: 0, limit: 0 };
    
    const currentCount = equipments.length;
    
    return {
      canAdd: currentCount < marketLimit,
      current: currentCount,
      limit: marketLimit
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // Check subscription limits for new equipments (not for editing)
    // Skip validation for superAdmin
    if (!editingId && !isSuperAdmin) {
      if (!subscriptionDetails) {
        toast.error("You need an active subscription to add equipment. Please subscribe first.");
        return;
      }
      if (!canAddEquipment()) {
        if (marketLimit === 0) {
          toast.error("Equipment listings are not allowed in your current subscription plan.");
        } else {
          toast.error(`Your equipment limit is full. Please upgrade your subscription to add more equipment.`);
        }
        return;
      }
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      if (validationErrors.length > 1) {
        console.warn("Additional validation errors:", validationErrors.slice(1));
        toast.error(`Please fix ${validationErrors.length} validation errors`);
      }
      return;
    }

    const tokenData = getUserData();
    const userId = tokenData?.id || null;
    if (!userId) return;

    setSubmitting(true);
    try {
      // Upload photos
      let uploadedPhotos = [];
      if (editingId) {
        // Keep previous images if no new ones
        if (form.photos && form.photos.length > 0) {
          uploadedPhotos = await uploadFiles(form.photos);
        } else if (prevImages && prevImages.length > 0) {
          uploadedPhotos = prevImages;
        }
      } else {
        if (form.photos && form.photos.length > 0) {
          uploadedPhotos = await uploadFiles(form.photos);
        }
      }

      const payload = {
        userId,
        productName: form.productName,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : 0,
        totalStock: form.totalStock !== "" ? Number(form.totalStock) : 0,
        deliveryCharges: form.deliveryCharges
          ? Number(form.deliveryCharges)
          : 0,
        noOfDaysDelivery: form.noOfDaysDelivery
          ? Number(form.noOfDaysDelivery)
          : 0,
        details: form.details || "",
        mainCategory: form.mainCategory,
        subcategory: form.subcategory,
        subSubcategory: form.subSubcategory,
        category: form.subSubcategory || form.subcategory || form.mainCategory, // Keep for backward compatibility
        photos: uploadedPhotos,
        status: form.status || "active",
      };

      if (editingId) {
        await putRequest(`/api/equipments/${editingId}`, payload);
        toast.success("Equipment updated successfully!");
      } else {
        await postRequest("/api/equipments", payload);
        toast.success("Equipment created successfully!");
      }

      // Reset form
      resetForm();
      setShowModal(false);
      loadEquipments();
    } catch (err) {
      console.error("Failed to submit equipment", err);
      toast.error(
        editingId
          ? "Failed to update equipment. Please try again."
          : "Failed to create equipment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      productName: "",
      price: "",
      discount: "",
    totalStock: "",
      deliveryCharges: "",
      noOfDaysDelivery: "",
      details: "",
      mainCategory: "",
      subcategory: "",
      subSubcategory: "",
      photos: [],
      status: "active",
    });
    setImagePreviews([]);
    setPrevImages([]);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(`/api/equipments/${id}`);
      setEquipments((prev) => prev.filter((e) => e.id !== id));
      toast.success("Equipment deleted successfully!");
    } catch (e) {
      console.error("Failed to delete equipment", e);
      toast.error("Failed to delete equipment. Please try again.");
    }
  };

  const handleEdit = (equipment) => {
    setForm({
      productName: equipment.productName || "",
      price: equipment.price || "",
      discount: equipment.discount || "",
      totalStock: equipment.totalStock ?? "",
      deliveryCharges: equipment.deliveryCharges || "",
      noOfDaysDelivery: equipment.noOfDaysDelivery || "",
      details: equipment.details || "",
      mainCategory: equipment.mainCategory || "",
      subcategory: equipment.subcategory || "",
      subSubcategory: equipment.subSubcategory || "",
      photos: [],
      status: equipment.status || "active",
    });
    setImagePreviews(equipment.photos || []);
    setPrevImages(equipment.photos || []);
    setEditingId(equipment.id);
    setShowModal(true);
  };

  const loadEquipments = async () => {
    const tokenData = getUserData();
    const userId = tokenData?.id || null;
    if (!userId) return;
    try {
      setLoadingList(true);
      const list = await getRequest(`/api/equipments?userId=${userId}`);
      if (Array.isArray(list)) {
        const mapped = list.map((e) => ({
          id: e._id,
          ...e,
        }));
        setEquipments(mapped);
        
        // After loading equipments, check subscription limits
        await fetchUserSubscriptionDetails();
      }
    } catch (e) {
      console.error("Failed to load equipments", e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  const calculateFinalPrice = (price, discount) => {
    if (!price) return 0;
    const p = Number(price);
    const d = Number(discount) || 0;
    return p - (p * d) / 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand">Products</h2>
          <p className="text-sm text-brand/80">
            Manage your equipment listings.
          </p>
        </div>
        <button
          className={`px-4 py-2 rounded font-medium transition ${
            (!isSuperAdmin && (equipments.length >= marketLimit || !subscriptionDetails || marketLimit === 0))
              ? 'bg-gray-400 !text-white cursor-not-allowed' 
              : 'bg-[color:var(--primary)] !text-white hover:bg-[color:var(--primary)]/90 cursor-pointer'
          }`}
          disabled={!isSuperAdmin && (equipments.length >= marketLimit || !subscriptionDetails || marketLimit === 0)}
          onClick={() => {
            // Skip validation for superAdmin
            if (!isSuperAdmin) {
              if (!subscriptionDetails) {
                window.location.href = '/subscription';
                return;
              }
              if (marketLimit === 0) {
                toast.error("Equipment listings are not allowed in your current subscription plan.");
                return;
              }
              // Check if current equipment count has reached the limit
              if (equipments.length >= marketLimit) {
                toast.error("Your equipment limit is full. Please upgrade your subscription to add more equipment.");
                return;
              }
            }
            resetForm();
            setShowModal(true);
          }}
        >
          {isSuperAdmin ? "+ Add New Product" : !subscriptionDetails ? "Get Subscription" : marketLimit === 0 ? "Not Allowed" : (equipments.length >= marketLimit) ? "Your Limit is Full" : "+ Add New Product"}
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
              <div className="mt-2">
                <div className="text-sm">
                  <div className="font-medium text-blue-700">Equipment Listings:</div>
                  <div className="text-blue-600">
                    {equipments.length} / {marketLimit === 0 ? "Not Allowed" : marketLimit}
                  </div>
                  {(equipments.length >= marketLimit) && marketLimit > 0 && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      You've reached your equipment limit for this plan.
                    </p>
                  )}
                </div>
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
                You have unlimited access to add equipment listings without subscription limits.
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
                You need an active subscription to add equipment listings.
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

      {loadingList ? (
        <div className="text-center py-8 text-brand">Loading...</div>
      ) : equipments.length === 0 ? (
        <div className="text-center py-8 text-brand">
          <p className="text-lg mb-2">No equipment listings found</p>
          <p className="text-sm text-brand/70">Add your first equipment listing to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <div
              key={equipment.id}
              className="bg-white rounded-lg border border-[color:var(--primary)] shadow-sm p-4 relative"
            >
              <div className="relative w-full h-40 mb-3 rounded overflow-hidden bg-gray-100">
                {equipment.photos && equipment.photos.length > 0 ? (
                  <img
                    src={equipment.photos[0]}
                    alt={equipment.productName}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-brand/40">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    title="Edit"
                    onClick={() => handleEdit(equipment)}
                  >
                    <Edit className="w-5 h-5 text-blue-600 cursor-pointer" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    title="Delete"
                    onClick={() => handleDelete(equipment.id)}
                  >
                    <Trash className="w-5 h-5 text-red-600 cursor-pointer" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-brand">
                {equipment.productName}
              </h3>
              <p className="text-sm text-brand/80 mb-2">
                {equipment.subSubcategory || equipment.subcategory || equipment.mainCategory || equipment.category}
              </p>
              <div className="flex items-center gap-2 mb-2">
                {equipment.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    €{Number(equipment.price).toLocaleString()}
                  </span>
                )}
                <span className="text-brand font-bold text-base">
                  €
                  {calculateFinalPrice(
                    equipment.price,
                    equipment.discount
                  ).toLocaleString()}
                </span>
                {equipment.discount > 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    -{equipment.discount}%
                  </span>
                )}
              </div>
              {equipment.deliveryCharges > 0 && (
                <p className="text-sm text-brand/70 mb-1">
                  Delivery: €{Number(equipment.deliveryCharges).toLocaleString()}
                </p>
              )}
              {equipment.noOfDaysDelivery > 0 && (
                <p className="text-sm text-brand/70 mb-2">
                  Delivery Time: {equipment.noOfDaysDelivery} day
                  {equipment.noOfDaysDelivery !== 1 ? "s" : ""}
                </p>
              )}
              {(equipment.totalStock || equipment.totalStock === 0) && (
                <p className="text-sm text-brand/70 mb-2">
                  Stock: {equipment.totalStock}
                </p>
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  equipment.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {equipment.status || "active"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-x-hidden overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-lg py-8 px-4 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-brand mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={form.productName}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Total Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalStock"
                    value={form.totalStock}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter available stock"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Delivery Charges
                  </label>
                  <input
                    type="number"
                    name="deliveryCharges"
                    value={form.deliveryCharges}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter delivery charges"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Number of Days Delivery
                  </label>
                  <input
                    type="number"
                    name="noOfDaysDelivery"
                    value={form.noOfDaysDelivery}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    placeholder="Enter delivery days"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Main Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={form.mainCategory || undefined}
                    onChange={(value) => {
                      setForm((prev) => ({ 
                        ...prev, 
                        mainCategory: value,
                        subcategory: "", // Reset subcategory when main category changes
                        subSubcategory: "" // Reset sub-subcategory when main category changes
                      }));
                    }}
                    placeholder="Select Main Category"
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={Object.keys(categoryStructure).map((cat) => ({
                      value: cat,
                      label: cat
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand mb-1">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={form.subcategory || undefined}
                    onChange={(value) => {
                      setForm((prev) => ({ 
                        ...prev, 
                        subcategory: value,
                        subSubcategory: "" // Reset sub-subcategory when subcategory changes
                      }));
                    }}
                    placeholder="Select Subcategory"
                    showSearch
                    allowClear
                    disabled={!form.mainCategory}
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={getSubcategories(form.mainCategory).map((subcat) => ({
                      value: subcat,
                      label: subcat
                    }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand mb-1">
                    Sub-Subcategory <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={form.subSubcategory || undefined}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, subSubcategory: value }));
                    }}
                    placeholder="Select Sub-Subcategory"
                    showSearch
                    allowClear
                    disabled={!form.subcategory}
                    style={{ width: '100%' }}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={getSubSubcategories(form.mainCategory, form.subcategory).map((subsubcat) => ({
                      value: subsubcat,
                      label: subsubcat
                    }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand mb-1">
                    Details
                  </label>
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                    rows={4}
                    placeholder="Enter product details"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand mb-1">
                    Photos
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full text-sm"
                  />
                  {(imagePreviews.length > 0 ||
                    (editingId && prevImages.length > 0)) && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(imagePreviews.length > 0
                        ? imagePreviews
                        : prevImages
                      ).slice(0, 5).map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-brand mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded text-white font-medium transition ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90"
                }`}
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}