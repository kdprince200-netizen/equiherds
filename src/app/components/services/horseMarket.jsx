"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Checkbox } from "antd";
import { getRequest } from "@/service";
import { getUserData } from "@/app/utils/localStorage";

export default function HorseMarketList() {
  const router = useRouter();
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedBreedType, setSelectedBreedType] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedHealthStatus, setSelectedHealthStatus] = useState("");
  const [selectedTrainingLevel, setSelectedTrainingLevel] = useState("");
  const [selectedPrimaryDiscipline, setSelectedPrimaryDiscipline] = useState("");
  const [selectedRiderSuitability, setSelectedRiderSuitability] = useState("");
  const [selectedVaccinationStatus, setSelectedVaccinationStatus] = useState("");
  const [selectedInsuranceStatus, setSelectedInsuranceStatus] = useState("");
  const [selectedCountryOfOrigin, setSelectedCountryOfOrigin] = useState("");
  const [selectedPopularity, setSelectedPopularity] = useState("");
  const [selectedRegionOfPopularity, setSelectedRegionOfPopularity] = useState("");
  const [selectedTypicalUse, setSelectedTypicalUse] = useState("");
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("");
  const [selectedTransportAssistance, setSelectedTransportAssistance] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [competitionExperience, setCompetitionExperience] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [trialAvailable, setTrialAvailable] = useState(false);
  
  // Near me filter
  const [userLocation, setUserLocation] = useState(null);
  const [useNearMe, setUseNearMe] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [geoError, setGeoError] = useState("");

  const [selectedHorse, setSelectedHorse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Load user data
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
        const data = await getRequest("/api/horse-market");
        const normalized = Array.isArray(data)
          ? data
              .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
              .map((h) => {
                const images = Array.isArray(h?.photos) && h.photos.length > 0 ? h.photos : ["/product/3.jpg"];
                const videos = Array.isArray(h?.videos) && h.videos.length > 0 ? h.videos : [];
                const media = [
                  ...images.map(url => ({ type: 'image', url })),
                  ...videos.map(url => ({ type: 'video', url }))
                ];

                return {
                  id: String(h?._id || ""),
                  name: String(h?.horseName || "Horse"),
                  breed: String(h?.breed || ""),
                  breedType: String(h?.breedType || ""),
                  countryOfOrigin: String(h?.countryOfOrigin || ""),
                  popularity: String(h?.popularity || ""),
                  regionOfPopularity: String(h?.regionOfPopularity || ""),
                  typicalUse: String(h?.typicalUse || ""),
                  gender: String(h?.gender || ""),
                  ageOrDOB: String(h?.ageOrDOB || ""),
                  color: String(h?.color || ""),
                  height: Number(h?.height || 0),
                  images,
                  videos,
                  media,
                  price: typeof h?.askingPrice === "number" ? h.askingPrice : Number(h?.askingPrice) || 0,
                  location: String(h?.countryAndCity || ""),
                  coordinates: h?.coordinates || null,
                  status: String(h?.status || "active"),
                  temperament: String(h?.temperament || ""),
                  primaryDiscipline: String(h?.primaryDiscipline || ""),
                  trainingLevel: String(h?.trainingLevel || ""),
                  experienceLevel: String(h?.experienceLevel || ""),
                  riderSuitability: String(h?.riderSuitability || ""),
                  specialSkills: String(h?.specialSkills || ""),
                  healthStatus: String(h?.healthStatus || ""),
                  vaccinationStatus: String(h?.vaccinationStatus || ""),
                  insuranceStatus: String(h?.insuranceStatus || ""),
                  competitionExperience: Boolean(h?.competitionExperience || false),
                  negotiable: Boolean(h?.negotiable || false),
                  trialAvailable: Boolean(h?.trialAvailable || false),
                  paymentTerms: String(h?.paymentTerms || ""),
                  transportAssistance: String(h?.transportAssistance || ""),
                  ownerName: h?.userId ? `${h.userId.firstName || ''} ${h.userId.lastName || ''}`.trim() : '',
                  ownerEmail: h?.userId?.email || '',
                  sellerName: String(h?.sellerName || ''),
                  sellerType: String(h?.sellerType || ''),
                };
              })
          : [];
        if (!cancelled) setHorses(normalized);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load horses");
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
    const prices = horses.map((h) => (typeof h.price === "number" ? h.price : 0));
    const max = prices.length ? Math.max(...prices) : 0;
    setPriceMin(0);
    setPriceMax(max);
    setSearch("");
    setSelectedGender("");
    setSelectedBreed("");
    setSelectedBreedType("");
    setSelectedExperienceLevel("");
    setSelectedHealthStatus("");
    setSelectedTrainingLevel("");
    setSelectedPrimaryDiscipline("");
    setSelectedRiderSuitability("");
    setSelectedVaccinationStatus("");
    setSelectedInsuranceStatus("");
    setSelectedCountryOfOrigin("");
    setSelectedPopularity("");
    setSelectedRegionOfPopularity("");
    setSelectedTypicalUse("");
    setSelectedPaymentTerms("");
    setSelectedTransportAssistance("");
    setSelectedSellerType("");
    setCompetitionExperience(false);
    setNegotiable(false);
    setTrialAvailable(false);
    setUseNearMe(false);
    setUserLocation(null);
    setRadiusKm(50);
    setGeoError("");
  }, [horses]);

  // Predefined options from HourseMarket.jsx form
  const breedOptions = [
    'Dutch Warmblood (KWPN)',
    'Andalusian (Pura Raza Española)',
    'Hanoverian',
    'Holsteiner',
    'Oldenburg',
    'Westphalian',
    'Trakehner',
    'Thoroughbred',
    'Arabian',
    'Quarter Horse',
    'Friesian',
    'Irish Sport Horse',
    'Selle Français',
    'Belgian Warmblood',
    'Swedish Warmblood',
    'Danish Warmblood',
    'Lusitano',
    'Lipizzaner',
    'Percheron',
    'Clydesdale',
    'Shire',
    'Paint Horse',
    'Appaloosa',
    'Tennessee Walking Horse',
    'Morgan',
    'American Saddlebred',
    'Standardbred',
    'Mustang',
    'Welsh Pony',
    'Shetland Pony',
    'Connemara Pony',
    'Akhal-Teke',
    'Cleveland Bay',
    'Fjord',
    'Haflinger',
    'Icelandic Horse',
    'Knapstrupper',
    'Norwegian Fjord',
    'Paso Fino',
    'Pinto',
    'Rocky Mountain Horse',
    'Suffolk Punch',
    'Welsh Cob',
    'Other'
  ];

  const breedTypeOptions = [
    'Warmblood',
    'Light horse',
    'Baroque',
    'Pony',
    'Draft',
    'Sport Horse',
    'Gaited',
    'Other'
  ];

  const typicalUseOptions = [
    'Dressage',
    'Jumping',
    'Eventing',
    'Racing',
    'Breeding',
    'Endurance',
    'Western Riding',
    'Ranch Work',
    'Pleasure',
    'Trail',
    'Driving',
    'Leisure',
    "Children's Riding",
    'Heavy Work',
    'Farm Work',
    'Logging',
    'Show',
    'Other'
  ];

  const popularityOptions = [
    'Very High',
    'High',
    'Medium',
    'Low'
  ];

  const regionOfPopularityOptions = [
    'Western Europe',
    'Central Europe',
    'Worldwide',
    'Southern Europe',
    'Ireland, UK',
    'France',
    'Europe',
    'North America',
    'Northern Europe',
    'Eastern Europe',
    'Asia',
    'South America',
    'Australia',
    'Other'
  ];

  const experienceLevelOptions = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const riderSuitabilityOptions = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const healthStatusOptions = [
    'Healthy',
    'Condition disclosed'
  ];

  const vaccinationStatusOptions = [
    'Up to date',
    'Not up to date'
  ];

  const insuranceStatusOptions = [
    'Insured',
    'Not Insured'
  ];

  const paymentTermsOptions = [
    'Deposit',
    'Installment',
    'Full Payment'
  ];

  const transportAssistanceOptions = [
    'Provided',
    'Not Provided'
  ];

  const sellerTypeOptions = [
    'Private',
    'Professional',
    'Stable'
  ];

  // Get unique values for filters that are text inputs (dynamic)
  const uniqueTrainingLevels = useMemo(() => {
    const levels = new Set(horses.map(h => h.trainingLevel).filter(Boolean));
    return Array.from(levels).sort();
  }, [horses]);

  const uniquePrimaryDisciplines = useMemo(() => {
    const disciplines = new Set(horses.map(h => h.primaryDiscipline).filter(Boolean));
    return Array.from(disciplines).sort();
  }, [horses]);

  const uniqueCountriesOfOrigin = useMemo(() => {
    const countries = new Set(horses.map(h => h.countryOfOrigin).filter(Boolean));
    return Array.from(countries).sort();
  }, [horses]);

  // Haversine distance in KM
  function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = horses
      .map((h) => {
        let _distance = null;
        if (
          useNearMe &&
          userLocation &&
          h.coordinates &&
          typeof h.coordinates.lat === 'number' &&
          typeof h.coordinates.lng === 'number'
        ) {
          _distance = haversineKm(
            userLocation.lat,
            userLocation.lng,
            h.coordinates.lat,
            h.coordinates.lng
          );
        }
        return { ...h, _distance };
      })
      .filter((h) => {
        const matchesSearch = term
          ? (h.name || "").toLowerCase().includes(term) ||
            (h.breed || "").toLowerCase().includes(term) ||
            (h.location || "").toLowerCase().includes(term)
          : true;
        
        const price = typeof h.price === "number" ? h.price : 0;
        const matchesPrice = price >= priceMin && price <= priceMax;
        
        const matchesGender = !selectedGender || h.gender.toLowerCase() === selectedGender.toLowerCase();
        const matchesBreed = !selectedBreed || h.breed.toLowerCase() === selectedBreed.toLowerCase();
        const matchesBreedType = !selectedBreedType || h.breedType.toLowerCase() === selectedBreedType.toLowerCase();
        const matchesExperience = !selectedExperienceLevel || h.experienceLevel.toLowerCase() === selectedExperienceLevel.toLowerCase();
        const matchesHealth = !selectedHealthStatus || h.healthStatus.toLowerCase() === selectedHealthStatus.toLowerCase();
        const matchesTrainingLevel = !selectedTrainingLevel || h.trainingLevel.toLowerCase() === selectedTrainingLevel.toLowerCase();
        const matchesPrimaryDiscipline = !selectedPrimaryDiscipline || h.primaryDiscipline.toLowerCase() === selectedPrimaryDiscipline.toLowerCase();
        const matchesRiderSuitability = !selectedRiderSuitability || h.riderSuitability.toLowerCase() === selectedRiderSuitability.toLowerCase();
        const matchesVaccinationStatus = !selectedVaccinationStatus || h.vaccinationStatus.toLowerCase() === selectedVaccinationStatus.toLowerCase();
        const matchesInsuranceStatus = !selectedInsuranceStatus || h.insuranceStatus.toLowerCase() === selectedInsuranceStatus.toLowerCase();
        const matchesCountryOfOrigin = !selectedCountryOfOrigin || h.countryOfOrigin.toLowerCase() === selectedCountryOfOrigin.toLowerCase();
        const matchesPopularity = !selectedPopularity || h.popularity.toLowerCase() === selectedPopularity.toLowerCase();
        const matchesRegionOfPopularity = !selectedRegionOfPopularity || h.regionOfPopularity.toLowerCase() === selectedRegionOfPopularity.toLowerCase();
        const matchesTypicalUse = !selectedTypicalUse || h.typicalUse.toLowerCase() === selectedTypicalUse.toLowerCase();
        const matchesPaymentTerms = !selectedPaymentTerms || h.paymentTerms.toLowerCase() === selectedPaymentTerms.toLowerCase();
        const matchesTransportAssistance = !selectedTransportAssistance || h.transportAssistance.toLowerCase() === selectedTransportAssistance.toLowerCase();
        const matchesSellerType = !selectedSellerType || h.sellerType.toLowerCase() === selectedSellerType.toLowerCase();
        const matchesCompetitionExperience = !competitionExperience || h.competitionExperience === true;
        const matchesNegotiable = !negotiable || h.negotiable === true;
        const matchesTrial = !trialAvailable || h.trialAvailable === true;
        
        const matchesNearMe = !useNearMe || (typeof h._distance === 'number' && h._distance <= radiusKm);
        
        return matchesSearch && matchesPrice && matchesGender && matchesBreed && matchesBreedType &&
               matchesExperience && matchesHealth && matchesTrainingLevel && matchesPrimaryDiscipline &&
               matchesRiderSuitability && matchesVaccinationStatus && matchesInsuranceStatus &&
               matchesCountryOfOrigin && matchesPopularity && matchesRegionOfPopularity && matchesTypicalUse &&
               matchesPaymentTerms && matchesTransportAssistance && matchesSellerType &&
               matchesCompetitionExperience && matchesNegotiable && matchesTrial && 
               matchesNearMe && h.status === "active";
      });

    if (useNearMe) {
      return base.sort((a, b) => {
        const da = typeof a._distance === 'number' ? a._distance : Number.POSITIVE_INFINITY;
        const db = typeof b._distance === 'number' ? b._distance : Number.POSITIVE_INFINITY;
        return da - db;
      });
    }
    return base;
  }, [horses, search, priceMin, priceMax, selectedGender, selectedBreed, selectedBreedType, selectedExperienceLevel, selectedHealthStatus, selectedTrainingLevel, selectedPrimaryDiscipline, selectedRiderSuitability, selectedVaccinationStatus, selectedInsuranceStatus, selectedCountryOfOrigin, selectedPopularity, selectedRegionOfPopularity, selectedTypicalUse, selectedPaymentTerms, selectedTransportAssistance, selectedSellerType, competitionExperience, negotiable, trialAvailable, useNearMe, radiusKm, userLocation]);

  function handleReset() {
    const prices = horses.map((h) => (typeof h.price === "number" ? h.price : 0));
    const max = prices.length ? Math.max(...prices) : 0;
    setSearch("");
    setPriceMin(0);
    setPriceMax(max);
    setSelectedGender("");
    setSelectedBreed("");
    setSelectedBreedType("");
    setSelectedExperienceLevel("");
    setSelectedHealthStatus("");
    setSelectedTrainingLevel("");
    setSelectedPrimaryDiscipline("");
    setSelectedRiderSuitability("");
    setSelectedVaccinationStatus("");
    setSelectedInsuranceStatus("");
    setSelectedCountryOfOrigin("");
    setSelectedPopularity("");
    setSelectedRegionOfPopularity("");
    setSelectedTypicalUse("");
    setSelectedPaymentTerms("");
    setSelectedTransportAssistance("");
    setSelectedSellerType("");
    setCompetitionExperience(false);
    setNegotiable(false);
    setTrialAvailable(false);
    setUseNearMe(false);
    setUserLocation(null);
    setRadiusKm(50);
    setGeoError("");
  }

  function handleUseMyLocation() {
    setGeoError("");
    if (!navigator?.geolocation) {
      setGeoError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setUseNearMe(true);
      },
      (err) => {
        setGeoError(err?.message || "Unable to get your location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handleHorseClick(horse) {
    setSelectedHorse(horse);
    setCurrentMediaIndex(0);
    setIsModalOpen(true);
    setIsVideoPlaying(false);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedHorse(null);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
      setIsVideoPlaying(true);
    }
  };

  const selectMedia = (index) => {
    setCurrentMediaIndex(index);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const nextMedia = () => {
    if (selectedHorse && selectedHorse.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % selectedHorse.media.length);
      setIsVideoPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const prevMedia = () => {
    if (selectedHorse && selectedHorse.media) {
      setCurrentMediaIndex((prev) => (prev - 1 + selectedHorse.media.length) % selectedHorse.media.length);
      setIsVideoPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
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
              htmlFor="horse-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              id="horse-search"
              type="text"
              placeholder="Search horses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            />
          </div>

          {/* Near Me */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Near me</label>
              {useNearMe && userLocation && (
                <span className="text-xs text-gray-500">{radiusKm} km</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                Use my location
              </button>
              {useNearMe && (
                <button
                  type="button"
                  onClick={() => { setUseNearMe(false); setUserLocation(null); }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="mt-3">
              <label htmlFor="radius" className="mb-1 block text-xs text-gray-500">Radius (km)</label>
              <input
                id="radius"
                type="number"
                min={1}
                max={500}
                value={radiusKm}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value === '' ? 1 : parseInt(value.replace(/^0+/, '') || '1', 10);
                  setRadiusKm(Math.max(1, Math.min(cleanValue, 500)));
                }}
                disabled={!useNearMe}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring disabled:opacity-50"
              />
              <div className="mt-2">
                <label className="mb-1 block text-xs text-gray-500">Status</label>
                <div className="text-xs text-gray-600 py-2">
                  {useNearMe ? (userLocation ? "Location set" : "Waiting for permission…") : "Off"}
                </div>
              </div>
            </div>
            {geoError && (
              <div className="mt-2 text-xs text-red-600">{geoError}</div>
            )}
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Price Range
              </span>
              <span className="text-xs text-gray-500">
                {priceMin === 0 ? 'Any' : `€${priceMin}`} - €{priceMax}
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
                  max={1000000}
                  value={priceMax}
                  onClick={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = e.target.value;
                    const cleanValue = value === '' ? 0 : parseInt(value.replace(/^0+/, '') || '0', 10);
                    setPriceMax(Math.max(priceMin, cleanValue));
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="gender-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender-filter"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Genders</option>
              <option value="Mare">Mare</option>
              <option value="Stallion">Stallion</option>
              <option value="Gelding">Gelding</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="breed-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Breed
            </label>
            <select
              id="breed-filter"
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Breeds</option>
              {breedOptions.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="breed-type-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Breed Type
            </label>
            <select
              id="breed-type-filter"
              value={selectedBreedType}
              onChange={(e) => setSelectedBreedType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Types</option>
              {breedTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="experience-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Experience Level
            </label>
            <select
              id="experience-filter"
              value={selectedExperienceLevel}
              onChange={(e) => setSelectedExperienceLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Levels</option>
              {experienceLevelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="training-level-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Training Level
            </label>
            <select
              id="training-level-filter"
              value={selectedTrainingLevel}
              onChange={(e) => setSelectedTrainingLevel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Levels</option>
              {uniqueTrainingLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="primary-discipline-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Primary Discipline
            </label>
            <select
              id="primary-discipline-filter"
              value={selectedPrimaryDiscipline}
              onChange={(e) => setSelectedPrimaryDiscipline(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Disciplines</option>
              {uniquePrimaryDisciplines.map((discipline) => (
                <option key={discipline} value={discipline}>
                  {discipline}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="rider-suitability-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Rider Suitability
            </label>
            <select
              id="rider-suitability-filter"
              value={selectedRiderSuitability}
              onChange={(e) => setSelectedRiderSuitability(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Levels</option>
              {riderSuitabilityOptions.map((suitability) => (
                <option key={suitability} value={suitability}>
                  {suitability}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="health-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Health Status 
            </label>
            <select
              id="health-filter"
              value={selectedHealthStatus}
              onChange={(e) => setSelectedHealthStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Statuses</option>
              <option value="Healthy">Healthy</option>
              <option value="Condition disclosed">Condition disclosed</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="vaccination-status-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Vaccination Status
            </label>
            <select
              id="vaccination-status-filter"
              value={selectedVaccinationStatus}
              onChange={(e) => setSelectedVaccinationStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Statuses</option>
              {vaccinationStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="insurance-status-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Insurance Status
            </label>
            <select
              id="insurance-status-filter"
              value={selectedInsuranceStatus}
              onChange={(e) => setSelectedInsuranceStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Statuses</option>
              {insuranceStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="country-of-origin-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Country of Origin
            </label>
            <select
              id="country-of-origin-filter"
              value={selectedCountryOfOrigin}
              onChange={(e) => setSelectedCountryOfOrigin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Countries</option>
              {uniqueCountriesOfOrigin.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="popularity-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Popularity
            </label>
            <select
              id="popularity-filter"
              value={selectedPopularity}
              onChange={(e) => setSelectedPopularity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All</option>
              {popularityOptions.map((popularity) => (
                <option key={popularity} value={popularity}>
                  {popularity}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="region-of-popularity-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Region of Popularity
            </label>
            <select
              id="region-of-popularity-filter"
              value={selectedRegionOfPopularity}
              onChange={(e) => setSelectedRegionOfPopularity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Regions</option>
              {regionOfPopularityOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="typical-use-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Typical Use
            </label>
            <select
              id="typical-use-filter"
              value={selectedTypicalUse}
              onChange={(e) => setSelectedTypicalUse(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Uses</option>
              {typicalUseOptions.map((use) => (
                <option key={use} value={use}>
                  {use}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="payment-terms-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Payment Terms
            </label>
            <select
              id="payment-terms-filter"
              value={selectedPaymentTerms}
              onChange={(e) => setSelectedPaymentTerms(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Terms</option>
              {paymentTermsOptions.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="transport-assistance-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Transport Assistance
            </label>
            <select
              id="transport-assistance-filter"
              value={selectedTransportAssistance}
              onChange={(e) => setSelectedTransportAssistance(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Options</option>
              {transportAssistanceOptions.map((assist) => (
                <option key={assist} value={assist}>
                  {assist}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="seller-type-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Seller Type
            </label>
            <select
              id="seller-type-filter"
              value={selectedSellerType}
              onChange={(e) => setSelectedSellerType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
            >
              <option value="">All Types</option>
              {sellerTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <Checkbox
              checked={competitionExperience}
              onChange={(e) => setCompetitionExperience(e.target.checked)}
              className="text-sm font-medium text-gray-700"
            >
              Competition Experience
            </Checkbox>
          </div>

          <div className="mb-6">
            <Checkbox
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
              className="text-sm font-medium text-gray-700"
            >
              Negotiable Price
            </Checkbox>
          </div>

          <div className="mb-4">
            <Checkbox
              checked={trialAvailable}
              onChange={(e) => setTrialAvailable(e.target.checked)}
              className="text-sm font-medium text-gray-700"
            >
              Trial Available
            </Checkbox>
          </div>
        </div>
      </aside>

      <section className="md:col-span-8 lg:col-span-9">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Horses • Showing{" "}
            <span className="font-medium text-brand">{filtered.length}</span> of{" "}
            {horses.length}
          </p>
          <div className="text-xs text-gray-400">Updated just now</div>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-gray-500">Loading horses...</div>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((horse) => (
            <article
              key={horse.id}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer"
              onClick={() => handleHorseClick(horse)}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={horse.images[0]}
                  alt={horse.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-brand">
                    {horse.name}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {typeof horse._distance === 'number' && isFinite(horse._distance) && (
                      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 border border-blue-200">
                        {horse._distance.toFixed(1)} km
                      </span>
                    )}
                    <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                      €{horse.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {horse.breed} {horse.gender ? `• ${horse.gender}` : ''}
                </p>
                {horse.location && (
                  <p className="text-xs text-gray-500">
                    {horse.location.split(',').slice(0, 2).join(', ')}
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
          <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
            No horses match your filters.
          </div>
        )}
      </section>

      {/* Modal */}
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
                  <h3 className="text-xl font-semibold text-brand">
                    {selectedHorse.name}
                  </h3>
                  {(selectedHorse.ownerName || selectedHorse.ownerEmail || selectedHorse.sellerName) && (
                    <p className="text-xs text-gray-500">
                      By {selectedHorse.sellerName || selectedHorse.ownerName || "User"}
                      {selectedHorse.ownerEmail
                        ? ` • ${selectedHorse.ownerEmail}`
                        : ""}
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
                                  className="w-12 h-12 text-brand ml-1" 
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
                          src={selectedHorse.media[currentMediaIndex]?.url || "/product/3.jpg"}
                          alt={`${selectedHorse.name} - Media ${currentMediaIndex + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover transition-all duration-300"
                          priority
                        />
                      )
                    ) : (
                      <Image
                        src="/product/3.jpg"
                        alt={selectedHorse.name}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover transition-all duration-300"
                        priority
                      />
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
                                ? 'border-brand shadow-md scale-105'
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
                              <div className="absolute inset-0 bg-brand/20"></div>
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
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Price</h4>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brand">
                        €{selectedHorse.price.toLocaleString()}
                      </p>
                      {selectedHorse.negotiable && (
                        <p className="text-xs text-gray-600">Negotiable</p>
                      )}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Basic Information</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      {selectedHorse.breed && <p><span className="font-medium">Breed:</span> {selectedHorse.breed}</p>}
                      {selectedHorse.breedType && <p><span className="font-medium">Breed Type:</span> {selectedHorse.breedType}</p>}
                      {selectedHorse.countryOfOrigin && <p><span className="font-medium">Country of Origin:</span> {selectedHorse.countryOfOrigin}</p>}
                      {selectedHorse.popularity && <p><span className="font-medium">Popularity:</span> {selectedHorse.popularity}</p>}
                      {selectedHorse.regionOfPopularity && <p><span className="font-medium">Region of Popularity:</span> {selectedHorse.regionOfPopularity}</p>}
                      {selectedHorse.typicalUse && <p><span className="font-medium">Typical Use:</span> {selectedHorse.typicalUse}</p>}
                      {selectedHorse.gender && <p><span className="font-medium">Gender:</span> {selectedHorse.gender}</p>}
                      {selectedHorse.ageOrDOB && <p><span className="font-medium">Age/DOB:</span> {selectedHorse.ageOrDOB}</p>}
                      {selectedHorse.color && <p><span className="font-medium">Color:</span> {selectedHorse.color}</p>}
                      {selectedHorse.height > 0 && <p><span className="font-medium">Height:</span> {selectedHorse.height} cm</p>}
                    </div>
                  </div>

                  {/* Location */}
                  {selectedHorse.location && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Location</h4>
                      <p className="text-gray-600 text-sm">{selectedHorse.location}</p>
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

                  {/* Special Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHorse.negotiable && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Negotiable</span>
                      )}
                      {selectedHorse.trialAvailable && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Trial Available</span>
                      )}
                      {selectedHorse.paymentTerms && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{selectedHorse.paymentTerms}</span>
                      )}
                      {selectedHorse.transportAssistance && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Transport: {selectedHorse.transportAssistance}</span>
                      )}
                    </div>
                  </div>

                  {/* Temperament */}
                  {selectedHorse.temperament && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Temperament</h4>
                      <p className="text-gray-600 text-sm">{selectedHorse.temperament}</p>
                    </div>
                  )}

                  {/* Special Skills */}
                  {selectedHorse.specialSkills && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Special Skills</h4>
                      <p className="text-gray-600 text-sm">{selectedHorse.specialSkills}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          if (selectedHorse?.id) {
                            router.push(`/bookingHoursAppointment?horseId=${selectedHorse.id}`);
                          }
                        }}
                        className="w-full px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors duration-200 font-semibold"
                      >
                        Book Appointment
                      </button>
                      <button
                        onClick={closeModal}
                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
