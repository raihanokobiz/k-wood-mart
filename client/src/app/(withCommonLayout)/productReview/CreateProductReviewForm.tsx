"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";



export default function CreateProductReviewForm() {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("district", district);
      formData.append("comment", comment);
      if (image) formData.append("image", image);

      const res = await fetch(`${BASE_URL}/product-review`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Review added successfully!");
        setName("");
        setDistrict("");
        setComment("");
        setImage(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to add review.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md"
    >
      <h2 className="text-xl font-semibold">Add a Review</h2>

      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        type="text"
        placeholder="District"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        required
      />

      <Textarea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Review"}
      </Button>
    </form>
  );
}
