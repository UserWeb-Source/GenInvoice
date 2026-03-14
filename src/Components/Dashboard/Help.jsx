import React from 'react'

export default function Help() {
    return (
            <div className="min-h-screen bg-gray-50  ">
                <div className="mainpanel-container mx-5 mt-6">
                    <p className="text-4xl text-cyan-900 font-bold"> GenInvoice – Help Guide </p>
                    <p className="text-gray-500">   Welcome to <span className="font-semibold">GenInvoice</span>. This tool
                                                    helps you quickly create professional invoices, preview them, and
                                                    download or print them as PDF. </p>
                </div>
                <div className="max-w-4xl  rounded-2xl p-8">

                    {/* Section 1 */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                            1. Creating an Invoice
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>Enter your business details (name, address, contact).</li>
                            <li>Add customer information.</li>
                            <li>Fill invoice number and date.</li>
                            <li>Add items with description, quantity, and price.</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                            2. Adding Items
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>Click <span className="font-medium">Add Item</span>.</li>
                            <li>Enter item name or description.</li>
                            <li>Provide quantity and unit price.</li>
                            <li>Total will be calculated automatically.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                            3. Preview Invoice
                        </h2>
                        <p className="text-gray-600">
                            After filling the details, click the{" "}
                            <span className="font-medium">Preview</span> button to view how your
                            invoice will appear before printing or downloading.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                            4. Download or Print PDF
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>Click the <span className="font-medium">Print / Download</span> button.</li>
                            <li>The invoice will open in print preview.</li>
                            <li>Select <span className="font-medium">Save as PDF</span> to download.</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-semibold text-cyan-900 mb-2">
                            5. Tips
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600 space-y-1">
                            <li>Double-check invoice number before printing.</li>
                            <li>Use clear item descriptions.</li>
                            <li>Keep a copy of your generated PDFs for records.</li>
                        </ul>
                    </section>

                    <div className="mt-8 border-t pt-4 text-cyan-900 text-sm">
                        ©{new Date().getFullYear()} GenInvoice – Simple Invoice Generator
                    </div>

                </div>
            </div>
    )
}
