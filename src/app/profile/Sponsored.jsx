"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { getRequest, putRequest } from "@/service";
import { toast } from "react-hot-toast";

export default function Sponsored() {
  const [activeSubTab, setActiveSubTab] = useState("stable");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const subTabs = [
    { key: "stable", label: "Stable", apiPath: "/api/stables" },
    { key: "trainer", label: "Trainer", apiPath: "/api/trainer" },
    { key: "horse", label: "Horse", apiPath: "/api/horse-market" },
    { key: "equipment", label: "Equipment", apiPath: "/api/equipments" },
    { key: "otherService", label: "Other Services", apiPath: "/api/otherService" },
  ];

  const loadData = async () => {
    const currentTab = subTabs.find((tab) => tab.key === activeSubTab);
    if (!currentTab) return;
    setLoading(true);
    try {
      const response = await getRequest(currentTab.apiPath);
      const items = Array.isArray(response) ? response : [];
      setData(items);
    } catch (error) {
      console.error(`Failed to load ${activeSubTab} data:`, error);
      toast.error(`Failed to load ${activeSubTab} data`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubTab]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowOptionsModal(true);
  };

  const handleUpdate = async (status, sponsoredType) => {
    if (!selectedItem) return;
    const currentTab = subTabs.find((tab) => tab.key === activeSubTab);
    if (!currentTab) return;
    
    setUpdating(true);
    try {
      const itemId = selectedItem._id || selectedItem.id;
      const updatePayload = {};
      
      if (status !== undefined) updatePayload.status = status;
      if (sponsoredType !== undefined) updatePayload.sponsoredType = sponsoredType;

      await putRequest(`${currentTab.apiPath}/${itemId}`, updatePayload);
      toast.success(`${currentTab.label} updated successfully!`);
      setShowOptionsModal(false);
      setSelectedItem(null);
      await loadData(); // Reload data
    } catch (error) {
      console.error("Failed to update:", error);
      toast.error("Failed to update. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getItemTitle = (item) => {
    if (activeSubTab === "stable") return item.Tittle || item.title || "Untitled";
    if (activeSubTab === "trainer") return item.title || "Untitled";
    if (activeSubTab === "horse") return item.horseName || "Untitled Horse";
    if (activeSubTab === "equipment") return item.productName || "Untitled Product";
    if (activeSubTab === "otherService") return item.title || "Untitled Service";
    return "Untitled";
  };

  const getItemImage = (item) => {
    if (activeSubTab === "stable") return item.image?.[0] || null;
    if (activeSubTab === "trainer") return item.images?.[0] || null;
    if (activeSubTab === "horse") return item.photos?.[0] || null;
    if (activeSubTab === "equipment") return item.photos?.[0] || null;
    if (activeSubTab === "otherService") return item.images?.[0] || null;
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand">Sponsored Management</h2>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-[color:var(--primary)]">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeSubTab === tab.key
                ? "text-[color:var(--primary)] border-b-2 border-[color:var(--primary)]"
                : "text-brand/60 hover:text-brand"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      {loading ? (
        <div className="text-center py-10 text-brand/60">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-brand/60">
          No {subTabs.find((tab) => tab.key === activeSubTab)?.label.toLowerCase() || "items"} found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((item) => {
            const itemId = item._id || item.id;
            const title = getItemTitle(item);
            const image = getItemImage(item);
            const status = item.status || "active";
            const sponsoredType = item.sponsoredType || "normal";

            return (
              <div
                key={itemId}
                className="bg-white rounded-lg border border-[color:var(--primary)] shadow-sm p-4 relative"
              >
                <div className="relative w-full h-40 mb-3 rounded overflow-hidden bg-gray-100">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-brand/40">
                      No Image
                    </div>
                  )}
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md"
                    onClick={() => handleItemClick(item)}
                    title="Options"
                  >
                    <MoreVertical className="w-5 h-5 text-brand" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-brand mb-2">{title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sponsoredType === "sponsored"
                        ? "bg-blue-100 text-blue-800"
                        : sponsoredType === "reported"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {sponsoredType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Options Modal */}
      {showOptionsModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-brand mb-4">
              Update {subTabs.find((tab) => tab.key === activeSubTab)?.label || "Item"}
            </h3>
            <p className="text-sm text-brand/70 mb-4">{getItemTitle(selectedItem)}</p>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-brand mb-2">
                  Status
                </label>
                <select
                  value={selectedItem.status || "active"}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, status: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                  disabled={updating}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Sponsored Type */}
              <div>
                <label className="block text-sm font-medium text-brand mb-2">
                  Sponsored Type
                </label>
                <select
                  value={selectedItem.sponsoredType || "normal"}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      sponsoredType: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]"
                  disabled={updating}
                >
                  <option value="normal">Normal</option>
                  <option value="sponsored">Sponsored</option>
                  {/* <option value="reported">Reported</option> */}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowOptionsModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 rounded border border-[color:var(--primary)] text-brand hover:bg-[color:var(--primary)]/5 transition"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdate(
                    selectedItem.status,
                    selectedItem.sponsoredType
                  )
                }
                disabled={updating}
                className={`flex-1 px-4 py-2 rounded text-white font-medium transition ${
                  updating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90"
                }`}
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

