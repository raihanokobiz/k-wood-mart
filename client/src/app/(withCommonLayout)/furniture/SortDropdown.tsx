"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const SortDropdown = ({ onSortChange, currentSort }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        // { value: "newest", label: "Newest First" },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className=" cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-brown-500 transition"
            >
                <span className="text-sm text-black">
                    Sort by: {sortOptions.find((o) => o.value === currentSort)?.label}
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onSortChange(option.value);
                                setIsOpen(false);
                            }}
                            className="cursor-pointer w-full text-left px-4 py-3 text-sm text-black hover:bg-brown-50 transition first:rounded-t-lg last:rounded-b-lg"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};