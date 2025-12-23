"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Plus, X } from "lucide-react";
import { Checkbox, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { getUserData } from "../utils/localStorage";
import { postRequest, uploadFiles, uploadVideos, deleteRequest, putRequest, getRequest } from "@/service";
import { toast } from "react-hot-toast";
import LocationPicker from "../components/LocationPicker";
import countriesData from "../utils/countery.json";

export default function HourseMarket() {
  const [horses, setHorses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [prevVideos, setPrevVideos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [horseLimit, setHorseLimit] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  const [form, setForm] = useState({
    // Horse Identification
    horseName: "",
    ageOrDOB: "",
    gender: "",
    breed: "",
    countryOfOrigin: "",
    breedType: "",
    typicalUse: "",
    popularity: "",
    regionOfPopularity: "",
    color: "",
    height: "",
    microchipNumber: "",
    passportRegistrationNo: "",
    ueln: "",
    countryAndCity: "",
    coordinates: null,
    
    // Training & Discipline
    primaryDiscipline: "",
    trainingLevel: "",
    experienceLevel: "",
    riderSuitability: "",
    specialSkills: "",
    competitionExperience: false,
    competitionResults: [],
    competitionVideos: [],
    
    // Health & Medical
    healthStatus: "",
    vaccinationStatus: "",
    insuranceStatus: "",
    lastVetCheckDate: "",
    vetReportUpload: [],
    vetScansReports: [],
    farrierOsteopathDentalDate: "",
    wormingHistory: "",
    injuriesMedicalConditions: "",
    vices: "",
    
    // Pedigree & Breeding
    sire: "",
    dam: "",
    studbook: "",
    breedingSuitability: "",
    
    // Media
    photos: [],
    videos: [],
    
    // Pricing & Sale Condition
    askingPrice: "",
    negotiable: false,
    trialAvailable: false,
    paymentTerms: "",
    transportAssistance: "",
    returnConditions: "",
    
    // Seller & Verification
    sellerName: "",
    sellerType: "",
    contactPreferences: "",
    verificationStatus: "",
    
    // Legal & Compliance
    ownershipConfirmation: false,
    liabilityDisclaimer: false,
    welfareCompliance: false,
    
    // Additional
    temperament: "",
    status: "active",
    pedigreeDocuments: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [competitionResultFiles, setCompetitionResultFiles] = useState([]);
  const [vetReportFiles, setVetReportFiles] = useState([]);
  const [vetScanFiles, setVetScanFiles] = useState([]);
  const [pedigreeFiles, setPedigreeFiles] = useState([]);
  const [competitionVideoFiles, setCompetitionVideoFiles] = useState([]);
  // Store previous files for edit mode
  const [prevCompetitionResults, setPrevCompetitionResults] = useState([]);
  const [prevVetReports, setPrevVetReports] = useState([]);
  const [prevVetScans, setPrevVetScans] = useState([]);
  const [prevPedigree, setPrevPedigree] = useState([]);
  const [prevCompetitionVideos, setPrevCompetitionVideos] = useState([]);

  // Validation function
  const validateForm = () => {
    const errors = [];

    // Mandatory fields validation
    if (!form.horseName?.trim()) errors.push("Horse Name is required");
    if (!form.ageOrDOB?.trim()) errors.push("Age / DOB is required");
    if (!form.gender) errors.push("Gender is required");
    if (!form.breed) errors.push("Breed is required");
    if (!form.color) errors.push("Color is required");
    if (!form.height || isNaN(form.height) || Number(form.height) <= 0) errors.push("Valid Height is required");
    if (!form.passportRegistrationNo?.trim()) errors.push("Passport/Registration No. is required");
    if (!form.countryAndCity?.trim()) errors.push("Country & City is required");
    if (!form.primaryDiscipline) errors.push("Primary Discipline is required");
    if (!form.trainingLevel) errors.push("Training Level is required");
    if (!form.experienceLevel) errors.push("Experience Level is required");
    if (!form.riderSuitability) errors.push("Rider Suitability is required");
    if (!form.healthStatus) errors.push("Health Status is required");
    if (!form.vaccinationStatus) errors.push("Vaccination Status is required");
    if (!form.lastVetCheckDate?.trim()) errors.push("Last Vet Check Date is required");
    if (!form.injuriesMedicalConditions?.trim()) errors.push("Injuries/Medical Conditions disclosure is required");
    if (!form.vices) errors.push("Vices is required");
    if (!form.askingPrice || isNaN(form.askingPrice) || Number(form.askingPrice) <= 0) errors.push("Valid Asking Price is required");
    if (!form.sellerName?.trim()) errors.push("Seller Name is required");
    if (!form.sellerType) errors.push("Seller Type is required");
    if (!form.contactPreferences) errors.push("Contact Preferences is required");
    if (!form.temperament?.trim()) errors.push("Temperament is required");
    if ((!form.photos || form.photos.length === 0) && (!imagePreviews || imagePreviews.length === 0) && (!prevImages || prevImages.length === 0)) {
      errors.push("At least 5 photos are required (front, side, movement)");
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (coordinates) => {
    setForm((prev) => ({ ...prev, coordinates }));
  };

  const handleLocationTextChange = (locationText) => {
    setForm((prev) => ({ ...prev, countryAndCity: locationText }));
  };

  const handleImageChange = (e, type = 'photos') => {
    const files = Array.from(e.target.files);
    if (type === 'photos') {
      setForm((prev) => ({ ...prev, photos: files }));
      setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    } else if (type === 'competitionResults') {
      setCompetitionResultFiles(files);
    } else if (type === 'vetReports') {
      setVetReportFiles(files);
    } else if (type === 'vetScans') {
      setVetScanFiles(files);
    } else if (type === 'pedigree') {
      setPedigreeFiles(files);
    }
  };

  const handleVideoChange = (e, type = 'videos') => {
    const files = Array.from(e.target.files);
    if (type === 'videos') {
      setForm((prev) => ({ ...prev, videos: files }));
      setVideoPreviews(files.map((file) => URL.createObjectURL(file)));
    } else if (type === 'competitionVideos') {
      setCompetitionVideoFiles(files);
    }
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
          setHorseLimit(999999);
          return;
        }
        
        // Check if user has subscription
        if (userData.subscriptionId) {
          // Get subscription details
          const subscriptionResponse = await getRequest(`/api/subscriptions/${userData.subscriptionId}`);
          if (subscriptionResponse?.subscription) {
            const subscription = subscriptionResponse.subscription;
            setSubscriptionDetails(subscription);
            
            // Get horse limit from subscription description
            const limit = subscription.description?.["Hourse"] || subscription.description?.["Horse"] || "0";
            
            // Convert limit to number, treating "Not Allowed" and "0" as 0
            if (limit === "Not Allowed" || limit === "0" || limit === 0) {
              setHorseLimit(0);
            } else {
              setHorseLimit(parseInt(limit) || 0);
            }
          }
        } else {
          // No subscription - set limit to 0
          setHorseLimit(0);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    }
  };

  // Function to check if user can add a horse
  const canAddHorse = () => {
    if (isSuperAdmin) return true;
    if (!subscriptionDetails) return false;
    
    const currentCount = horses.length;
    return currentCount < horseLimit;
  };

  // Function to get horse limit status
  const getHorseLimitStatus = () => {
    if (isSuperAdmin) return { canAdd: true, current: 0, limit: 999999 };
    if (!subscriptionDetails) return { canAdd: false, current: 0, limit: 0 };
    
    const currentCount = horses.length;
    
    return {
      canAdd: currentCount < horseLimit,
      current: currentCount,
      limit: horseLimit
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;

    // Check subscription limits for new horses (not for editing)
    // Skip validation for superAdmin
    if (!editingId && !isSuperAdmin) {
      if (!subscriptionDetails) {
        toast.error("You need an active subscription to add horses. Please subscribe first.");
        return;
      }
      if (!canAddHorse()) {
        if (horseLimit === 0) {
          toast.error("Horse listings are not allowed in your current subscription plan.");
        } else {
          toast.error(`Your horse limit is full. Please upgrade your subscription to add more horses.`);
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
      // Upload all files
      let uploadedPhotos = [];
      let uploadedVideos = [];
      let uploadedCompetitionResults = [];
      let uploadedVetReports = [];
      let uploadedVetScans = [];
      let uploadedPedigree = [];
      let uploadedCompetitionVideos = [];

      if (editingId) {
        // Keep previous images if no new ones
        if (form.photos && form.photos.length > 0) {
          uploadedPhotos = await uploadFiles(form.photos);
        } else if (prevImages && prevImages.length > 0) {
          uploadedPhotos = prevImages;
        }
        
        if (form.videos && form.videos.length > 0) {
          uploadedVideos = await uploadVideos(form.videos);
        } else if (prevVideos && prevVideos.length > 0) {
          uploadedVideos = prevVideos;
        }
      } else {
        if (form.photos && form.photos.length > 0) {
          uploadedPhotos = await uploadFiles(form.photos);
        }
        if (form.videos && form.videos.length > 0) {
          uploadedVideos = await uploadVideos(form.videos);
        }
      }

      // Handle other file uploads - preserve existing when editing
      if (editingId) {
        if (competitionResultFiles.length > 0) {
          uploadedCompetitionResults = await uploadFiles(competitionResultFiles);
        } else if (prevCompetitionResults && prevCompetitionResults.length > 0) {
          uploadedCompetitionResults = prevCompetitionResults;
        }
        
        if (vetReportFiles.length > 0) {
          uploadedVetReports = await uploadFiles(vetReportFiles);
        } else if (prevVetReports && prevVetReports.length > 0) {
          uploadedVetReports = prevVetReports;
        }
        
        if (vetScanFiles.length > 0) {
          uploadedVetScans = await uploadFiles(vetScanFiles);
        } else if (prevVetScans && prevVetScans.length > 0) {
          uploadedVetScans = prevVetScans;
        }
        
        if (pedigreeFiles.length > 0) {
          uploadedPedigree = await uploadFiles(pedigreeFiles);
        } else if (prevPedigree && prevPedigree.length > 0) {
          uploadedPedigree = prevPedigree;
        }
        
        if (competitionVideoFiles.length > 0) {
          uploadedCompetitionVideos = await uploadVideos(competitionVideoFiles);
        } else if (prevCompetitionVideos && prevCompetitionVideos.length > 0) {
          uploadedCompetitionVideos = prevCompetitionVideos;
        }
      } else {
        // Creating new - only upload if files are provided
        if (competitionResultFiles.length > 0) {
          uploadedCompetitionResults = await uploadFiles(competitionResultFiles);
        }
        if (vetReportFiles.length > 0) {
          uploadedVetReports = await uploadFiles(vetReportFiles);
        }
        if (vetScanFiles.length > 0) {
          uploadedVetScans = await uploadFiles(vetScanFiles);
        }
        if (pedigreeFiles.length > 0) {
          uploadedPedigree = await uploadFiles(pedigreeFiles);
        }
        if (competitionVideoFiles.length > 0) {
          uploadedCompetitionVideos = await uploadVideos(competitionVideoFiles);
        }
      }

      const payload = {
        userId,
        // Horse Identification
        horseName: form.horseName,
        ageOrDOB: form.ageOrDOB,
        gender: form.gender,
        breed: form.breed,
        countryOfOrigin: form.countryOfOrigin || "",
        breedType: form.breedType || "",
        typicalUse: form.typicalUse || "",
        popularity: form.popularity || "",
        regionOfPopularity: form.regionOfPopularity || "",
        color: form.color,
        height: Number(form.height),
        microchipNumber: form.microchipNumber || "",
        passportRegistrationNo: form.passportRegistrationNo,
        ueln: form.ueln || "",
        countryAndCity: form.countryAndCity,
        coordinates: form.coordinates ? {
          lat: form.coordinates.lat,
          lng: form.coordinates.lng
        } : null,
        
        // Training & Discipline
        primaryDiscipline: form.primaryDiscipline,
        trainingLevel: form.trainingLevel,
        experienceLevel: form.experienceLevel,
        riderSuitability: form.riderSuitability,
        specialSkills: form.specialSkills || "",
        competitionExperience: form.competitionExperience,
        competitionResults: uploadedCompetitionResults,
        competitionVideos: uploadedCompetitionVideos,
        
        // Health & Medical
        healthStatus: form.healthStatus,
        vaccinationStatus: form.vaccinationStatus,
        insuranceStatus: form.insuranceStatus || "",
        lastVetCheckDate: form.lastVetCheckDate,
        vetReportUpload: uploadedVetReports,
        vetScansReports: uploadedVetScans,
        farrierOsteopathDentalDate: form.farrierOsteopathDentalDate || "",
        wormingHistory: form.wormingHistory || "",
        injuriesMedicalConditions: form.injuriesMedicalConditions,
        vices: form.vices,
        
        // Pedigree & Breeding
        sire: form.sire || "",
        dam: form.dam || "",
        studbook: form.studbook || "",
        breedingSuitability: form.breedingSuitability || "",
        
        // Media
        photos: uploadedPhotos,
        videos: uploadedVideos,
        
        // Pricing & Sale Condition
        askingPrice: Number(form.askingPrice),
        negotiable: form.negotiable,
        trialAvailable: form.trialAvailable,
        paymentTerms: form.paymentTerms || "",
        transportAssistance: form.transportAssistance || "",
        returnConditions: form.returnConditions || "",
        
        // Seller & Verification
        sellerName: form.sellerName,
        sellerType: form.sellerType,
        contactPreferences: form.contactPreferences,
        verificationStatus: form.verificationStatus || "",
        
        // Legal & Compliance
        ownershipConfirmation: form.ownershipConfirmation,
        liabilityDisclaimer: form.liabilityDisclaimer,
        welfareCompliance: form.welfareCompliance,
        
        // Additional
        temperament: form.temperament,
        status: form.status || "active",
        pedigreeDocuments: uploadedPedigree
      };

      if (editingId) {
        await putRequest(`/api/horse-market/${editingId}`, payload);
        toast.success("Horse updated successfully!");
      } else {
        await postRequest("/api/horse-market", payload);
        toast.success("Horse created successfully!");
      }

      // Reset form
      resetForm();
      setShowModal(false);
      loadHorses();
    } catch (err) {
      console.error("Failed to submit horse", err);
      toast.error(editingId ? "Failed to update horse. Please try again." : "Failed to create horse. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      horseName: "",
      ageOrDOB: "",
      gender: "",
      breed: "",
      countryOfOrigin: "",
      breedType: "",
      typicalUse: "",
      popularity: "",
      regionOfPopularity: "",
      color: "",
      height: "",
      microchipNumber: "",
      passportRegistrationNo: "",
      ueln: "",
      countryAndCity: "",
      coordinates: null,
      primaryDiscipline: "",
      trainingLevel: "",
      experienceLevel: "",
      riderSuitability: "",
      specialSkills: "",
      competitionExperience: false,
      competitionResults: [],
      competitionVideos: [],
      healthStatus: "",
      vaccinationStatus: "",
      insuranceStatus: "",
      lastVetCheckDate: "",
      vetReportUpload: [],
      vetScansReports: [],
      farrierOsteopathDentalDate: "",
      wormingHistory: "",
      injuriesMedicalConditions: "",
      vices: "",
      sire: "",
      dam: "",
      studbook: "",
      breedingSuitability: "",
      photos: [],
      videos: [],
      askingPrice: "",
      negotiable: false,
      trialAvailable: false,
      paymentTerms: "",
      transportAssistance: "",
      returnConditions: "",
      sellerName: "",
      sellerType: "",
      contactPreferences: "",
      verificationStatus: "",
      ownershipConfirmation: false,
      liabilityDisclaimer: false,
      welfareCompliance: false,
      temperament: "",
      status: "active",
      pedigreeDocuments: []
    });
    setImagePreviews([]);
    setVideoPreviews([]);
    setCompetitionResultFiles([]);
    setVetReportFiles([]);
    setVetScanFiles([]);
    setPedigreeFiles([]);
    setCompetitionVideoFiles([]);
    setPrevImages([]);
    setPrevVideos([]);
    setPrevCompetitionResults([]);
    setPrevVetReports([]);
    setPrevVetScans([]);
    setPrevPedigree([]);
    setPrevCompetitionVideos([]);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(`/api/horse-market/${id}`);
      setHorses((prev) => prev.filter((h) => h.id !== id));
      toast.success("Horse deleted successfully!");
    } catch (e) {
      console.error("Failed to delete horse", e);
      toast.error("Failed to delete horse. Please try again.");
    }
  };

  const handleEdit = (horse) => {
    setForm({
      horseName: horse.horseName || "",
      ageOrDOB: horse.ageOrDOB || "",
      gender: horse.gender || "",
      breed: horse.breed || "",
      countryOfOrigin: horse.countryOfOrigin || "",
      breedType: horse.breedType || "",
      typicalUse: horse.typicalUse || "",
      popularity: horse.popularity || "",
      regionOfPopularity: horse.regionOfPopularity || "",
      color: horse.color || "",
      height: horse.height || "",
      microchipNumber: horse.microchipNumber || "",
      passportRegistrationNo: horse.passportRegistrationNo || "",
      ueln: horse.ueln || "",
      countryAndCity: horse.countryAndCity || "",
      coordinates: horse.coordinates || null,
      primaryDiscipline: horse.primaryDiscipline || "",
      trainingLevel: horse.trainingLevel || "",
      experienceLevel: horse.experienceLevel || "",
      riderSuitability: horse.riderSuitability || "",
      specialSkills: horse.specialSkills || "",
      competitionExperience: horse.competitionExperience || false,
      competitionResults: [],
      competitionVideos: [],
      healthStatus: horse.healthStatus || "",
      vaccinationStatus: horse.vaccinationStatus || "",
      insuranceStatus: horse.insuranceStatus || "",
      lastVetCheckDate: horse.lastVetCheckDate || "",
      vetReportUpload: [],
      vetScansReports: [],
      pedigreeDocuments: [],
      farrierOsteopathDentalDate: horse.farrierOsteopathDentalDate || "",
      wormingHistory: horse.wormingHistory || "",
      injuriesMedicalConditions: horse.injuriesMedicalConditions || "",
      vices: horse.vices || "",
      sire: horse.sire || "",
      dam: horse.dam || "",
      studbook: horse.studbook || "",
      breedingSuitability: horse.breedingSuitability || "",
      photos: [],
      videos: [],
      askingPrice: horse.askingPrice || "",
      negotiable: horse.negotiable || false,
      trialAvailable: horse.trialAvailable || false,
      paymentTerms: horse.paymentTerms || "",
      transportAssistance: horse.transportAssistance || "",
      returnConditions: horse.returnConditions || "",
      sellerName: horse.sellerName || "",
      sellerType: horse.sellerType || "",
      contactPreferences: horse.contactPreferences || "",
      verificationStatus: horse.verificationStatus || "",
      ownershipConfirmation: horse.ownershipConfirmation || false,
      liabilityDisclaimer: horse.liabilityDisclaimer || false,
      welfareCompliance: horse.welfareCompliance || false,
      temperament: horse.temperament || "",
      status: horse.status || "active",
      pedigreeDocuments: []
    });
    setImagePreviews(horse.photos || []);
    setVideoPreviews(horse.videos || []);
    setPrevImages(horse.photos || []);
    setPrevVideos(horse.videos || []);
    // Store previous files for edit mode
    setPrevCompetitionResults(horse.competitionResults || []);
    setPrevVetReports(horse.vetReportUpload || []);
    setPrevVetScans(horse.vetScansReports || []);
    setPrevPedigree(horse.pedigreeDocuments || []);
    setPrevCompetitionVideos(horse.competitionVideos || []);
    setEditingId(horse.id);
    setShowModal(true);
  };

  const loadHorses = async () => {
    const tokenData = getUserData();
    const userId = tokenData?.id || null;
    if (!userId) return;
    try {
      setLoadingList(true);
      const list = await getRequest(`/api/horse-market?userId=${userId}`);
      if (Array.isArray(list)) {
        const mapped = list.map((h) => ({
          id: h._id,
          ...h
        }));
        setHorses(mapped);
        
        // After loading horses, check subscription limits
        await fetchUserSubscriptionDetails();
      }
    } catch (e) {
      console.error("Failed to load horses", e);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadHorses();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand">Horse Market</h2>
          <p className="text-sm text-brand/80">Manage your horse listings.</p>
        </div>
        <button
          className={`px-4 py-2 rounded font-medium transition ${
            (!isSuperAdmin && (horses.length >= horseLimit || !subscriptionDetails || horseLimit === 0))
              ? 'bg-gray-400 !text-white cursor-not-allowed' 
              : 'bg-[color:var(--primary)] !text-white hover:bg-[color:var(--primary)]/90 cursor-pointer'
          }`}
          disabled={!isSuperAdmin && (horses.length >= horseLimit || !subscriptionDetails || horseLimit === 0)}
          onClick={() => {
            // Skip validation for superAdmin
            if (!isSuperAdmin) {
              if (!subscriptionDetails) {
                window.location.href = '/subscription';
                return;
              }
              if (horseLimit === 0) {
                toast.error("Horse listings are not allowed in your current subscription plan.");
                return;
              }
              // Check if current horse count has reached the limit
              if (horses.length >= horseLimit) {
                toast.error("Your horse limit is full. Please upgrade your subscription to add more horses.");
                return;
              }
            }
            resetForm();
            setShowModal(true);
          }}
        >
          {isSuperAdmin ? "+ Add New" : !subscriptionDetails ? "Get Subscription" : horseLimit === 0 ? "Not Allowed" : (horses.length >= horseLimit) ? "Your Limit is Full" : "+ Add New"}
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
                  <div className="font-medium text-blue-700">Horse Listings:</div>
                  <div className="text-blue-600">
                    {horses.length} / {horseLimit === 0 ? "Not Allowed" : horseLimit}
                  </div>
                  {(horses.length >= horseLimit) && horseLimit > 0 && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      You've reached your horse limit for this plan.
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
                You have unlimited access to add horse listings without subscription limits.
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
                You need an active subscription to add horse listings.
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {horses.map((horse) => (
            <div
              key={horse.id}
              className="bg-white rounded-lg border border-[color:var(--primary)] shadow-sm p-4 relative"
            >
              <div className="relative w-full h-40 mb-3 rounded overflow-hidden bg-gray-100">
                {horse.photos && horse.photos.length > 0 ? (
                  <img
                    src={horse.photos[0]}
                    alt={horse.horseName}
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
                    onClick={() => handleEdit(horse)}
                  >
                    <Edit className="w-5 h-5 text-blue-600 cursor-pointer" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    title="Delete"
                    onClick={() => handleDelete(horse.id)}
                  >
                    <Trash className="w-5 h-5 text-red-600 cursor-pointer" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-brand">{horse.horseName}</h3>
              <p className="text-sm text-brand/80 mb-2">
                {horse.breed} • {horse.gender} • {horse.color}
              </p>
              {horse.countryAndCity && (
                <p className="text-sm text-brand/70 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {horse.countryAndCity}
                </p>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-brand font-bold text-base">
                  {horse.askingPrice ? `€ ${horse.askingPrice.toLocaleString()}` : ""}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  horse.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {horse.status || 'active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-x-hidden overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow-lg py-8 px-4 w-full max-w-5xl relative max-h-[90vh] overflow-y-auto">
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
            <h3 className="text-xl font-semibold text-brand mb-4">{editingId ? 'Edit Horse' : 'Add New Horse'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Horse Identification Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Horse Identification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Horse Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="horseName"
                      value={form.horseName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Full name of the horse"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Age / DOB <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={form.ageOrDOB ? dayjs(form.ageOrDOB) : null}
                      onChange={(date, dateString) => {
                        setForm((prev) => ({ ...prev, ageOrDOB: dateString || "" }));
                      }}
                      className="w-full"
                      format="YYYY-MM-DD"
                      placeholder="Select date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.gender || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
                      placeholder="Select Gender"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Mare', label: 'Mare' },
                        { value: 'Stallion', label: 'Stallion' },
                        { value: 'Gelding', label: 'Gelding' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Breed <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.breed || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, breed: value }))}
                      placeholder="Select Breed"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Dutch Warmblood (KWPN)', label: 'Dutch Warmblood (KWPN)' },
                        { value: 'Andalusian (Pura Raza Española)', label: 'Andalusian (Pura Raza Española)' },
                        { value: 'Hanoverian', label: 'Hanoverian' },
                        { value: 'Holsteiner', label: 'Holsteiner' },
                        { value: 'Oldenburg', label: 'Oldenburg' },
                        { value: 'Westphalian', label: 'Westphalian' },
                        { value: 'Trakehner', label: 'Trakehner' },
                        { value: 'Thoroughbred', label: 'Thoroughbred' },
                        { value: 'Arabian', label: 'Arabian' },
                        { value: 'Quarter Horse', label: 'Quarter Horse' },
                        { value: 'Friesian', label: 'Friesian' },
                        { value: 'Irish Sport Horse', label: 'Irish Sport Horse' },
                        { value: 'Selle Français', label: 'Selle Français' },
                        { value: 'Belgian Warmblood', label: 'Belgian Warmblood' },
                        { value: 'Swedish Warmblood', label: 'Swedish Warmblood' },
                        { value: 'Danish Warmblood', label: 'Danish Warmblood' },
                        { value: 'Lusitano', label: 'Lusitano' },
                        { value: 'Lipizzaner', label: 'Lipizzaner' },
                        { value: 'Percheron', label: 'Percheron' },
                        { value: 'Clydesdale', label: 'Clydesdale' },
                        { value: 'Shire', label: 'Shire' },
                        { value: 'Paint Horse', label: 'Paint Horse' },
                        { value: 'Appaloosa', label: 'Appaloosa' },
                        { value: 'Tennessee Walking Horse', label: 'Tennessee Walking Horse' },
                        { value: 'Morgan', label: 'Morgan' },
                        { value: 'American Saddlebred', label: 'American Saddlebred' },
                        { value: 'Standardbred', label: 'Standardbred' },
                        { value: 'Mustang', label: 'Mustang' },
                        { value: 'Welsh Pony', label: 'Welsh Pony' },
                        { value: 'Shetland Pony', label: 'Shetland Pony' },
                        { value: 'Connemara Pony', label: 'Connemara Pony' },
                        { value: 'Akhal-Teke', label: 'Akhal-Teke' },
                        { value: 'Cleveland Bay', label: 'Cleveland Bay' },
                        { value: 'Fjord', label: 'Fjord' },
                        { value: 'Haflinger', label: 'Haflinger' },
                        { value: 'Icelandic Horse', label: 'Icelandic Horse' },
                        { value: 'Knapstrupper', label: 'Knapstrupper' },
                        { value: 'Norwegian Fjord', label: 'Norwegian Fjord' },
                        { value: 'Paso Fino', label: 'Paso Fino' },
                        { value: 'Pinto', label: 'Pinto' },
                        { value: 'Rocky Mountain Horse', label: 'Rocky Mountain Horse' },
                        { value: 'Suffolk Punch', label: 'Suffolk Punch' },
                        { value: 'Welsh Cob', label: 'Welsh Cob' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Country of Origin
                    </label>
                    <Select
                      value={form.countryOfOrigin || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, countryOfOrigin: value }))}
                      placeholder="Select Country of Origin"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={countriesData.map((country) => ({
                        value: country.name,
                        label: country.name
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Type
                    </label>
                    <Select
                      value={form.breedType || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, breedType: value }))}
                      placeholder="Select Type"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Warmblood', label: 'Warmblood' },
                        { value: 'Light horse', label: 'Light horse' },
                        { value: 'Baroque', label: 'Baroque' },
                        { value: 'Pony', label: 'Pony' },
                        { value: 'Draft', label: 'Draft' },
                        { value: 'Sport Horse', label: 'Sport Horse' },
                        { value: 'Gaited', label: 'Gaited' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Typical Use
                    </label>
                    <Select
                      value={form.typicalUse || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, typicalUse: value }))}
                      placeholder="Select Typical Use"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Dressage', label: 'Dressage' },
                        { value: 'Jumping', label: 'Jumping' },
                        { value: 'Eventing', label: 'Eventing' },
                        { value: 'Racing', label: 'Racing' },
                        { value: 'Breeding', label: 'Breeding' },
                        { value: 'Endurance', label: 'Endurance' },
                        { value: 'Western Riding', label: 'Western Riding' },
                        { value: 'Ranch Work', label: 'Ranch Work' },
                        { value: 'Pleasure', label: 'Pleasure' },
                        { value: 'Trail', label: 'Trail' },
                        { value: 'Driving', label: 'Driving' },
                        { value: 'Leisure', label: 'Leisure' },
                        { value: "Children's Riding", label: "Children's Riding" },
                        { value: 'Heavy Work', label: 'Heavy Work' },
                        { value: 'Farm Work', label: 'Farm Work' },
                        { value: 'Logging', label: 'Logging' },
                        { value: 'Show', label: 'Show' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Popularity
                    </label>
                    <Select
                      value={form.popularity || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, popularity: value }))}
                      placeholder="Select Popularity"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Very High', label: 'Very High' },
                        { value: 'High', label: 'High' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'Low', label: 'Low' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Region of Popularity
                    </label>
                    <Select
                      value={form.regionOfPopularity || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, regionOfPopularity: value }))}
                      placeholder="Select Region"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Western Europe', label: 'Western Europe' },
                        { value: 'Central Europe', label: 'Central Europe' },
                        { value: 'Worldwide', label: 'Worldwide' },
                        { value: 'Southern Europe', label: 'Southern Europe' },
                        { value: 'Ireland, UK', label: 'Ireland, UK' },
                        { value: 'France', label: 'France' },
                        { value: 'Europe', label: 'Europe' },
                        { value: 'North America', label: 'North America' },
                        { value: 'Northern Europe', label: 'Northern Europe' },
                        { value: 'Eastern Europe', label: 'Eastern Europe' },
                        { value: 'Asia', label: 'Asia' },
                        { value: 'South America', label: 'South America' },
                        { value: 'Australia', label: 'Australia' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={form.color}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Primary coat color"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Height (cm or hands) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Height"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Microchip Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="microchipNumber"
                      value={form.microchipNumber}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Microchip ID if available"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Passport/Registration No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="passportRegistrationNo"
                      value={form.passportRegistrationNo}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Official passport/registration number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">UELN</label>
                    <input
                      type="text"
                      name="ueln"
                      value={form.ueln}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Universal Equine Life Number"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">
                      Temperament <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="temperament"
                      value={form.temperament}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      rows={3}
                      placeholder="Behaviour and temperament details"
                    />
                  </div>
                </div>
              </div>

              {/* Training & Discipline Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Training & Discipline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Primary Discipline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="primaryDiscipline"
                      value={form.primaryDiscipline}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Main riding discipline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Training Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="trainingLevel"
                      value={form.trainingLevel}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Level of training or schooling"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.experienceLevel || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, experienceLevel: value }))}
                      placeholder="Select Level"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Rider Suitability <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.riderSuitability || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, riderSuitability: value }))}
                      placeholder="Select Level"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' }
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Special Skills</label>
                    <textarea
                      name="specialSkills"
                      value={form.specialSkills}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      rows={2}
                      placeholder="Tricks or talent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Checkbox
                      name="competitionExperience"
                      checked={form.competitionExperience}
                      onChange={(e) => setForm((prev) => ({ ...prev, competitionExperience: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Competition Experience (Has the horse competed?) <span className="text-red-500">*</span></span>
                    </Checkbox>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Competition Results</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, 'competitionResults')}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Competition Videos</label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleVideoChange(e, 'competitionVideos')}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Health & Medical Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Health & Medical</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Health Status <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.healthStatus || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, healthStatus: value }))}
                      placeholder="Select Status"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Healthy', label: 'Healthy' },
                        { value: 'Condition disclosed', label: 'Condition disclosed' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Vaccination Status <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.vaccinationStatus || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, vaccinationStatus: value }))}
                      placeholder="Select Status"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Up to date', label: 'Up to date' },
                        { value: 'Not up to date', label: 'Not up to date' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Insurance Status</label>
                    <Select
                      value={form.insuranceStatus || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, insuranceStatus: value }))}
                      placeholder="Select Status"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Insured', label: 'Insured' },
                        { value: 'Not Insured', label: 'Not Insured' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Last Vet Check Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={form.lastVetCheckDate ? dayjs(form.lastVetCheckDate) : null}
                      onChange={(date, dateString) => {
                        setForm((prev) => ({ ...prev, lastVetCheckDate: dateString || "" }));
                      }}
                      className="w-full"
                      format="YYYY-MM-DD"
                      placeholder="Select date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Farrier/Osteopath/Dental Date</label>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={form.farrierOsteopathDentalDate ? dayjs(form.farrierOsteopathDentalDate) : null}
                      onChange={(date, dateString) => {
                        setForm((prev) => ({ ...prev, farrierOsteopathDentalDate: dateString || "" }));
                      }}
                      className="w-full"
                      format="YYYY-MM-DD"
                      placeholder="Select date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Vices <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.vices || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, vices: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'None', label: 'None' },
                        { value: 'Cribbing', label: 'Cribbing' },
                        { value: 'Weaving', label: 'Weaving' },
                        { value: 'Wood Chewing', label: 'Wood Chewing' },
                        { value: 'Other', label: 'Other' }
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Worming History</label>
                    <textarea
                      name="wormingHistory"
                      value={form.wormingHistory}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      rows={2}
                      placeholder="Details of worming treatments"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">
                      Injuries/Medical Conditions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="injuriesMedicalConditions"
                      value={form.injuriesMedicalConditions}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      rows={3}
                      placeholder="Disclosure required if any issues"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Vet Report Upload</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, 'vetReports')}
                      className="w-full text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Vet Scans/Reports</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, 'vetScans')}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Pedigree & Breeding Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Pedigree & Breeding</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Sire</label>
                    <input
                      type="text"
                      name="sire"
                      value={form.sire}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Father's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Dam</label>
                    <input
                      type="text"
                      name="dam"
                      value={form.dam}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Mother's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Studbook</label>
                    <input
                      type="text"
                      name="studbook"
                      value={form.studbook}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Approved studbook"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Breeding Suitability</label>
                    <Select
                      value={form.breedingSuitability || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, breedingSuitability: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Suitable', label: 'Suitable' },
                        { value: 'Not Suitable', label: 'Not Suitable' }
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Pedigree Documents</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, 'pedigree')}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Photos (Min 5: front, side, movement) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, 'photos')}
                      className="w-full text-sm"
                    />
                    {(imagePreviews.length > 0 || (editingId && prevImages.length > 0)) && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {(imagePreviews.length > 0 ? imagePreviews : prevImages).slice(0, 5).map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className="w-14 h-14 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Videos (Riding, handling, jumping etc.)
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleVideoChange(e, 'videos')}
                      className="w-full text-sm"
                    />
                    {(videoPreviews.length > 0 || (editingId && prevVideos.length > 0)) && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {(videoPreviews.length > 0 ? videoPreviews : prevVideos).slice(0, 3).map((src, idx) => (
                          <video key={idx} src={src} className="w-14 h-14 object-cover rounded border" controls />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Sale Condition Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Pricing & Sale Condition</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Asking Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="askingPrice"
                      value={form.askingPrice}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Horse sale price"
                      min="0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Checkbox
                      name="negotiable"
                      checked={form.negotiable}
                      onChange={(e) => setForm((prev) => ({ ...prev, negotiable: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Negotiable (Price negotiable?)</span>
                    </Checkbox>
                  </div>
                  <div className="md:col-span-2">
                    <Checkbox
                      name="trialAvailable"
                      checked={form.trialAvailable}
                      onChange={(e) => setForm((prev) => ({ ...prev, trialAvailable: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Trial Available (Trial allowed before purchase?)</span>
                    </Checkbox>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Payment Terms</label>
                    <Select
                      value={form.paymentTerms || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, paymentTerms: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Deposit', label: 'Deposit' },
                        { value: 'Installment', label: 'Installment' },
                        { value: 'Full Payment', label: 'Full Payment' }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">Transport Assistance</label>
                    <Select
                      value={form.transportAssistance || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, transportAssistance: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Provided', label: 'Provided' },
                        { value: 'Not Provided', label: 'Not Provided' }
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">Return Conditions</label>
                    <textarea
                      name="returnConditions"
                      value={form.returnConditions}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      rows={2}
                      placeholder="Return or refund policy"
                    />
                  </div>
                </div>
              </div>

              {/* Seller & Verification Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Seller & Verification</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Seller Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sellerName"
                      value={form.sellerName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                      placeholder="Full seller name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand mb-1">
                      Seller Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.sellerType || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, sellerType: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Private', label: 'Private' },
                        { value: 'Professional', label: 'Professional' },
                        { value: 'Stable', label: 'Stable' }
                      ]}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">
                      Contact Preferences <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.contactPreferences || undefined}
                      onChange={(value) => setForm((prev) => ({ ...prev, contactPreferences: value }))}
                      placeholder="Select"
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: 'Chat', label: 'Chat' },
                        { value: 'Phone', label: 'Phone' },
                        { value: 'Email', label: 'Email' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Legal & Compliance Section */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold text-brand mb-3">Legal & Compliance</h4>
                <div className="space-y-2">
                  <div>
                    <Checkbox
                      name="ownershipConfirmation"
                      checked={form.ownershipConfirmation}
                      onChange={(e) => setForm((prev) => ({ ...prev, ownershipConfirmation: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Ownership Confirmation (Declares legal right to sell)</span>
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox
                      name="liabilityDisclaimer"
                      checked={form.liabilityDisclaimer}
                      onChange={(e) => setForm((prev) => ({ ...prev, liabilityDisclaimer: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Liability Disclaimer (Accepts selling terms)</span>
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox
                      name="welfareCompliance"
                      checked={form.welfareCompliance}
                      onChange={(e) => setForm((prev) => ({ ...prev, welfareCompliance: e.target.checked }))}
                    >
                      <span className="text-sm text-brand">Welfare Compliance (Meets welfare & transport rules)</span>
                    </Checkbox>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand mb-1">
                      Country & City <span className="text-red-500">*</span>
                    </label>
                    <LocationPicker
                      onLocationChange={handleLocationChange}
                      onLocationTextChange={handleLocationTextChange}
                      initialLocation={form.coordinates}
                      initialLocationText={form.countryAndCity}
                      height="250px"
                    />
                  </div>
              {/* Status */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-brand mb-1">Status</label>
                <Select
                  value={form.status || undefined}
                  onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                  placeholder="Select Status"
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded text-white font-medium transition ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90'
                }`}
              >
                {submitting ? "Saving..." : (editingId ? "Update" : "Save")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
