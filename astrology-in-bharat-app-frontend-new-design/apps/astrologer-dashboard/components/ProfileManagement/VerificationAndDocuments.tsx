import React, { useRef } from "react";
import { Shield, CheckCircle2, FileText, Upload, Trash2, File as FileIcon, Award, ChevronRight } from "lucide-react";
import { DocumentItem } from "./types";

interface VerificationAndDocumentsProps {
    kycCompleted: boolean;
    onStartKYC: () => void;
    documents: DocumentItem[];
    onUploadDocument: (file: File) => void;
    onDeleteDocument: (id: number) => void;
    certificates: string[];
    onUploadCertificate: (file: File) => void;
}

export default function VerificationAndDocuments({
    kycCompleted,
    onStartKYC,
    documents,
    onUploadDocument,
    onDeleteDocument,
    certificates,
    onUploadCertificate,
}: VerificationAndDocumentsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const certificateInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0]);
            e.target.value = "";
        }
    };

    const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadCertificate(e.target.files[0]);
            e.target.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUploadDocument(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="space-y-6">
            {/* KYC Status Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-50 p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-dashed border-yellow-300">
                <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            KYC & Documents
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Verify your identity and showcase your certifications to build trust.
                        </p>
                    </div>
                </div>

                {kycCompleted ? (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm sm:text-base font-semibold text-green-800">
                                KYC Verified
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-green-700 mt-1">
                            Your account is fully verified.
                        </p>
                    </div>
                ) : (
                    <div className="mb-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                                ⚠️ KYC Pending
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Complete verification to accept consultations.
                            </p>
                        </div>
                        <button
                            onClick={onStartKYC}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 text-sm sm:text-base"
                        >
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Complete KYC Verification</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Documents Upload Section */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-orange-600" /> KYC Documents
                    </h3>
                </div>

                <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <Upload className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                PDF, JPG, PNG up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

                {documents.length > 0 && (
                    <div className="space-y-3 mb-8">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow group"
                            >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                                        <FileIcon className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-900 truncate hover:text-orange-600 hover:underline cursor-pointer block"
                                        >
                                            {doc.name}
                                        </a>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <span>{doc.size}</span>
                                            <span>•</span>
                                            <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Certificates Section */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" /> Certificates
                </h3>
                {certificates.length === 0 ? (
                    <p className="text-sm text-gray-500 mb-4 text-center">No certificates added.</p>
                ) : (
                    <ul className="space-y-2 text-gray-700 mb-4">
                        {certificates.map((cert, i) => (
                            <li
                                key={i}
                                className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <a
                                    href={cert}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs sm:text-sm truncate flex-1 hover:text-blue-600 hover:underline"
                                >
                                    {cert}
                                </a>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={() => certificateInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    <Upload className="w-4 h-4" />
                    <span>Upload Certificate</span>
                </button>
                <input
                    type="file"
                    ref={certificateInputRef}
                    className="hidden"
                    onChange={handleCertificateChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
            </div>
        </div>
    );
}
