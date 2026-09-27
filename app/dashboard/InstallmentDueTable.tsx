"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
    Phone,
    Banknote,
    CalendarDays,
    User,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import { getClientsDueToday } from "@/app/actions/duesToday";

type Agreement = any;

type Props = {
    initialData: Agreement[];
    initialTotal: number;
    initialPage: number;
    initialTotalPages: number;
};

const ITEMS_PER_PAGE = 5;

export default function InstallmentDueTable({
    initialData,
    initialTotal,
    initialPage,
    initialTotalPages,
}: Props) {
    const [customers, setCustomers] =
        useState<Agreement[]>(initialData);

    const [total, setTotal] =
        useState(initialTotal);

    const [currentPage, setCurrentPage] =
        useState(initialPage);

    const [totalPages, setTotalPages] =
        useState(initialTotalPages);

    const [search, setSearch] =
        useState("");

    const [searchInput, setSearchInput] =
        useState("");

    const [isPending, startTransition] =
        useTransition();

    // ---------------------------------------------------------
    // Load page from server
    // ---------------------------------------------------------

    const loadCustomers = (
        page: number,
        searchValue: string
    ) => {
        startTransition(async () => {
            const result = await getClientsDueToday(
                page,
                ITEMS_PER_PAGE,
                searchValue
            );

            setCustomers(result.data);
            setTotal(result.total);
            setCurrentPage(result.page);
            setTotalPages(result.totalPages);
        });
    };

    // ---------------------------------------------------------
    // Search debounce
    // ---------------------------------------------------------

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);

            loadCustomers(1, searchInput);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // ---------------------------------------------------------
    // Format date
    // ---------------------------------------------------------

    const formatDate = (date: Date | string | null) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-PK",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ---------------------------------------------------------
    // Previous page
    // ---------------------------------------------------------

    const goToPreviousPage = () => {
        if (currentPage <= 1 || isPending) {
            return;
        }

        loadCustomers(
            currentPage - 1,
            searchInput
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
            searchInput
        );
    };

    return (
        <div className="w-full min-w-0">

            {/* SEARCH */}

            <div className="mb-4 w-full">

                <div className="relative w-full">

                    <Search
                        className="
                            pointer-events-none
                            absolute
                            left-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(
                                e.target.value
                            )
                        }
                        placeholder="Search customer name or phone number..."
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            pl-10
                            pr-10
                            text-sm
                            text-slate-700
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-100
                        "
                    />

                    {searchInput && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearchInput("")
                            }
                            aria-label="Clear search"
                            className="
                                absolute
                                right-3
                                top-1/2
                                flex
                                h-6
                                w-6
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-600
                            "
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}

                </div>

                {/* RESULT COUNT */}

                <div className="mt-2 flex items-center justify-between gap-3 px-1">

                    <p className="text-xs text-slate-400">

                        {searchInput ? (
                            <>
                                Found{" "}
                                <span className="font-semibold text-slate-600">
                                    {total}
                                </span>{" "}
                                customers
                            </>
                        ) : (
                            <>
                                <span className="font-semibold text-slate-600">
                                    {total}
                                </span>{" "}
                                customers due today
                            </>
                        )}

                    </p>

                    {isPending && (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                    )}

                </div>

            </div>

            {/* NO SEARCH RESULTS */}

            {customers.length === 0 ? (

                <div
                    className="
                        rounded-xl
                        border
                        border-dashed
                        border-slate-300
                        bg-white
                        px-4
                        py-10
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-100
                        "
                    >
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                        No customer found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Try searching with a different name or phone number.
                    </p>

                </div>

            ) : (

                <>
                    {/* MOBILE */}

                    <div className="space-y-3 sm:hidden">

                        {customers.map((agreement) => {

                            const latestPayment =
                                agreement.payments?.[0];

                            const customerName =
                                agreement.customer?.fullName ??
                                "Unknown Customer";

                            const customerPhone =
                                agreement.customer?.phone ??
                                "N/A";

                            const remainingBalance =
                                Number(
                                    latestPayment?.remainingBalance ??
                                    0
                                );

                            const nextDueDate =
                                latestPayment?.nextDueDate
                                    ? new Date(
                                        latestPayment.nextDueDate
                                    )
                                    : null;

                            return (
                                <div
                                    key={agreement.id}
                                    className="
                                        w-full
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        p-4
                                        shadow-sm
                                        transition
                                        hover:shadow-md
                                    "
                                >

                                    <div className="flex min-w-0 items-center justify-between gap-3">

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-slate-100
                                                    text-slate-500
                                                "
                                            >
                                                <User className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {customerName}
                                                </p>

                                                <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">

                                                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                                    <span className="truncate">
                                                        {customerPhone}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div
                                        className="
                                            mt-4
                                            grid
                                            grid-cols-2
                                            gap-3
                                            border-t
                                            border-slate-100
                                            pt-4
                                        "
                                    >

                                        <div className="min-w-0">

                                            <div className="flex items-center gap-1.5">

                                                <CalendarDays
                                                    className="h-3.5 w-3.5 shrink-0 text-slate-400"
                                                />

                                                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Due Date
                                                </span>

                                            </div>

                                            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                                                {formatDate(
                                                    nextDueDate
                                                )}
                                            </p>

                                        </div>

                                        <div className="min-w-0">

                                            <div className="flex items-center gap-1.5">

                                                <Banknote
                                                    className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                                                />

                                                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                                    Remaining
                                                </span>

                                            </div>

                                            <p className="mt-1 truncate text-sm font-bold text-emerald-600">
                                                PKR{" "}
                                                {remainingBalance.toLocaleString()}
                                            </p>

                                        </div>

                                    </div>

                                    <Link
                                        href={`/collect-payment/${agreement.id}`}
                                        className="
                                            mt-4
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-lg
                                            bg-emerald-600
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-white
                                            transition-colors
                                            hover:bg-emerald-700
                                            active:bg-emerald-800
                                        "
                                    >
                                        <Banknote className="h-4 w-4" />
                                        Collect Payment
                                    </Link>

                                </div>
                            );
                        })}

                    </div>

                    {/* DESKTOP */}

                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 sm:block">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[700px] text-sm">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                                        <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                                            Customer
                                        </th>

                                        <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                                            Phone
                                        </th>

                                        <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                                            Due Date
                                        </th>

                                        <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                                            Remaining
                                        </th>

                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 bg-white">

                                    {customers.map(
                                        (agreement) => {

                                            const latestPayment =
                                                agreement.payments?.[0];

                                            const customerName =
                                                agreement.customer?.fullName ??
                                                "Unknown Customer";

                                            const customerPhone =
                                                agreement.customer?.phone ??
                                                "N/A";

                                            const remainingBalance =
                                                Number(
                                                    latestPayment?.remainingBalance ??
                                                    0
                                                );

                                            const nextDueDate =
                                                latestPayment?.nextDueDate
                                                    ? new Date(
                                                        latestPayment.nextDueDate
                                                    )
                                                    : null;

                                            return (
                                                <tr
                                                    key={agreement.id}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="max-w-[220px] px-4 py-4">

                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-slate-100
                                                                "
                                                            >
                                                                <User className="h-4 w-4 text-slate-500" />
                                                            </div>

                                                            <p className="truncate font-semibold text-slate-800">
                                                                {customerName}
                                                            </p>

                                                        </div>

                                                    </td>

                                                    <td className="max-w-[180px] px-4 py-4">

                                                        <div className="flex min-w-0 items-center gap-2 text-slate-600">

                                                            <Phone className="h-4 w-4 shrink-0 text-slate-400" />

                                                            <span className="truncate">
                                                                {customerPhone}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">

                                                        <div className="flex items-center gap-2 text-slate-600">

                                                            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

                                                            <span>
                                                                {formatDate(
                                                                    nextDueDate
                                                                )}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-4">

                                                        <div className="flex items-center gap-2 font-semibold text-emerald-600">

                                                            <Banknote className="h-4 w-4 shrink-0" />

                                                            <span>
                                                                PKR{" "}
                                                                {remainingBalance.toLocaleString()}
                                                            </span>

                                                        </div>

                                                    </td>

                                                    <td className="px-4 py-4 text-right">

                                                        <Link
                                                            href={`/collect-payment/${agreement.id}`}
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                whitespace-nowrap
                                                                rounded-lg
                                                                bg-emerald-600
                                                                px-4
                                                                py-2
                                                                text-xs
                                                                font-semibold
                                                                text-white
                                                                hover:bg-emerald-700
                                                            "
                                                        >
                                                            <Banknote className="h-4 w-4" />
                                                            Collect Payment
                                                        </Link>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* PAGINATION */}

                    {totalPages > 1 && (

                        <div className="mt-4 flex items-center justify-between gap-3">

                            <button
                                type="button"
                                onClick={goToPreviousPage}
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
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            <p className="text-xs text-slate-500">

                                Page{" "}

                                <span className="font-semibold text-slate-700">
                                    {currentPage}
                                </span>

                                {" "}of{" "}

                                <span className="font-semibold text-slate-700">
                                    {totalPages}
                                </span>

                            </p>

                            <button
                                type="button"
                                onClick={goToNextPage}
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
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>

                        </div>

                    )}

                </>

            )}

        </div>
    );
}