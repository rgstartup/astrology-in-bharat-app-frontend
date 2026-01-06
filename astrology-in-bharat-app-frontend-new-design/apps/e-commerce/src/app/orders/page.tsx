"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function OrderHistory() {
  const { history } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 font-pl border-b pb-4">
          My Purchase History
        </h1>

        {history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <i className="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven&apos;t bought any cosmic remedies yet.
            </p>
            <Link
              href="/"
              className="btn-link bg-primary-orange text-white px-6 py-2 rounded-full"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((order, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-bold text-gray-800">
                      #{order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-800">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">{item.title}</h5>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    Total: ₹{order.total.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
