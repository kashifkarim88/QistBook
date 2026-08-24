"use client";

import { Search, X } from "lucide-react";

type CustomerSearchProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function CustomerSearch({
    value,
    onChange,
}: CustomerSearchProps) {
    return (
        <div className="relative w-full max-w-xl">
            <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by name, phone or CNIC..."
                className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    bg-white
                    py-3
                    pl-12
                    pr-12
                    text-sm
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                "
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-gray-700
                    "
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}