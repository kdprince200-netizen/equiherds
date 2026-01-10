"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import { getRequest } from "@/service";

// StackedPolaroid component for exact image design match
const StackedPolaroid = ({
  src,
  images,
  alt = "",
  width = 285,
  height = 198,
  intervalMs = 5000,
  pauseOnHover = true,
}) => {
  const imageList = Array.isArray(images) && images.length > 0 ? images : (src ? [src] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasImages = imageList.length > 0;

  useEffect(() => {
    if (imageList.length <= 1) return;
    const timer = setInterval(() => {
      if (!pauseOnHover || !isPaused) {
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [imageList.length, intervalMs, isPaused, pauseOnHover]);

  const currentSrc = imageList.length ? imageList[currentIndex] : src;

  return (
    <div
      className="relative inline-block select-none w-[305px] h-[198px]"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="absolute bg-white rounded-md w-[305px] h-[198px] border border-gray-200/60 shadow-lg"
        style={{
          left: '-14px',
          top: '-10px',
          transform: 'rotate(-4deg)',
        }}
        aria-hidden
      />
      <div
        className="absolute bg-white rounded-md w-[305px] h-[198px] border border-gray-200/60 shadow-md"
        style={{
          left: '-8px',
          top: '-6px',
          transform: 'rotate(3deg)',
        }}
        aria-hidden
      />

      {/* main "photo" card */}
      <div className="relative bg-white rounded-md w-[305px] h-[198px] shadow-2xl border border-gray-200/80">
        {/* inner white frame to create that thicker photo border */}
        <div className="w-full h-full p-2.5 rounded-md overflow-hidden bg-white">
          {hasImages ? (
            <Image
              src={currentSrc}
              alt={alt}
              width={285}
              height={178}
              className="object-cover rounded-sm w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-sm">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Coach = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewAllLoading, setViewAllLoading] = useState(false);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRequest("/api/equipments");
        if (!Array.isArray(data)) {
          setEquipments([]);
          return;
        }

        // Filter active equipments and map them
        const allEquipments = data
          .filter(e => e?.status === "active")
          .map((e) => {
            const price = typeof e?.price === "number" ? e.price : Number(e?.price) || 0;
            const discount = typeof e?.discount === "number" ? e.discount : Number(e?.discount) || 0;
            const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

            return {
              id: e?._id || e?.id,
              name: e?.productName || "Equipment",
              heading: e?.productName || "Equipment",
              productName: e?.productName || "Equipment",
              details: e?.details || "",
              price: price,
              discount: discount,
              finalPrice: finalPrice,
              deliveryCharges: typeof e?.deliveryCharges === "number" ? e.deliveryCharges : Number(e?.deliveryCharges) || 0,
              noOfDaysDelivery: typeof e?.noOfDaysDelivery === "number" ? e.noOfDaysDelivery : Number(e?.noOfDaysDelivery) || 0,
              totalStock: typeof e?.totalStock === "number" ? e.totalStock : Number(e?.totalStock) || 0,
              mainCategory: e?.mainCategory || "",
              subcategory: e?.subcategory || "",
              subSubcategory: e?.subSubcategory || "",
              category: e?.category || e?.subSubcategory || e?.subcategory || e?.mainCategory || "",
              images: Array.isArray(e?.photos) && e.photos.length > 0 ? e.photos : [],
              media: (() => {
                const imageMedia = Array.isArray(e?.photos) && e.photos.length > 0
                  ? e.photos.map(url => ({ type: 'image', url }))
                  : [];
                return imageMedia;
              })(),
              status: e?.status || "active",
              ownerName: e?.userId ? `${e.userId.firstName || ''} ${e.userId.lastName || ''}`.trim() : '',
              ownerEmail: e?.userId?.email || '',
              ownerId: e?.userId?._id || e?.userId || '',
              rating: typeof e?.Rating === "number" ? e.Rating : (typeof e?.rating === "number" ? e.rating : 0),
              sponsoredType: e?.sponsoredType || "",
              isSponsored: e?.sponsoredType === "sponsored",
            };
          });

        // Separate sponsored and non-sponsored
        const sponsored = allEquipments.filter(e => e.isSponsored).slice(0, 2);
        const nonSponsored = allEquipments.filter(e => !e.isSponsored);

        // Sort non-sponsored by rating (descending)
        nonSponsored.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        // Combine: first 2 sponsored, then fill remaining slots with highest rated
        const remainingSlots = 4 - sponsored.length;
        const topRated = nonSponsored.slice(0, remainingSlots);

        const normalized = [...sponsored, ...topRated].slice(0, 4);
        setEquipments(normalized);
      } catch (e) {
        setError("Failed to load equipment");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

  const openModal = (equipment) => {
    setSelectedEquipment(equipment);
    setCurrentMediaIndex(0);
    setIsModalOpen(true);
    setIsVideoPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
      setIsVideoPlaying(true);
    }
  };

  const handleMediaChange = () => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleViewAll = async () => {
    setViewAllLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/market?type=equipment');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setViewAllLoading(false);
    }
  };

  const selectMedia = (index) => {
    setCurrentMediaIndex(index);
    handleMediaChange();
  };

  const nextMedia = () => {
    if (selectedEquipment && selectedEquipment.media) {
      setCurrentMediaIndex((prev) => {
        const next = (prev + 1) % selectedEquipment.media.length;
        return next;
      });
      handleMediaChange();
    }
  };

  const prevMedia = () => {
    if (selectedEquipment && selectedEquipment.media) {
      setCurrentMediaIndex((prev) => {
        const prevIndex = (prev - 1 + selectedEquipment.media.length) % selectedEquipment.media.length;
        return prevIndex;
      });
      handleMediaChange();
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "ArrowRight") nextMedia();
    };
    if (isModalOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, selectedEquipment]);

  // Reset video state when media index changes
  useEffect(() => {
    if (selectedEquipment && selectedEquipment.media && selectedEquipment.media[currentMediaIndex]) {
      const currentMedia = selectedEquipment.media[currentMediaIndex];
      if (currentMedia.type === 'video') {
        setIsVideoPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      } else {
        setIsVideoPlaying(false);
      }
    }
  }, [currentMediaIndex, selectedEquipment]);

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="items-center justify-items-center p-8 text-center">
          <h2 className="text-2xl font-semibold primary mb-4"> Explore Equipment Marketplace</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-0.5 bg-orange-300"></div>
            <div className="w-16 h-2 bg-secondary mx-2"></div>
            <div className="w-16 h-0.5 bg-orange-300"></div>
          </div>
          <p className="opacity-80">
            Newest listings from our equipment marketplace—Discover premium equipment with detailed information and verified sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">Loading...</div>
          )}
          {!loading && error && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && equipments.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">No equipment found</div>
          )}
          {!loading && !error && equipments.map((equipment) => (
            <div key={equipment.id} className="text-center px-4 relative">
              {/* Sponsored Badge */}
              {equipment.isSponsored && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  ⭐ Sponsored
                </div>
              )}
              {/* StackedPolaroid image design - exact match to original */}
              <div className="mb-6 flex justify-center">
                <StackedPolaroid
                  images={equipment.images}
                  alt={equipment.name}
                  width={285}
                  height={198}
                />
              </div>

              {/* Content below image */}
              <h3 className="text-xl font-bold secondary mb-3">
                {equipment.name}
              </h3>
              <div className="flex justify-center mb-3">
                <div className="w-8 h-0.5 bg-secondary"></div>
                <div className="w-16 h-0.5 bg-gray-300 ml-2"></div>
              </div>
              {equipment.category && (
                <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                  {equipment.category}
                </p>
              )}
              <div className="mb-3">
                {equipment.discount > 0 ? (
                  <div>
                    <span className="text-base font-semibold text-gray-800 line-through text-gray-400 mr-2">€{equipment.price.toLocaleString()}</span>
                    <span className="text-base font-semibold text-red-600">€{equipment.finalPrice.toLocaleString()}</span>
                    <span className="text-xs text-red-600 ml-1">({equipment.discount}% off)</span>
                  </div>
                ) : (
                  <span className="text-base font-semibold text-gray-800">€{equipment.price.toLocaleString()}</span>
                )}
              </div>
              <Button
                onClick={() => openModal(equipment)}
                className="secondary font-medium text-sm transition-colors duration-200 border border-secondary rounded p-2 cursor-pointer"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleViewAll}
            loading={viewAllLoading}
            type="primary"
            className="bg-secondary text-white px-8 py-3 rounded-md transition-colors duration-200 font-medium text-lg cursor-pointer"
            size="large"
          >
            View All
          </Button>
        </div>
      </div>

      {isModalOpen && selectedEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-xl font-semibold secondary">{selectedEquipment.heading}</h3>
                  {(selectedEquipment.ownerName || selectedEquipment.ownerEmail) && (
                    <p className="text-xs text-gray-500">
                      By {selectedEquipment.ownerName || 'User'}
                      {selectedEquipment.ownerEmail ? ` • ${selectedEquipment.ownerEmail}` : ''}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Media Gallery Section */}
              <div className="lg:w-2/3">
                {/* Large Main Media (Image or Video) */}
                <div className="relative bg-gray-100">
                  <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                    {selectedEquipment.media && selectedEquipment.media.length > 0 ? (
                      selectedEquipment.media[currentMediaIndex]?.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            src={selectedEquipment.media[currentMediaIndex].url}
                            controls={isVideoPlaying}
                            className="w-full h-full object-cover"
                            playsInline
                            preload="metadata"
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                            onEnded={() => setIsVideoPlaying(false)}
                          />
                          {!isVideoPlaying && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-20"
                              onClick={handlePlayVideo}
                            >
                              <button
                                className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                                aria-label="Play video"
                              >
                                <svg
                                  className="w-12 h-12 text-secondary ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Image
                          src={selectedEquipment.media[currentMediaIndex]?.url}
                          alt={`${selectedEquipment.heading} - Media ${currentMediaIndex + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover transition-all duration-300"
                          priority
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-sm">No media available</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {selectedEquipment.media && selectedEquipment.media.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 z-10"
                          aria-label="Previous media"
                        >
                          ‹
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 z-10"
                          aria-label="Next media"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Media Counter */}
                    {selectedEquipment.media && selectedEquipment.media.length > 1 && (
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                        {currentMediaIndex + 1} / {selectedEquipment.media.length}
                      </div>
                    )}

                    {/* Video Indicator */}
                    {selectedEquipment.media && selectedEquipment.media[currentMediaIndex]?.type === 'video' && (
                      <div className="absolute top-4 left-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs z-10 flex items-center gap-1">
                        <span>▶</span> Video
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-4 py-2 shadow-lg z-10">
                      {selectedEquipment.discount > 0 ? (
                        <div>
                          <span className="text-lg font-bold text-gray-800 line-through text-gray-400">€{selectedEquipment.price.toLocaleString()}</span>
                          <span className="text-lg font-bold text-red-600 block">€{selectedEquipment.finalPrice.toLocaleString()}</span>
                          <span className="text-xs text-red-600">{selectedEquipment.discount}% off</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">€{selectedEquipment.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedEquipment.media && selectedEquipment.media.length > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {selectedEquipment.media.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => selectMedia(index)}
                            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === currentMediaIndex
                                ? 'border-secondary shadow-md scale-105'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            {item.type === 'video' ? (
                              <>
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                  playsInline
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <span className="text-white text-lg">▶</span>
                                </div>
                              </>
                            ) : (
                              <Image
                                src={item.url}
                                alt={`Thumbnail ${index + 1}`}
                                width={80}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {index === currentMediaIndex && (
                              <div className="absolute inset-0 bg-secondary/20"></div>
                            )}
                            {item.type === 'video' && (
                              <div className="absolute bottom-1 right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                                ▶
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/3 p-6 overflow-y-auto max-h-[400px] lg:max-h-[500px]">
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Product Information</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">Product Name:</span> {selectedEquipment.productName}</p>
                      {selectedEquipment.mainCategory && <p><span className="font-medium">Main Category:</span> {selectedEquipment.mainCategory}</p>}
                      {selectedEquipment.subcategory && <p><span className="font-medium">Subcategory:</span> {selectedEquipment.subcategory}</p>}
                      {selectedEquipment.subSubcategory && <p><span className="font-medium">Sub-subcategory:</span> {selectedEquipment.subSubcategory}</p>}
                      {selectedEquipment.category && <p><span className="font-medium">Category:</span> {selectedEquipment.category}</p>}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Pricing</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      {selectedEquipment.discount > 0 ? (
                        <>
                          <p><span className="font-medium">Original Price:</span> <span className="line-through text-gray-400">€{selectedEquipment.price.toLocaleString()}</span></p>
                          <p><span className="font-medium">Discounted Price:</span> <span className="text-red-600 font-semibold">€{selectedEquipment.finalPrice.toLocaleString()}</span></p>
                          <p><span className="font-medium">Discount:</span> <span className="text-red-600">{selectedEquipment.discount}%</span></p>
                        </>
                      ) : (
                        <p><span className="font-medium">Price:</span> €{selectedEquipment.price.toLocaleString()}</p>
                      )}
                      {selectedEquipment.deliveryCharges > 0 && (
                        <p><span className="font-medium">Delivery Charges:</span> €{selectedEquipment.deliveryCharges.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Stock & Delivery */}
                  {(selectedEquipment.totalStock > 0 || selectedEquipment.noOfDaysDelivery > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Stock & Delivery</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedEquipment.totalStock > 0 && (
                          <p><span className="font-medium">Stock Available:</span> {selectedEquipment.totalStock} unit(s)</p>
                        )}
                        {selectedEquipment.noOfDaysDelivery > 0 && (
                          <p><span className="font-medium">Delivery Time:</span> {selectedEquipment.noOfDaysDelivery} day(s)</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  {selectedEquipment.details && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Product Details</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEquipment.details}</p>
                    </div>
                  )}

                  {/* Seller Info */}
                  {(selectedEquipment.ownerName || selectedEquipment.ownerEmail) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Seller Information</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedEquipment.ownerName && <p><span className="font-medium">Seller:</span> {selectedEquipment.ownerName}</p>}
                        {selectedEquipment.ownerEmail && <p><span className="font-medium">Email:</span> {selectedEquipment.ownerEmail}</p>}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={() => {
                          if (selectedEquipment?.id) {
                            closeModal();
                            router.push(`/bookingEquipment?equipmentId=${selectedEquipment.id}`);
                          } else {
                            console.error('Equipment ID not found');
                          }
                        }}
                        type="primary"
                        className="w-full px-6 py-3 bg-secondary text-white rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary/90"
                        block
                      >
                        Book Equipment
                      </Button>
                      <Button
                        onClick={closeModal}
                        type="default"
                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg transition-colors duration-200 cursor-pointer"
                        block
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Coach;
