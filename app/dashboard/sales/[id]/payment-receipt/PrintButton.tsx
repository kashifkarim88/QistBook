// app/dashboard/sales/[id]/receipt/PrintButton.tsx
"use client";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition"
        >
            Print Receipt
        </button>
    );
}