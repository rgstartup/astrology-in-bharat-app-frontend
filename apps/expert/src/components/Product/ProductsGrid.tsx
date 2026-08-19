"use client";

import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Button from './ui/Button';

export const ProductsGrid: React.FC = () => {
  const products = [
    { name: "Vastu Yantra", category: "Remedies", price: "Rs1499", image: "/images/product.jpg" },
    { name: "Vastu Yantra", category: "Remedies", price: "Rs1499", image: "/images/product.jpg" },
    // { name: "Vastu Yantra", category: "Remedies", price: "Rs1499", image: "/images/product.jpg" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ChevronDown className="w-4 h-4" />}
          >
            All Products
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sm"
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-gray-50"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="text-sm font-bold text-black">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
