"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getRequest } from "@/service";
import { getUserData } from "@/app/utils/localStorage";

export default function MarketPlaceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(10000);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Category structure matching the one in MarketPlace.jsx
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

  // Load user data on component mount
  useEffect(() => {
    const user = getUserData();
    setUserData(user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getRequest("/api/equipments");
        console.log("Raw API data:", data);
        console.log("Data type:", typeof data, "Is array:", Array.isArray(data));
        
        // Handle different response formats
        let dataArray = [];
        if (Array.isArray(data)) {
          dataArray = data;
        } else if (data && typeof data === 'object') {
          // If it's an object, try to extract array from common properties
          dataArray = data.data || data.items || data.equipments || [];
        }
        
        console.log("Data array length:", dataArray.length);
        
        const normalized = dataArray.map((d) => {
              // Handle images - can be from 'photos' field
              const images =
                Array.isArray(d?.photos) && d.photos.length > 0
                  ? d.photos
                  : ["/product/3.jpg"];

              // Calculate final price with discount
              const price = Number(d?.price || 0);
              const discount = Number(d?.discount || 0);
              const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

              const normalizedItem = {
                id: String(d?._id || d?.id || ""),
                productName: String(d?.productName || "Untitled Product"),
                details: String(d?.details || ""),
                price: price,
                discount: discount,
                finalPrice: finalPrice,
                deliveryCharges: Number(d?.deliveryCharges || 0),
                noOfDaysDelivery: Number(d?.noOfDaysDelivery || 0),
                images,
                image: images[0], // Keep first image for card display
                mainCategory: String(d?.mainCategory || "").trim(),
                subcategory: String(d?.subcategory || "").trim(),
                subSubcategory: String(d?.subSubcategory || "").trim(),
                category: String(d?.category || d?.subSubcategory || d?.subcategory || d?.mainCategory || "").trim(),
                status: d?.status || "active",
                userId: d?.userId || null,
                // Handle populated user data
                ownerName: d?.userId
                  ? `${d.userId.firstName || ""} ${d.userId.lastName || ""}`.trim()
                  : "",
                ownerEmail: d?.userId?.email || "",
              };
              
              return normalizedItem;
            });
        console.log("Normalized data count:", normalized.length);
        console.log("First normalized item:", normalized[0]);
        if (!cancelled) {
          setItems(normalized);
          console.log("Items state updated with", normalized.length, "items");
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load equipment");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const prices = items.map((s) => {
        const fp = typeof s.finalPrice === "number" ? s.finalPrice : 0;
        const p = typeof s.price === "number" ? s.price : 0;
        return fp > 0 ? fp : p;
      });
      const max = prices.length > 0 ? Math.max(...prices) : 0;
      if (max > 0) {
        setPriceMin(0);
        setPriceMax(max);
      }
    }
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    console.log("Filtering with:", { 
      itemsCount: items.length, 
      search: term, 
      priceMin, 
      priceMax, 
      selectedMainCategory, 
      selectedSubcategory, 
      selectedSubSubcategory 
    });
    
    const result = items.filter((s) => {
      // Search filter
      const matchesSearch = term
        ? (s.productName || "").toLowerCase().includes(term) ||
          (s.details || "").toLowerCase().includes(term) ||
          (s.category || "").toLowerCase().includes(term) ||
          (s.mainCategory || "").toLowerCase().includes(term) ||
          (s.subcategory || "").toLowerCase().includes(term) ||
          (s.subSubcategory || "").toLowerCase().includes(term)
        : true;
      
      // Price filter - handle case where priceMax might be 0 or undefined
      const price = typeof s.finalPrice === "number" ? s.finalPrice : (typeof s.price === "number" ? s.price : 0);
      const maxPrice = priceMax > 0 ? priceMax : 100000; // Fallback to large number if priceMax is 0
      const matchesPrice = price >= priceMin && price <= maxPrice;
      
      // Category filters - case-insensitive and handle empty strings
      const matchesMainCategory = !selectedMainCategory || 
        (s.mainCategory && s.mainCategory.trim().toLowerCase() === selectedMainCategory.trim().toLowerCase());
      const matchesSubcategory = !selectedSubcategory || 
        (s.subcategory && s.subcategory.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase());
      const matchesSubSubcategory = !selectedSubSubcategory || 
        (s.subSubcategory && s.subSubcategory.trim().toLowerCase() === selectedSubSubcategory.trim().toLowerCase());
      
      // Status filter - show active or if status is missing/undefined (for backward compatibility)
      // Be very lenient with status - only filter out if explicitly "inactive"
      const matchesStatus = s.status !== "inactive";
      
      const matches = matchesSearch && matchesPrice && matchesMainCategory && 
             matchesSubcategory && matchesSubSubcategory && matchesStatus;
      
      return matches;
    });
    
    console.log("Filtered result:", result.length, "of", items.length);
    return result;
  }, [items, search, priceMin, priceMax, selectedMainCategory, selectedSubcategory, selectedSubSubcategory]);

  function handleReset() {
    if (items.length > 0) {
      const prices = items.map((s) => (typeof s.finalPrice === "number" ? s.finalPrice : (typeof s.price === "number" ? s.price : 0)));
      const max = prices.length ? Math.max(...prices) : 0;
      setPriceMin(0);
      setPriceMax(max || 10000);
    } else {
      setPriceMin(0);
      setPriceMax(10000);
    }
    setSearch("");
    setSelectedMainCategory("");
    setSelectedSubcategory("");
    setSelectedSubSubcategory("");
  }

  function handleEquipmentClick(equipment) {
    setSelectedEquipment(equipment);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedEquipment(null);
    setCurrentImageIndex(0);
  }

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (selectedEquipment && selectedEquipment.images) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % selectedEquipment.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedEquipment && selectedEquipment.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + selectedEquipment.images.length) %
          selectedEquipment.images.length
      );
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    if (isModalOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, selectedEquipment]);


  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <aside className="md:col-span-4 lg:col-span-3">
        <div className="sticky top-24 rounded-xl border border-gray-200 bg-white/60 p-5 shadow-sm backdrop-blur">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand">Filters</h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-brand"
            >
              Reset
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="equipment-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              id="equipment-search"
              type="text"
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            />
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Price Range
              </span>
              <span className="text-xs text-gray-500">
                {priceMin === 0 ? 'Any' : `€${priceMin.toLocaleString()}`} - €{priceMax.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="min-price"
                  className="mb-1 block text-xs text-gray-500"
                >
                  Min
                </label>
                <input
                  id="min-price"
                  type="number"
                  min={0}
                  max={priceMax}
                  value={priceMin}
                  onClick={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleanValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0', 10);
                    setPriceMin(Math.max(0, Math.min(cleanValue, priceMax)));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
                />
              </div>
              <div>
                <label
                  htmlFor="max-price"
                  className="mb-1 block text-xs text-gray-500"
                >
                  Max
                </label>
                <input
                  id="max-price"
                  type="number"
                  min={priceMin}
                  max={100000}
                  value={priceMax}
                  onClick={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleanValue = value === '' ? 10000 : parseInt(value.replace(/^0+/, '') || '10000', 10);
                    setPriceMax(Math.max(priceMin, Math.min(cleanValue, 100000)));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="main-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Main Category <span className="text-red-500">*</span>
            </label>
            <select
              id="main-category"
              value={selectedMainCategory}
              onChange={(e) => {
                setSelectedMainCategory(e.target.value);
                setSelectedSubcategory("");
                setSelectedSubSubcategory("");
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Categories</option>
              {Object.keys(categoryStructure).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {selectedMainCategory && (
            <div className="mb-6">
              <label
                htmlFor="subcategory"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory"
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedSubSubcategory("");
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
              >
                <option value="">All Subcategories</option>
                {getSubcategories(selectedMainCategory).map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedMainCategory && selectedSubcategory && (
            <div className="mb-6">
              <label
                htmlFor="sub-subcategory"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sub-Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="sub-subcategory"
                value={selectedSubSubcategory}
                onChange={(e) => setSelectedSubSubcategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
              >
                <option value="">All Sub-Subcategories</option>
                {getSubSubcategories(selectedMainCategory, selectedSubcategory).map((subsubcat) => (
                  <option key={subsubcat} value={subsubcat}>
                    {subsubcat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </aside>

      <section className="md:col-span-8 lg:col-span-9">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Equipment • Showing <span className="font-medium text-brand">{filtered.length}</span> of {items.length}
          </p>
          <div className="text-xs text-gray-400">Updated just now</div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-gray-500">Loading equipment...</div>
        )}

        {/* Debug info - remove in production */}
        {!loading && (
          <div className="mb-4 text-xs text-gray-400">
            Debug: Total items: {items.length} | Filtered: {filtered.length} | Price range: {priceMin}-{priceMax}
          </div>
        )}

        {filtered.length === 0 && !loading && items.length > 0 && (
          <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
            No items match your filters. Try adjusting your search or filters. (Total items: {items.length})
          </div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((equipment) => (
            <article
              key={equipment.id}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer"
              onClick={() => handleEquipmentClick(equipment)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={equipment.image}
                  alt={equipment.productName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {equipment.discount > 0 && (
                  <div className="absolute top-2 right-2 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                    -{equipment.discount}%
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-brand line-clamp-2">
                    {equipment.productName}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {equipment.subSubcategory || equipment.subcategory || equipment.mainCategory || equipment.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {equipment.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      €{equipment.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-lg font-bold text-brand">
                    €{equipment.finalPrice.toLocaleString()}
                  </span>
                </div>
                {equipment.deliveryCharges > 0 && (
                  <p className="text-xs text-gray-500">
                    Delivery: €{equipment.deliveryCharges.toLocaleString()}
                  </p>
                )}
                {equipment.noOfDaysDelivery > 0 && (
                  <p className="text-xs text-gray-500">
                    Delivery: {equipment.noOfDaysDelivery} day{equipment.noOfDaysDelivery !== 1 ? "s" : ""}
                  </p>
                )}
                <div className="mt-auto pt-1">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-gray-600">No equipment found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </section>

      {/* Modal for Equipment Details */}
      {isModalOpen && selectedEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Gallery */}
              <div className="relative aspect-square bg-gray-100">
                {selectedEquipment.images && selectedEquipment.images.length > 0 ? (
                  <>
                    <img
                      src={selectedEquipment.images[currentImageIndex]}
                      alt={selectedEquipment.productName}
                      className="h-full w-full object-cover"
                    />
                    {selectedEquipment.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedEquipment.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectImage(idx);
                              }}
                              className={`h-2 w-2 rounded-full transition ${
                                idx === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-brand">
                    {selectedEquipment.productName}
      </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedEquipment.subSubcategory || selectedEquipment.subcategory || selectedEquipment.mainCategory || selectedEquipment.category}
                  </p>
                </div>

                <div className="mb-4 flex items-center gap-3">
                  {selectedEquipment.discount > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      €{selectedEquipment.price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-brand">
                    €{selectedEquipment.finalPrice.toLocaleString()}
                  </span>
                  {selectedEquipment.discount > 0 && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      -{selectedEquipment.discount}% OFF
                    </span>
                  )}
                </div>

                {selectedEquipment.details && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedEquipment.details}
                    </p>
                  </div>
                )}

                <div className="mb-4 space-y-2 text-sm">
                  {selectedEquipment.deliveryCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges:</span>
                      <span className="font-medium">€{selectedEquipment.deliveryCharges.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedEquipment.noOfDaysDelivery > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-medium">
                        {selectedEquipment.noOfDaysDelivery} day{selectedEquipment.noOfDaysDelivery !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3 border-t pt-4">
                  {selectedEquipment.ownerName && (
                    <div>
                      <p className="text-xs text-gray-500">Seller</p>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedEquipment.ownerName}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/bookingEquipment?equipmentId=${selectedEquipment.id}`;
                    }}
                    className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
