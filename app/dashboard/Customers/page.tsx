"use client";

import { useEffect, useState, useTransition } from "react";
import CustomerCard from "./CustomerCard";
import CustomerSearch from "./CustomerSearch";
import { getCustomers } from "@/app/actions/customers";
import {
    List,
    Search,
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";

type Customer = Awaited<
    ReturnType<typeof getCustomers>
>["data"][number];

const ITEMS_PER_PAGE = 5;

export default function CustomersPage() {
    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [search, setSearch] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [isPending, startTransition] =
        useTransition();

    // ---------------------------------------------------------
    // Load customers
    // ---------------------------------------------------------

    const loadCustomers = (
        page: number,
        searchValue: string
    ) => {
        startTransition(async () => {
            try {
                const result = await getCustomers(
                    page,
                    ITEMS_PER_PAGE,
                    searchValue
                );

                setCustomers(result.data);
                setTotal(result.total);
                setCurrentPage(result.page);
                setTotalPages(result.totalPages);
            } catch (error) {
                console.error(
                    "Failed to load customers:",
                    error
                );
            } finally {
                setLoading(false);
            }
        });
    };

    // ---------------------------------------------------------
    // Initial load
    // ---------------------------------------------------------

    useEffect(() => {
        loadCustomers(1, "");
    }, []);

    // ---------------------------------------------------------
    // Search
    // ---------------------------------------------------------

    useEffect(() => {
        // Don't run the search request on initial render
        if (search === "") {
            return;
        }

        const timer = setTimeout(() => {
            loadCustomers(1, search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // ---------------------------------------------------------
    // Previous page
    // ---------------------------------------------------------

    const goToPreviousPage = () => {
        if (
            currentPage <= 1 ||
            isPending
        ) {
            return;
        }

        loadCustomers(
            currentPage - 1,
            search
        );
    };

    // ---------------------------------------------------------
    // Next page
    // ---------------------------------------------------------

    const goToNextPage = () => {
        if (
            currentPage >= totalPages ||
            isPending
        ) {
            return;
        }

        loadCustomers(
            currentPage + 1,
            search
        );
    };

    // ---------------------------------------------------------
    // Search changed
    // ---------------------------------------------------------

    const handleSearchChange = (
        value: string
    ) => {
        setSearch(value);

        // Immediately reset page visually
        if (currentPage !== 1) {
            setCurrentPage(1);
        }

        // If search is cleared, immediately reload all customers
        if (!value.trim()) {
            loadCustomers(1, "");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-7xl">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                            "
                        >
                            <Users size={22} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Customers
                            </h1>

                            <p className="text-sm text-gray-500">
                                Manage all your customers
                            </p>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="mb-3">

                        <h2 className="font-semibold text-gray-900">
                            Search Customers
                        </h2>

                    </div>

                    <CustomerSearch
                        value={search}
                        onChange={handleSearchChange}
                    />

                </div>

                {/* =================================================
                    RESULT COUNT
                ================================================= */}

                <div className="mb-5 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                        <List
                            size={20}
                            className="text-gray-600"
                        />

                        <p className="text-xl font-semibold text-gray-900">

                            {total}{" "}

                            {total === 1
                                ? "Customer"
                                : "Customers"}

                        </p>

                    </div>

                    {isPending && (
                        <Loader2
                            size={18}
                            className="animate-spin text-blue-600"
                        />
                    )}

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div className="py-20 text-center">

                        <Loader2
                            size={24}
                            className="mx-auto mb-3 animate-spin text-blue-600"
                        />

                        <p className="text-sm text-gray-500">
                            Loading customers...
                        </p>

                    </div>
                )}

                {/* =================================================
                    NO CUSTOMERS
                ================================================= */}

                {!loading &&
                    customers.length === 0 &&
                    total === 0 && (

                        <div
                            className="
                                flex
                                min-h-[300px]
                                flex-col
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-dashed
                                border-gray-300
                                bg-white
                                text-center
                            "
                        >

                            <Users
                                size={30}
                                className="mb-3 text-gray-400"
                            />

                            <h2 className="font-semibold text-gray-900">
                                {search.trim()
                                    ? "No matching customer"
                                    : "No customers found"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {search.trim()
                                    ? "Try searching by another name, phone or CNIC."
                                    : "There are currently no customers."}
                            </p>

                        </div>
                    )}

                {/* =================================================
                    CUSTOMER CARDS
                ================================================= */}

                {!loading &&
                    customers.length > 0 && (

                        <div className="flex flex-col gap-4">

                            {customers.map(
                                (customer) => (

                                    <CustomerCard
                                        key={customer.id}
                                        customer={customer}
                                    />

                                )
                            )}

                        </div>
                    )}

                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    totalPages > 1 && (

                        <div className="mt-6 flex items-center justify-between gap-3">

                            {/* Previous */}

                            <button
                                type="button"
                                onClick={
                                    goToPreviousPage
                                }
                                disabled={
                                    currentPage === 1 ||
                                    isPending
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition
                                    hover:bg-gray-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                <ChevronLeft
                                    size={16}
                                />

                                Previous

                            </button>

                            {/* Page */}

                            <p className="text-sm text-gray-500">

                                Page{" "}

                                <span className="font-semibold text-gray-800">
                                    {currentPage}
                                </span>

                                {" "}of{" "}

                                <span className="font-semibold text-gray-800">
                                    {totalPages}
                                </span>

                            </p>

                            {/* Next */}

                            <button
                                type="button"
                                onClick={
                                    goToNextPage
                                }
                                disabled={
                                    currentPage === totalPages ||
                                    isPending
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition
                                    hover:bg-gray-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >

                                Next

                                <ChevronRight
                                    size={16}
                                />

                            </button>

                        </div>
                    )}

            </div>

        </main>
    );
}