"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { postRequest, uploadFile } from "@/service";
import { updateLocalStorageData } from "../utils/localStorage";
import TopSection from "../components/topSection";
import OTPModal from "../components/OTPModal";
import GoogleLoginButton from "../components/GoogleLoginButton";
import AgreementModal from "../components/AgreementModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import OTPVerificationModal from "../components/OTPVerificationModal";
import NewPasswordModal from "../components/NewPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [accountType, setAccountType] = useState("Buyer");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [companyInfo, setCompanyInfo] = useState("");
  const [companyLicence, setCompanyLicence] = useState(null);
  const [vatNo, setVatNo] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP verification state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [pendingRegistrationData, setPendingRegistrationData] = useState(null);
  const [pendingLoginData, setPendingLoginData] = useState(null); // holds { email, token }

  // Agreement modal state
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Forgot password modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showOTPVerificationModal, setShowOTPVerificationModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const isSeller = useMemo(() => accountType === "Seller", [accountType]);

  const inputClass =
    "bg-transparent border border-brand/40 rounded px-3 py-2 placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-brand/40";
  const labelClass = "text-sm";
  const tabClass = (tab) =>
    `w-full px-4 py-2 text-center rounded ${
      activeTab === tab ? "bg-primary !text-white" : "bg-transparent border border-brand/30 text-brand"
    }`;

  function handleBrandImageChange(e) {
    const file = e.target.files?.[0] ?? null;
    setBrandImage(file);
  }

  function handleCompanyLicenceChange(e) {
    const file = e.target.files?.[0] ?? null;
    setCompanyLicence(file);
  }

  // OTP verification functions
  async function sendOTP(email) {
    try {
      const response = await fetch("https://www.equiherds.com/forgot-api/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Failed to send OTP");
    }
  }

  async function verifyOTP(email, otp) {
    try {
      const response = await fetch("https://www.equiherds.com/forgot-api/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "OTP verification failed");
    }
  }

  async function handleOTPVerify(otp) {
    // Supports both registration flow and seller-login flow
    const emailForOtp = pendingRegistrationData?.email || pendingLoginData?.email;
    if (!emailForOtp) return;

    setOtpLoading(true);
    try {
      const result = await verifyOTP(emailForOtp, otp);
      if (result.message === "OTP verified successfully") {
        // Registration flow
        if (pendingRegistrationData) {
          toast.success("Email verified successfully!");
          await createAccount(pendingRegistrationData);
          setShowOTPModal(false);
          setPendingRegistrationData(null);
          return;
        }
        // Seller login flow
        if (pendingLoginData) {
          toast.success("OTP verified. Logging you in...");
          if (pendingLoginData.token) {
            updateLocalStorageData({ token: pendingLoginData.token });
            // Small delay to ensure localStorage is persisted
            setTimeout(() => {
              router.push("/profile");
            }, 100);
          }
          setShowOTPModal(false);
          setPendingLoginData(null);
          return;
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleOTPResend() {
    const emailForOtp = pendingRegistrationData?.email || pendingLoginData?.email;
    if (!emailForOtp) return;

    setOtpLoading(true);
    try {
      await sendOTP(emailForOtp);
      toast.success("OTP sent successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  }

  async function createAccount(registrationData) {
    setIsRegisterLoading(true);
    try {
      const mappedAccountType = registrationData.accountType.toLowerCase();

      let brandImageUrl;
      if (registrationData.isSeller && registrationData.brandImage) {
        if (typeof registrationData.brandImage === 'string') {
          brandImageUrl = registrationData.brandImage;
        } else {
          try {
            brandImageUrl = await uploadFile(registrationData.brandImage);
          } catch (err) {
            toast.error(err?.message || "Image upload failed");
            return;
          }
        }
      }

      let companyLicenceUrl;
      if (registrationData.companyLicence) {
        if (typeof registrationData.companyLicence === 'string') {
          companyLicenceUrl = registrationData.companyLicence;
        } else {
          try {
            companyLicenceUrl = await uploadFile(registrationData.companyLicence);
          } catch (err) {
            toast.error(err?.message || "Company licence upload failed");
            return;
          }
        }
      }

      const payload = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        accountType: mappedAccountType,
        phoneNumber: registrationData.phoneNumber,
        password: registrationData.password,
        status: accountType === "Seller" ? "pending" : "active",
      };

      // Add seller-specific fields (required for sellers)
      if (registrationData.isSeller) {
        if (!registrationData.companyName || !registrationData.companyInfo || !brandImageUrl || !registrationData.vatNo || !registrationData.stripeAccountId) {
          toast.error("All seller information is required");
          return;
        }
        payload.companyName = registrationData.companyName;
        payload.brandImage = brandImageUrl;
        payload.companyInfo = registrationData.companyInfo;
        payload.vatNo = registrationData.vatNo;
        payload.stripeAccountId = registrationData.stripeAccountId;
      }
      if (companyLicenceUrl) {
        payload.companyLicence = companyLicenceUrl; 
      }
      if (registrationData.street) {
        payload.street = registrationData.street;
      }
      if (registrationData.city) {
        payload.city = registrationData.city;
      }
      if (registrationData.country) {
        payload.country = registrationData.country;
      }
      if (registrationData.zipcode) {
        payload.zipcode = registrationData.zipcode;
      }
      if (registrationData.address1) {
        payload.address1 = registrationData.address1;
      }
      if (registrationData.address2) {
        payload.address2 = registrationData.address2;
      }
      const res = await postRequest("/api/users", payload);
      if (res && res.user) {
        if (registrationData.isSeller) {
          toast.success("Seller account created successfully! Your account is pending approval.");
        } else {
          toast.success("Buyer account created successfully!");
        }
        setActiveTab("login");
        // Reset form
        setFirstName("");
        setLastName("");
        setRegisterEmail("");
        setAccountType("Buyer");
        setPhoneNumber("");
        setCompanyName("");
        setBrandImage(null);
        setCompanyInfo("");
        setCompanyLicence(null);
        setVatNo("");
        setStripeAccountId("");
        setStreet("");
        setCity("");
        setCountry("");
        setZipcode("");
        setAddress1("");
        setAddress2("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to create account");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create account");
    } finally {
      setIsRegisterLoading(false);
    }
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const res = await postRequest("/api/auth/user-login", {
        email: loginEmail,
        password: loginPassword,
        authMethod: 'email'
      });

      if (res?.message === "Login successful") {
        const acctType = res?.user?.accountType;
        if (acctType === 'seller1') {
          // Require OTP for sellers before finalizing login
          try {
            setOtpLoading(true);
            await sendOTP(loginEmail);
            setPendingLoginData({ email: loginEmail, token: res?.token });
            setShowOTPModal(true);
            toast.success("OTP sent to your email. Please verify to continue.");
          } catch (otpErr) {
            toast.error(otpErr?.message || "Failed to send OTP");
            setPendingLoginData(null);
          } finally {
            setOtpLoading(false);
          }
          return; // stop here; finalize after OTP
        }

        // Non-seller: proceed normally
        if (res?.token) {
          updateLocalStorageData({ token: res.token });
          toast.success(res?.message || "Logged in successfully");
          // Small delay to ensure localStorage is persisted before navigation
          setTimeout(() => {
            router.push("/profile");
          }, 100);
        } else {
          toast.error("No token received from server");
        }
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate seller-specific fields if user is a seller
    if (isSeller) {
      if (!companyName.trim()) {
        toast.error("Company name is required for sellers");
        return;
      }
      if (!companyInfo.trim()) {
        toast.error("Company information is required for sellers");
        return;
      }
      if (!brandImage) {
        toast.error("Brand image is required for sellers");
        return;
      }
      if (!vatNo.trim()) {
        toast.error("VAT number is required for sellers");
        return;
      }
      if (!stripeAccountId.trim()) {
        toast.error("Stripe account ID is required for sellers");
        return;
      }
    }

    setIsRegisterLoading(true);

    // Store registration data for later use
    const registrationData = {
      firstName,
      lastName,
      email: registerEmail,
      accountType,
      phoneNumber,
      companyName,
      brandImage,
      companyInfo,
      companyLicence,
      vatNo,
      stripeAccountId,
      street,
      city,
      country,
      zipcode,
      address1,
      address2,
      password,
      isSeller,
    };

    setPendingRegistrationData(registrationData);
    
    // Show agreement modal first
    setShowAgreementModal(true);
    setIsRegisterLoading(false);
  }

  async function handleAgreementAccept() {
    setShowAgreementModal(false);
    setAgreementAccepted(true);
    setIsRegisterLoading(true);

    try {
      // Send OTP after agreement is accepted
      await sendOTP(pendingRegistrationData.email);
      toast.success("OTP sent to your email. Please check your inbox.");
      setShowOTPModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
      setPendingRegistrationData(null);
    } finally {
      setIsRegisterLoading(false);
    }
  }

  function handleAgreementClose() {
    setShowAgreementModal(false);
    setPendingRegistrationData(null);
  }

  // Forgot password handlers
  function handleForgotPasswordClick() {
    setShowForgotPasswordModal(true);
  }

  function handleForgotPasswordEmailSent(email) {
    setForgotPasswordEmail(email);
    setShowForgotPasswordModal(false);
    setShowOTPVerificationModal(true);
  }

  function handleOTPVerified(email) {
    setForgotPasswordEmail(email);
    setShowOTPVerificationModal(false);
    setShowNewPasswordModal(true);
  }

  function handlePasswordUpdated() {
    setShowNewPasswordModal(false);
    setForgotPasswordEmail("");
    toast.success("Password updated successfully! You can now login with your new password.");
  }

  function handleForgotPasswordClose() {
    setShowForgotPasswordModal(false);
    setShowOTPVerificationModal(false);
    setShowNewPasswordModal(false);
    setForgotPasswordEmail("");
  }

  return (
    <div className="font-sans">
      {/* Loading Overlay */}
      {(isLoginLoading || isRegisterLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <img src="/loading.gif" alt="Loading" width={160} height={160} />
        </div>
      )}
      
      <TopSection title={activeTab === "login" ? "Login" : "Register"} />
      <section className="mx-auto max-w-6xl px-4 py-10 text-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="hidden lg:flex rounded-xl overflow-hidden border border-white/10">
            <div className="relative flex-1 bg-[url('/slider/3.jpg')] bg-cover bg-center">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 h-full w-full p-8 flex flex-col justify-end gap-4">
                <span className="text-2xl font-bold text-primary !bg-white px-2 py-1 rounded-md">Welcome to Equiherds</span>
                <p className="text-white/80">Join our marketplace to buy or sell with confidence.</p>
                <ul className="text-white/70 list-disc list-inside space-y-1">
                  <li>Secure accounts</li>
                  <li>Trusted sellers</li>
                  <li>24/7 support</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="grid grid-cols-2 gap-2 mb-6 ">
              <button
                type="button"
                className={
                  tabClass("login") +
                  (activeTab === "login" ? " text-white" : "")
                }
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={
                  tabClass("register") +
                  (activeTab === "register" ? " text-white" : "")
                }
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {activeTab === "login" ? (
              <form className="grid gap-4 rounded-xl border border-white/10 bg-white text-black p-6" onSubmit={handleLoginSubmit}>
                <div className="grid gap-1">
                  <label className={labelClass} htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    className={inputClass}
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <label className={labelClass} htmlFor="login-password">Password</label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      className={`${inputClass} pr-16 w-full`}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs underline leading-none"
                      onClick={() => setShowLoginPassword((v) => !v)}
                    >
                      {showLoginPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 select-none">
                    <input type="checkbox" className="accent-white" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    Remember me
                  </label>
                  <button 
                    type="button" 
                    onClick={handleForgotPasswordClick}
                    className="underline hover:text-primary"
                  >
                    Forgot password?
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="bg-primary !text-white rounded px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? "Logging in..." : "Login"}
                </button>
                
                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <GoogleLoginButton />
              </form>
            ) : (
              <form className="grid gap-4 rounded-xl border border-white/10 bg-white text-black p-6" onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="first-name">First name</label>
                    <input
                      id="first-name"
                      className={inputClass}
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="last-name">Last name</label>
                    <input
                      id="last-name"
                      className={inputClass}
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-1">
                  <label className={labelClass} htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    className={inputClass}
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="account-type">Account type</label>
                    <select
                      id="account-type"
                      className={`${inputClass} bg-black/10`}
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Seller">Seller</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="phone-number">Phone number</label>
                    <input
                      id="phone-number"
                      type="tel"
                      className={inputClass}
                      placeholder="+1 555 000 1234"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {isSeller && (
                  <div className="grid gap-4 p-4 rounded border border-brand/20 bg-brand/5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-brand">Seller Information</h3>
                      <span className="text-red-500 text-sm">* Required</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      As a seller, you need to provide additional information to verify your business.
                    </p>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="company-name">
                        Company name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="company-name"
                        className={inputClass}
                        placeholder="Your Company LLC"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required={isSeller}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="brand-image">
                        Brand image <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="brand-image"
                        type="file"
                        accept="image/*"
                        className="file:mr-4 file:rounded file:border-0 file:bg-primary file:text-black file:px-4 file:py-2 file:font-medium hover:file:opacity-90"
                        onChange={handleBrandImageChange}
                        required={isSeller}
                      />
                      {brandImage && (
                        <span className="text-xs text-green-700 break-all">{typeof brandImage === 'string' ? brandImage : brandImage.name}</span>
                      )}
                    </div>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="company-info">
                        Company info <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="company-info"
                        className={`${inputClass} min-h-[100px]`}
                        placeholder="Tell buyers about your company..."
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                        required={isSeller}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="vat-no">
                        VAT Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="vat-no"
                        className={inputClass}
                        placeholder="Enter your VAT number"
                        value={vatNo}
                        onChange={(e) => setVatNo(e.target.value)}
                        required={isSeller}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="stripe-account-id">
                        Stripe Account ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="stripe-account-id"
                        className={inputClass}
                        placeholder="Enter your Stripe account ID"
                        value={stripeAccountId}
                        onChange={(e) => setStripeAccountId(e.target.value)}
                        required={isSeller}
                      />
                    </div>
                  </div>
                )}

                {/* Company Licence - Available for all users */}
                <div className="grid gap-1">
                  <label className={labelClass} htmlFor="company-licence">Company licence</label>
                  <input
                    id="company-licence"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="file:mr-4 file:rounded file:border-0 file:bg-primary file:text-black file:px-4 file:py-2 file:font-medium hover:file:opacity-90"
                    onChange={handleCompanyLicenceChange}
                  />
                  {companyLicence && (
                    <span className="text-xs text-green-700 break-all">{typeof companyLicence === 'string' ? companyLicence : companyLicence.name}</span>
                  )}
                </div>

                {/* Address fields - available for all users */}
                <div className="grid gap-4 p-4 rounded border border-white/10">
                  <h3 className="text-lg font-medium text-brand">Address Information</h3>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="street">Street</label>
                    <input
                      id="street"
                      className={inputClass}
                      placeholder="123 Main Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="city">City</label>
                      <input
                        id="city"
                        className={inputClass}
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className={labelClass} htmlFor="zipcode">Zip code</label>
                      <input
                        id="zipcode"
                        className={inputClass}
                        placeholder="10001"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="country">Country</label>
                    <input
                      id="country"
                      className={inputClass}
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="address1">Address line 1</label>
                    <input
                      id="address1"
                      className={inputClass}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="address2">Address line 2</label>
                    <input
                      id="address2"
                      className={inputClass}
                      placeholder="Additional address information"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showRegPassword ? "text" : "password"}
                        className={`${inputClass} pr-16 w-full`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs underline leading-none"
                        onClick={() => setShowRegPassword((v) => !v)}
                      >
                        {showRegPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label className={labelClass} htmlFor="confirm-password">Confirm password</label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showRegConfirm ? "text" : "password"}
                        className={`${inputClass} pr-16 w-full`}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs underline leading-none"
                        onClick={() => setShowRegConfirm((v) => !v)}
                      >
                        {showRegConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      id="agree-terms-checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={agreementAccepted}
                      onChange={(e) => setAgreementAccepted(e.target.checked)}
                    />
                    <label htmlFor="agree-terms-checkbox" className="cursor-pointer">
                      I agree to the <span className="text-primary underline">Terms and Conditions</span>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-primary !text-white rounded px-4 py-2 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!agreementAccepted || isRegisterLoading}
                  >
                    {isRegisterLoading ? "Creating account..." : "Create account"}
                  </button>
                </div>
                
                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <GoogleLoginButton />
        </form>
            )}
          </div>
        </div>
      </section>

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setPendingRegistrationData(null);
          setPendingLoginData(null);
        }}
        email={pendingRegistrationData?.email || pendingLoginData?.email || ""}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        isLoading={otpLoading}
      />

      {/* Agreement Modal */}
      <AgreementModal
        isOpen={showAgreementModal}
        onClose={handleAgreementClose}
        onAccept={handleAgreementAccept}
        isLoading={false}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={handleForgotPasswordClose}
        onEmailSent={handleForgotPasswordEmailSent}
      />

      {/* OTP Verification Modal for Password Reset */}
      <OTPVerificationModal
        isOpen={showOTPVerificationModal}
        onClose={handleForgotPasswordClose}
        email={forgotPasswordEmail}
        onOTPVerified={handleOTPVerified}
      />

      {/* New Password Modal */}
      <NewPasswordModal
        isOpen={showNewPasswordModal}
        onClose={handleForgotPasswordClose}
        email={forgotPasswordEmail}
        onPasswordUpdated={handlePasswordUpdated}
      />
    </div>
  );
}


