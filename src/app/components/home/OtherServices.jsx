"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRequest } from "@/service";

// Star Rating Component
const StarRating = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <svg
          key={`full-${index}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative w-4 h-4">
          <svg
            className="w-4 h-4 text-gray-300 absolute"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className="w-4 h-4 text-yellow-400 absolute overflow-hidden"
            fill="currentColor"
            viewBox="0 0 20 20"
            style={{ width: '50%' }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <svg
          key={`empty-${index}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
};

const Coach = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getRequest("/api/otherService");
        const normalized = Array.isArray(data)
          ? data.slice(0, 4).map((t) => ({
              id: t._id,
              name: t?.userId ? `${t.userId.firstName || ""} ${t.userId.lastName || ""}`.trim() : t.title || "Service",
              title: t.title || "",
              image: Array.isArray(t.images) && t.images.length > 0 ? t.images[0] : "/product/3.jpg",
              pricePerHour: typeof t.pricePerHour === "number" ? t.pricePerHour : Number(t.pricePerHour) || 0,
              rating: typeof t.Rating === "number" ? t.Rating : Number(t.rating) || 0,
              experience: t.experience || t.Experience || "",
              serviceType: t.serviceType || "",
            }))
          : [];
        setServices(normalized);
      } catch (e) {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="items-center justify-items-center p-8 text-center">
          <h2 className="text-2xl font-semibold primary mb-4"> Other Services for Your Horse</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-0.5 bg-orange-300"></div>
            <div className="w-16 h-2 bg-secondary mx-2"></div>
            <div className="w-16 h-0.5 bg-orange-300"></div>
          </div>
          <p className="text-gray-600 text-lg">Find vets, farriers, dentists, osteopaths and more</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">Loading services...</div>
          )}
          {!loading && error && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && services.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">No services found</div>
          )}
          {!loading && !error && services.map((svc) => (
            <div key={svc.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Service Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={svc.image}
                  alt={svc.title || svc.name}
                  width={300}
                  height={256}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                  <span className="text-sm font-semibold text-gray-800">€{svc.pricePerHour}/hr</span>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{svc.title || svc.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{svc.serviceType}</p>
                {svc.experience && (
                  <p className="text-gray-500 text-sm mb-4">Experience: {svc.experience}</p>
                )}
                
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={svc.rating || 0} />
                </div>
                
                {/* CTA Button */}
                <button 
                  onClick={() => router.push(`/bookingOtherService?serviceId=${svc.id}`)}
                  className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium cursor-pointer"
                >
                  View & Book
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={() => router.push('/services?type=otherServices')}
            className="bg-secondary text-white px-8 py-3 rounded-md hover:bg-gray-900 transition-colors duration-200 font-medium text-lg cursor-pointer"
          >
            See All Other Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Coach;
