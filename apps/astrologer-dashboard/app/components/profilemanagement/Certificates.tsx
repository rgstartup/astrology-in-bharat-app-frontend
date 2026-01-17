import React from "react";
import { Award, ChevronRight, Upload } from "lucide-react";

interface CertificatesProps {
    certificates: string[];
}

export default function Certificates({ certificates }: CertificatesProps) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
                <Award className="w-5 h-5 mr-2 text-yellow-600" /> Certificates
            </h2>
            <ul className="space-y-2 text-gray-700 mb-4">
                {certificates.map((cert, i) => (
                    <li
                        key={i}
                        className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 rounded-lg"
                    >
                        <span className="text-xs sm:text-sm">{cert}</span>
                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors text-sm">
                <Upload className="w-4 h-4" />
                <span>Upload Certificate</span>
            </div>
        </div>
    );
}
