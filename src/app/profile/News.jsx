"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { postRequest, putRequest, deleteRequest, uploadFiles } from "@/service";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", details: "", date: "" });
  const [showModal, setShowModal] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [prevImages, setPrevImages] = useState([]);

  function reset() {
    setEditingId(null);
    setForm({ title: "", details: "", date: "" });
    setImagePreviews([]);
    setPrevImages([]);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load news", e);
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!form.title || !form.details || !form.date) return;
    try {
      // Determine images to send
      let imageUrls = prevImages || [];
      const files = form._files || [];
      if (Array.isArray(files) && files.length > 0) {
        imageUrls = await uploadFiles(files);
      }

      const payload = {
        title: form.title,
        details: form.details,
        date: form.date,
        images: imageUrls,
      };

      if (editingId) {
        const updated = await putRequest(`/api/news/${editingId}`, payload);
        setItems((prev) => prev.map((n) => (n._id === editingId ? updated : n)));
        toast.success("News updated");
      } else {
        const created = await postRequest("/api/news", payload);
        setItems((prev) => [created, ...prev]);
        toast.success("News created");
      }
      reset();
      setShowModal(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to submit news", e);
      toast.error("Action failed");
    }
  }

  async function onDelete(id) {
    try {
      await deleteRequest(`/api/news/${id}`);
      setItems((prev) => prev.filter((n) => n._id !== id));
      toast.success("News deleted");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete news", e);
      toast.error("Delete failed");
    }
  }

  function onEdit(item) {
    setEditingId(item._id);
    setForm({ title: item.title || "", details: item.details || "", date: item.date ? item.date.substring(0,10) : "" });
    setShowModal(true);
    setImagePreviews(item.images || []);
    setPrevImages(item.images || []);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand">News</h2>
          <p className="text-sm text-brand/80">Create and manage news.</p>
        </div>
        <button
          className="px-4 py-2 rounded bg-[color:var(--primary)] !text-white font-medium hover:bg-[color:var(--primary)]/90 transition cursor-pointer"
          onClick={() => { reset(); setShowModal(true); }}
        >
          + Add New
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-brand/60">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((n) => (
            <div key={n._id} className="bg-white rounded-lg border border-[color:var(--primary)] shadow-sm p-4 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-1 rounded hover:bg-gray-100" title="Edit" onClick={() => onEdit(n)}>
                  <Edit className="w-5 h-5 text-blue-600 cursor-pointer" />
                </button>
                <button className="p-1 rounded hover:bg-gray-100" title="Delete" onClick={() => onDelete(n._id)}>
                  <Trash className="w-5 h-5 text-red-600 cursor-pointer" />
                </button>
              </div>
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-brand mb-1">{n.title}</h3>
              <p className="text-sm text-brand/80">{n.details}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-x-hidden">
          <div className="bg-white rounded-lg shadow-lg py-8 px-4 w-full max-w-2xl relative overflow-x-hidden">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => { setShowModal(false); reset(); }}
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-brand mb-4">{editingId ? 'Edit News' : 'Add News'}</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Title</label>
                <input name="title" value={form.title} onChange={onChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Date</label>
                <input type="date" name="date" value={form.date} onChange={onChange} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Details</label>
                <textarea name="details" value={form.details} onChange={onChange} rows={4} className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-[color:var(--primary)]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand mb-1">Images</label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
                    setPrevImages([]);
                    // Store files temporarily on form as a non-serialized field
                    setForm((p) => ({ ...p, _files: files }));
                  }}
                  className="w-full text-sm"
                />
                {(imagePreviews.length > 0 || prevImages.length > 0) && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(imagePreviews.length > 0 ? imagePreviews : prevImages).map((src, idx) => (
                      <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-14 h-14 object-cover rounded border" />
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="w-full py-2 rounded bg-[color:var(--primary)] text-white font-medium hover:bg-[color:var(--primary)]/90 transition">
                {editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


