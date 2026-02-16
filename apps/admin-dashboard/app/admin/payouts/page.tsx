"use client";

import React, { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from "lucide-react";

export default function AdminPayoutsPage() {
    // Mock data - replace with actual API call
    const [payoutRequests] = useState<any[]>([]);
    const [stats] = useState({
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalAmount: 0,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Payout Requests</h1>
                    <p className="text-gray-600">Manage expert payout requests and wallet transactions</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Pending */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Pending Requests</h3>
                            <Wallet className="w-5 h-5 text-yellow-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalPending}</p>
                        <p className="text-sm text-gray-500 mt-1">Awaiting approval</p>
                    </div>

                    {/* Approved */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Approved</h3>
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalApproved}</p>
                        <p className="text-sm text-gray-500 mt-1">Successfully processed</p>
                    </div>

                    {/* Rejected */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
                            <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalRejected}</p>
                        <p className="text-sm text-gray-500 mt-1">Declined requests</p>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">Total Amount</h3>
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">₹{stats.totalAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Pending payouts</p>
                    </div>
                </div>

                {/* Payout Requests Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Payout Requests</h2>
                    </div>

                    {payoutRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <Wallet className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No Payout Requests</h3>
                            <p className="text-gray-600 mb-6">
                                Currently, there are no payout requests from experts. <br />
                                Requests will appear here when experts withdraw their earnings.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-blue-800 mb-1">How it works</p>
                                        <p className="text-sm text-blue-700">
                                            Experts can request payouts from their wallet. You'll review and approve or reject each request here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Expert
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {payoutRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{request.expertName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">₹{request.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{request.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                                                <button className="text-red-600 hover:text-red-900">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




