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
  intervalMs = 3000,
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
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewAllLoading, setViewAllLoading] = useState(false);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRequest("/api/horse-market");
        const normalized = Array.isArray(data)
          ? data
              .filter(h => h?.status === "active") // Only show active horses
              .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
              .slice(0, 4)
              .map((h) => ({
                id: h?._id || h?.id,
                name: h?.horseName || "Horse",
                heading: h?.horseName || "Horse",
                breed: h?.breed || "",
                countryOfOrigin: h?.countryOfOrigin || "",
                breedType: h?.breedType || "",
                typicalUse: h?.typicalUse || "",
                popularity: h?.popularity || "",
                regionOfPopularity: h?.regionOfPopularity || "",
                gender: h?.gender || "",
                ageOrDOB: h?.ageOrDOB || "",
                color: h?.color || "",
                height: h?.height || 0,
                microchipNumber: h?.microchipNumber || "",
                passportRegistrationNo: h?.passportRegistrationNo || "",
                ueln: h?.ueln || "",
                images: Array.isArray(h?.photos) && h.photos.length > 0 ? h.photos : [],
                videos: Array.isArray(h?.videos) && h.videos.length > 0 ? h.videos : [],
                media: (() => {
                  const imageMedia = Array.isArray(h?.photos) && h.photos.length > 0 
                    ? h.photos.map(url => ({ type: 'image', url })) 
                    : [];
                  const videoMedia = Array.isArray(h?.videos) && h.videos.length > 0 
                    ? h.videos.map(url => ({ type: 'video', url })) 
                    : [];
                  return [...imageMedia, ...videoMedia];
                })(),
                price: typeof h?.askingPrice === "number" ? h.askingPrice : Number(h?.askingPrice) || 0,
                location: h?.countryAndCity || "",
                coordinates: h?.coordinates || null,
                status: h?.status || "active",
                temperament: h?.temperament || "",
                primaryDiscipline: h?.primaryDiscipline || "",
                trainingLevel: h?.trainingLevel || "",
                experienceLevel: h?.experienceLevel || "",
                riderSuitability: h?.riderSuitability || "",
                specialSkills: h?.specialSkills || "",
                competitionExperience: h?.competitionExperience || false,
                competitionResults: Array.isArray(h?.competitionResults) ? h.competitionResults : [],
                competitionVideos: Array.isArray(h?.competitionVideos) ? h.competitionVideos : [],
                healthStatus: h?.healthStatus || "",
                vaccinationStatus: h?.vaccinationStatus || "",
                insuranceStatus: h?.insuranceStatus || "",
                lastVetCheckDate: h?.lastVetCheckDate || "",
                vetReportUpload: Array.isArray(h?.vetReportUpload) ? h.vetReportUpload : [],
                vetScansReports: Array.isArray(h?.vetScansReports) ? h.vetScansReports : [],
                farrierOsteopathDentalDate: h?.farrierOsteopathDentalDate || "",
                wormingHistory: h?.wormingHistory || "",
                injuriesMedicalConditions: h?.injuriesMedicalConditions || "",
                vices: h?.vices || "",
                sire: h?.sire || "",
                dam: h?.dam || "",
                studbook: h?.studbook || "",
                breedingSuitability: h?.breedingSuitability || "",
                pedigreeDocuments: Array.isArray(h?.pedigreeDocuments) ? h.pedigreeDocuments : [],
                negotiable: h?.negotiable || false,
                trialAvailable: h?.trialAvailable || false,
                paymentTerms: h?.paymentTerms || "",
                transportAssistance: h?.transportAssistance || "",
                returnConditions: h?.returnConditions || "",
                ownerName: h?.userId ? `${h.userId.firstName || ''} ${h.userId.lastName || ''}`.trim() : '',
                ownerEmail: h?.userId?.email || '',
                ownerId: h?.userId?._id || h?.userId || '',
                sellerName: h?.sellerName || '',
                sellerType: h?.sellerType || '',
                contactPreferences: h?.contactPreferences || "",
                verificationStatus: h?.verificationStatus || "",
                ownershipConfirmation: h?.ownershipConfirmation || false,
                liabilityDisclaimer: h?.liabilityDisclaimer || false,
                welfareCompliance: h?.welfareCompliance || false,
              }))
          : [];
        setHorses(normalized);
      } catch (e) {
        setError("Failed to load horses");
      } finally {
        setLoading(false);
      }
    };
    fetchHorses();
  }, []);

  const openModal = (horse) => {
    setSelectedHorse(horse);
    setCurrentMediaIndex(0);
    setIsModalOpen(true);
    setIsVideoPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHorse(null);
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
      router.push('/market?type=horse');
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
    if (selectedHorse && selectedHorse.media) {
      setCurrentMediaIndex((prev) => {
        const next = (prev + 1) % selectedHorse.media.length;
        return next;
      });
      handleMediaChange();
    }
  };

  const prevMedia = () => {
    if (selectedHorse && selectedHorse.media) {
      setCurrentMediaIndex((prev) => {
        const prevIndex = (prev - 1 + selectedHorse.media.length) % selectedHorse.media.length;
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
  }, [isModalOpen, selectedHorse]);

  // Reset video state when media index changes
  useEffect(() => {
    if (selectedHorse && selectedHorse.media && selectedHorse.media[currentMediaIndex]) {
      const currentMedia = selectedHorse.media[currentMediaIndex];
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
  }, [currentMediaIndex, selectedHorse]);

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="items-center justify-items-center p-8 text-center">
          <h2 className="text-2xl font-semibold primary mb-4"> Explore Horses for Sale</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-0.5 bg-orange-300"></div>
            <div className="w-16 h-2 bg-secondary mx-2"></div>
            <div className="w-16 h-0.5 bg-orange-300"></div>
          </div>
          <p className="opacity-80">
            Newest listings from our horse market—Discover premium horses with detailed information, health records, and verified sellers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">Loading...</div>
          )}
          {!loading && error && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && horses.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">No horses found</div>
          )}
          {!loading && !error && horses.map((horse) => (
            <div key={horse.id} className="text-center px-4">
              {/* StackedPolaroid image design - exact match to original */}
              <div className="mb-6 flex justify-center">
                <StackedPolaroid 
                  images={horse.images}
                  alt={horse.name} 
                  width={285} 
                  height={198} 
                />
              </div>

              {/* Content below image */}
              <h3 className="text-xl font-bold secondary mb-3">
                {horse.name}
              </h3>
              <div className="flex justify-center mb-3">
                <div className="w-8 h-0.5 bg-secondary"></div>
                <div className="w-16 h-0.5 bg-gray-300 ml-2"></div>
              </div>
              <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                {horse.breed} {horse.gender ? `• ${horse.gender}` : ''}
              </p>
              {horse.location && (
                <p className="text-gray-500 text-xs mb-2">{horse.location.split(',').slice(0, 2).join(', ')}</p>
              )}
              <div className="mb-3">
                <span className="text-base font-semibold text-gray-800">€{horse.price.toLocaleString()}</span>
              </div>
              <Button 
                onClick={() => openModal(horse)} 
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

      {isModalOpen && selectedHorse && (
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
                  <h3 className="text-xl font-semibold secondary">{selectedHorse.heading}</h3>
                  {(selectedHorse.ownerName || selectedHorse.ownerEmail || selectedHorse.sellerName) && (
                    <p className="text-xs text-gray-500">
                      By {selectedHorse.sellerName || selectedHorse.ownerName || 'User'}
                      {selectedHorse.ownerEmail ? ` • ${selectedHorse.ownerEmail}` : ''}
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
                    {selectedHorse.media && selectedHorse.media.length > 0 ? (
                      selectedHorse.media[currentMediaIndex]?.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            ref={videoRef}
                            src={selectedHorse.media[currentMediaIndex].url}
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
                          src={selectedHorse.media[currentMediaIndex]?.url}
                          alt={`${selectedHorse.heading} - Media ${currentMediaIndex + 1}`}
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
                    {selectedHorse.media && selectedHorse.media.length > 1 && (
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
                    {selectedHorse.media && selectedHorse.media.length > 1 && (
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                        {currentMediaIndex + 1} / {selectedHorse.media.length}
                      </div>
                    )}

                    {/* Video Indicator */}
                    {selectedHorse.media && selectedHorse.media[currentMediaIndex]?.type === 'video' && (
                      <div className="absolute top-4 left-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs z-10 flex items-center gap-1">
                        <span>▶</span> Video
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg px-4 py-2 shadow-lg z-10">
                      <span className="text-lg font-bold text-gray-800">€{selectedHorse.price.toLocaleString()}</span>
                      {selectedHorse.negotiable && (
                        <span className="text-xs text-gray-600 block">Negotiable</span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {selectedHorse.media && selectedHorse.media.length > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {selectedHorse.media.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => selectMedia(index)}
                            className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              index === currentMediaIndex
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
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Basic Information</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      {selectedHorse.breed && <p><span className="font-medium">Breed:</span> {selectedHorse.breed}</p>}
                      {selectedHorse.gender && <p><span className="font-medium">Gender:</span> {selectedHorse.gender}</p>}
                      {selectedHorse.ageOrDOB && <p><span className="font-medium">Age/DOB:</span> {selectedHorse.ageOrDOB}</p>}
                      {selectedHorse.color && <p><span className="font-medium">Color:</span> {selectedHorse.color}</p>}
                      {selectedHorse.height > 0 && <p><span className="font-medium">Height:</span> {selectedHorse.height} cm</p>}
                      {selectedHorse.microchipNumber && <p><span className="font-medium">Microchip:</span> {selectedHorse.microchipNumber}</p>}
                      {selectedHorse.passportRegistrationNo && <p><span className="font-medium">Passport No:</span> {selectedHorse.passportRegistrationNo}</p>}
                      {selectedHorse.ueln && <p><span className="font-medium">UELN:</span> {selectedHorse.ueln}</p>}
                    </div>
                  </div>

                  {/* Breed Information */}
                  {(selectedHorse.countryOfOrigin || selectedHorse.breedType || selectedHorse.typicalUse || selectedHorse.popularity || selectedHorse.regionOfPopularity) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Breed Information</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.countryOfOrigin && <p><span className="font-medium">Country of Origin:</span> {selectedHorse.countryOfOrigin}</p>}
                        {selectedHorse.breedType && <p><span className="font-medium">Type:</span> {selectedHorse.breedType}</p>}
                        {selectedHorse.typicalUse && <p><span className="font-medium">Typical Use:</span> {selectedHorse.typicalUse}</p>}
                        {selectedHorse.popularity && <p><span className="font-medium">Popularity:</span> {selectedHorse.popularity}</p>}
                        {selectedHorse.regionOfPopularity && <p><span className="font-medium">Region of Popularity:</span> {selectedHorse.regionOfPopularity}</p>}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedHorse.location && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Location</h4>
                      <p className="text-sm text-gray-700">{selectedHorse.location}</p>
                    </div>
                  )}

                  {/* Training & Discipline */}
                  {(selectedHorse.primaryDiscipline || selectedHorse.trainingLevel || selectedHorse.experienceLevel) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Training & Discipline</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.primaryDiscipline && <p><span className="font-medium">Discipline:</span> {selectedHorse.primaryDiscipline}</p>}
                        {selectedHorse.trainingLevel && <p><span className="font-medium">Training Level:</span> {selectedHorse.trainingLevel}</p>}
                        {selectedHorse.experienceLevel && <p><span className="font-medium">Experience:</span> {selectedHorse.experienceLevel}</p>}
                        {selectedHorse.riderSuitability && <p><span className="font-medium">Rider Suitability:</span> {selectedHorse.riderSuitability}</p>}
                      </div>
                    </div>
                  )}

                  {/* Health Status */}
                  {(selectedHorse.healthStatus || selectedHorse.vaccinationStatus || selectedHorse.insuranceStatus) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Health Status</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.healthStatus && <p><span className="font-medium">Status:</span> {selectedHorse.healthStatus}</p>}
                        {selectedHorse.vaccinationStatus && <p><span className="font-medium">Vaccination:</span> {selectedHorse.vaccinationStatus}</p>}
                        {selectedHorse.insuranceStatus && <p><span className="font-medium">Insurance:</span> {selectedHorse.insuranceStatus}</p>}
                      </div>
                    </div>
                  )}

                  {/* Health Details */}
                  {(selectedHorse.lastVetCheckDate || selectedHorse.farrierOsteopathDentalDate || selectedHorse.wormingHistory || selectedHorse.injuriesMedicalConditions || selectedHorse.vices) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Health Details</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.lastVetCheckDate && <p><span className="font-medium">Last Vet Check:</span> {new Date(selectedHorse.lastVetCheckDate).toLocaleDateString()}</p>}
                        {selectedHorse.farrierOsteopathDentalDate && <p><span className="font-medium">Farrier/Dental Date:</span> {new Date(selectedHorse.farrierOsteopathDentalDate).toLocaleDateString()}</p>}
                        {selectedHorse.wormingHistory && <p><span className="font-medium">Worming History:</span> {selectedHorse.wormingHistory}</p>}
                        {selectedHorse.injuriesMedicalConditions && <p><span className="font-medium">Medical Conditions:</span> {selectedHorse.injuriesMedicalConditions}</p>}
                        {selectedHorse.vices && <p><span className="font-medium">Vices:</span> {selectedHorse.vices}</p>}
                      </div>
                    </div>
                  )}

                  {/* Pedigree & Breeding */}
                  {(selectedHorse.sire || selectedHorse.dam || selectedHorse.studbook || selectedHorse.breedingSuitability) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Pedigree & Breeding</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.sire && <p><span className="font-medium">Sire:</span> {selectedHorse.sire}</p>}
                        {selectedHorse.dam && <p><span className="font-medium">Dam:</span> {selectedHorse.dam}</p>}
                        {selectedHorse.studbook && <p><span className="font-medium">Studbook:</span> {selectedHorse.studbook}</p>}
                        {selectedHorse.breedingSuitability && <p><span className="font-medium">Breeding Suitability:</span> {selectedHorse.breedingSuitability}</p>}
                      </div>
                    </div>
                  )}

                  {/* Competition */}
                  {selectedHorse.competitionExperience && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Competition</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><span className="font-medium">Competition Experience:</span> Yes</p>
                        {selectedHorse.competitionResults && selectedHorse.competitionResults.length > 0 && (
                          <p><span className="font-medium">Results:</span> {selectedHorse.competitionResults.length} recorded</p>
                        )}
                        {selectedHorse.competitionVideos && selectedHorse.competitionVideos.length > 0 && (
                          <p><span className="font-medium">Competition Videos:</span> {selectedHorse.competitionVideos.length} available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {(selectedHorse.vetReportUpload?.length > 0 || selectedHorse.vetScansReports?.length > 0 || selectedHorse.pedigreeDocuments?.length > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Documents</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.vetReportUpload?.length > 0 && (
                          <p><span className="font-medium">Vet Reports:</span> {selectedHorse.vetReportUpload.length} file(s)</p>
                        )}
                        {selectedHorse.vetScansReports?.length > 0 && (
                          <p><span className="font-medium">Vet Scans:</span> {selectedHorse.vetScansReports.length} file(s)</p>
                        )}
                        {selectedHorse.pedigreeDocuments?.length > 0 && (
                          <p><span className="font-medium">Pedigree Documents:</span> {selectedHorse.pedigreeDocuments.length} file(s)</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Features - Only show if at least one feature exists */}
                  {((selectedHorse.negotiable === true) || 
                    (selectedHorse.trialAvailable === true) || 
                    (selectedHorse.paymentTerms && selectedHorse.paymentTerms.trim() !== '') ||
                    (selectedHorse.transportAssistance && selectedHorse.transportAssistance.trim() !== '') ||
                    (selectedHorse.ownershipConfirmation === true) ||
                    (selectedHorse.welfareCompliance === true) ||
                    (selectedHorse.liabilityDisclaimer === true)) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHorse.negotiable === true && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Negotiable</span>
                        )}
                        {selectedHorse.trialAvailable === true && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Trial Available</span>
                        )}
                        {selectedHorse.paymentTerms && selectedHorse.paymentTerms.trim() !== '' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{selectedHorse.paymentTerms}</span>
                        )}
                        {selectedHorse.transportAssistance && selectedHorse.transportAssistance.trim() !== '' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Transport: {selectedHorse.transportAssistance}</span>
                        )}
                        {selectedHorse.ownershipConfirmation === true && (
                          <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">Ownership Confirmed</span>
                        )}
                        {selectedHorse.welfareCompliance === true && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">Welfare Compliant</span>
                        )}
                        {selectedHorse.liabilityDisclaimer === true && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">Liability Disclaimer</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {(selectedHorse.returnConditions || selectedHorse.contactPreferences || selectedHorse.sellerType) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Additional Information</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        {selectedHorse.returnConditions && <p><span className="font-medium">Return Conditions:</span> {selectedHorse.returnConditions}</p>}
                        {selectedHorse.contactPreferences && <p><span className="font-medium">Contact Preference:</span> {selectedHorse.contactPreferences}</p>}
                        {selectedHorse.sellerType && <p><span className="font-medium">Seller Type:</span> {selectedHorse.sellerType}</p>}
                      </div>
                    </div>
                  )}

                  {/* Temperament */}
                  {selectedHorse.temperament && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Temperament</h4>
                      <p className="text-sm text-gray-700">{selectedHorse.temperament}</p>
                    </div>
                  )}

                  {/* Special Skills */}
                  {selectedHorse.specialSkills && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Special Skills</h4>
                      <p className="text-sm text-gray-700">{selectedHorse.specialSkills}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={() => {
                          closeModal();
                          router.push(`/bookingHoursAppointment?horseId=${selectedHorse.id}`);
                        }}
                        type="primary"
                        className="w-full px-6 py-3 bg-secondary text-white rounded-lg transition-colors duration-200 cursor-pointer hover:bg-secondary/90"
                        block
                      >
                        Book Appointment
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
