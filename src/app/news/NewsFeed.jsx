"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "";
  }
}

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Right side shows cards list and details below

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setItems(list);
          if (list.length > 0) {
            setSelected(list[0]);
            setCurrentImageIndex(0);
          }
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load news");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((n) =>
      (n.title || "").toLowerCase().includes(term) ||
      (n.details || "").toLowerCase().includes(term)
    );
  }, [items, search]);

  const closeModal = () => {
    setSelected(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selected?.images?.length) return;
    setCurrentImageIndex((i) => (i + 1) % selected.images.length);
  };

  const prevImage = () => {
    if (!selected?.images?.length) return;
    setCurrentImageIndex((i) => (i - 1 + selected.images.length) % selected.images.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">News about the Equiherds</h2>
        <div className="w-full max-w-xs">
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring"
          />
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {loading && (
        <div className="text-sm text-gray-500">Loading news…</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Large image with thumbnails and details below */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-100">
              <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[460px]">
                <Image
                  src={(selected?.images && selected.images[currentImageIndex]) || "/product/2.jpg"}
                  alt={selected?.title || "News image"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {selected?.images && selected.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {selected.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${idx === currentImageIndex ? "border-brand" : "border-gray-200 hover:border-gray-300"}`}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="100px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Details under the image */}
            <div className="mt-5">
              <h2 className="text-xl font-semibold text-brand">{selected?.title || ""}</h2>
              <h2 className="text-sm text-gray-600 mt-1">Date: {formatDate(selected?.date)}</h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selected?.details || "Select a news item from the feed to view details."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Feed (cards only) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-semibold text-brand">News Feed</h4>
              </div>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filtered.map((n) => (
                  <button
                    key={n._id}
                    className={`w-full text-left rounded-lg border ${selected?._id === n._id ? "border-brand bg-brand/5" : "border-gray-200 hover:bg-gray-50"} p-3 transition`}
                    onClick={() => { setSelected(n); setCurrentImageIndex(0); }}
                  >
                    <div className="flex gap-3">
                      <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={(Array.isArray(n.images) && n.images[0]) || "/product/2.jpg"}
                          alt={n.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand line-clamp-2">{n.title}</div>
                        <div className="mt-0.5 text-[11px] text-gray-500">{formatDate(n.date)}</div>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-500">No news found.</div>
                )}
              </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


