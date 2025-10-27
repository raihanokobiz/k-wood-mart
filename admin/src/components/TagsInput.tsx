// components/TagsInput.tsx
"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagsInput({
  value = [],
  onChange,
  placeholder = "Add a tag",
}: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="border p-2 rounded-md flex flex-wrap gap-2">
      {value.map((tag, index) => (
        <span
          key={index}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
        >
          {tag}
          <X
            className="h-4 w-4 cursor-pointer"
            onClick={() => removeTag(index)}
          />
        </span>
      ))}
      <form onSubmit={addTag}>
        <input
          className="outline-none px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
      </form>
    </div>
  );
}
