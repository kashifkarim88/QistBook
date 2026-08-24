// app/dashboard/sales/[id]/receipt/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function ReceiptPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ monthlyInstallment?: string }>;
}) {
    const { id } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};

    const agreement = await prisma.installmentAgreement.findUnique({
        where: { id },
        include: {
            customer: {
                include: {
                    guarantors: true,
                },
            },
            bike: true,
            mobile: true,
            payments: {
                orderBy: { paymentDate: "asc" },
            },
        },
    });

    if (!agreement) {
        notFound();
    }

    const advancePayment = agreement.payments.find(
        (p) => p.paymentType === "ADVANCE"
    );

    const monthlyInstallment = resolvedSearchParams.monthlyInstallment
        ? parseFloat(resolvedSearchParams.monthlyInstallment)
        : 0;

    const remainingBalance =
        agreement.totalAmount - (advancePayment?.amountPaid || 0);

    // Extract nextDueDate directly from advancePayment record
    const nextDueDate = advancePayment?.nextDueDate
        ? new Date(advancePayment.nextDueDate).toLocaleDateString()
        : new Date(new Date(agreement.startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white text-black min-h-screen border rounded-md shadow-sm print:shadow-none print:border-none print:p-0">
            {/* Top Action Bar - Hidden during printing */}
            <div className="flex justify-between items-center mb-6 print:hidden border-b pb-4">
                <div>
                    <h1 className="text-xl font-bold">Sale Agreement & Receipt</h1>
                    <p className="text-sm text-gray-500">
                        Agreement ID: <span className="font-mono">{agreement.id}</span>
                    </p>
                </div>
                <PrintButton />
            </div>

            {/* Header */}
            <div className="text-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                    Rahim Dad Autos
                </h2>
                <p className="text-xs text-gray-600">
                    Main Market Road, City • Contact: +92 300 0000000
                </p>
                <p className="text-xs font-semibold mt-1">INSTALLMENT SALE AGREEMENT</p>
            </div>

            {/* Date & Agreement Meta Header */}
            <div className="flex justify-between text-xs mb-6 border-b pb-2">
                <div>
                    <span className="font-bold">Agreement Date:</span>{" "}
                    {new Date(agreement.startDate).toLocaleDateString()}
                </div>
                <div>
                    <span className="font-bold">Next Due Date:</span>{" "}
                    <span className="font-semibold">{nextDueDate}</span>
                </div>
                <div>
                    <span className="font-bold">Category:</span> {agreement.category}
                </div>
            </div>

            {/* Customer & Guarantor Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="border p-3 rounded print:border-gray-400">
                    <h3 className="font-bold border-b pb-1 mb-2 text-xs uppercase text-gray-700">
                        Customer Details
                    </h3>
                    <p><span className="font-semibold">Name:</span> {agreement.customer.fullName}</p>
                    <p><span className="font-semibold">Father Name:</span> {agreement.customer.fatherName}</p>
                    <p><span className="font-semibold">CNIC:</span> {agreement.customer.cnic}</p>
                    <p><span className="font-semibold">Phone:</span> {agreement.customer.phone}</p>
                    <p><span className="font-semibold">Address:</span> {agreement.customer.address}</p>
                </div>
                <div className="border p-3 rounded print:border-gray-400">
                    <h3 className="font-bold border-b pb-1 mb-2 text-xs uppercase text-gray-700">
                        Guarantor Details
                    </h3>
                    {agreement.customer.guarantors && agreement.customer.guarantors.length > 0 ? (
                        <div key={agreement.customer.guarantors[0].id} className="text-sm mb-2 last:mb-0">
                            <p><span className="font-semibold">Name:</span> {agreement.customer.guarantors[0].fullName}</p>
                            <p><span className="font-semibold">CNIC:</span> {agreement.customer.guarantors[0].cnic}</p>
                            <p><span className="font-semibold">Phone:</span> {agreement.customer.guarantors[0].phone}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">No guarantor details found</p>
                    )}
                </div>
            </div>

            {/* Item Details */}
            <div className="border p-3 rounded mb-6 text-sm print:border-gray-400">
                <h3 className="font-bold border-b pb-1 mb-2 text-xs uppercase text-gray-700">
                    Item Specifications
                </h3>
                {agreement.category === "BIKE" && agreement.bike && (
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="font-semibold">Brand/Model:</span> {agreement.bike.brand} {agreement.bike.model}</p>
                        <p><span className="font-semibold">Color:</span> {agreement.bike.color}</p>
                        <p><span className="font-semibold">Engine No:</span> {agreement.bike.engineNumber}</p>
                        <p><span className="font-semibold">Chassis No:</span> {agreement.bike.chassisNumber}</p>
                    </div>
                )}

                {agreement.category === "MOBILE" && agreement.mobile && (
                    <div className="grid grid-cols-2 gap-2">
                        <p><span className="font-semibold">Brand/Model:</span> {agreement.mobile.brand} {agreement.mobile.model}</p>
                        <p><span className="font-semibold">IMEI 1:</span> {agreement.mobile.imei1}</p>
                        {agreement.mobile.imei2 && (
                            <p><span className="font-semibold">IMEI 2:</span> {agreement.mobile.imei2}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Financial Summary Table */}
            <div className="border rounded mb-8 print:border-gray-400">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 print:bg-gray-200 border-b">
                        <tr>
                            <th className="p-2">Description</th>
                            <th className="p-2 text-right">Amount / Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-2">Total Agreement Price</td>
                            <td className="p-2 text-right font-medium">
                                Rs. {agreement.totalAmount.toLocaleString()}
                            </td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">Advance Paid</td>
                            <td className="p-2 text-right font-medium text-green-700">
                                Rs. {(advancePayment?.amountPaid || 0).toLocaleString()}
                            </td>
                        </tr>
                        <tr className="bg-gray-50 print:bg-gray-100 font-bold">
                            <td className="p-2">Remaining Balance</td>
                            <td className="p-2 text-right">
                                Rs. {remainingBalance.toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Terms & Signatures */}
            <div className="mt-12 pt-4 border-t text-xs">
                <p className="mb-8 text-gray-600">
                    Declaration: I confirm that the item details above are accurate and I agree to clear the remaining balance of Rs. {remainingBalance.toLocaleString()} in monthly installments of Rs. {monthlyInstallment.toLocaleString()} starting from {nextDueDate}.
                </p>

                <div className="grid grid-cols-3 gap-4 text-center mt-12">
                    <div>
                        <div className="border-b border-black mb-1 w-3/4 mx-auto"></div>
                        <p className="font-semibold">Customer Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-black mb-1 w-3/4 mx-auto"></div>
                        <p className="font-semibold">Guarantor Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-black mb-1 w-3/4 mx-auto"></div>
                        <p className="font-semibold">Authorized Representative</p>
                    </div>
                </div>
            </div>
        </div>
    );
}