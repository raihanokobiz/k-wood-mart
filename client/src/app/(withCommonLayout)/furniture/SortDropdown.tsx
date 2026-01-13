"use client";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const SortDropdown = ({ onSortChange, currentSort }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const sortOptions = [
        { value: "default", label: "Default" },
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        // { value: "newest", label: "Newest First" },
    ];

    return (
        <div ref={dropdownRef} className="relative z-[100]">
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
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[101]">
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