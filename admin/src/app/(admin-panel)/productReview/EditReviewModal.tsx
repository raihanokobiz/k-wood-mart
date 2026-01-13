"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  review: {
    _id: string;
    name: string;
    district?: string;
    youtubeUrl?: string;
  } | null;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  review,
}) => {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setName(review.name);
      setDistrict(review.district || "");
      setYoutubeUrl(review.youtubeUrl || "");
    }
  }, [review]);

  const handleUpdate = async () => {
    if (!review) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("district", district);
      formData.append("youtubeUrl", youtubeUrl);

      await onUpdate(review._id, formData);
      onClose();
    } catch (error) {
      toast.error("Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!review) return;

    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      await onDelete(review._id);
      onClose();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !review) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black">Edit Review</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Enter your district"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* YouTube Link */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                YouTube Video Link
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />

              {/* Preview YouTube video */}
              {youtubeUrl && youtubeUrl.includes("youtube.com") && (
                <div className="mt-3 aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg border-2 border-gray-200"
                    src={youtubeUrl.replace("watch?v=", "embed/")}
                    title="YouTube video preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};