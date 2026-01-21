import React, { useRef } from "react";
import { Shield, CheckCircle2, FileText, Upload, Trash2, File as FileIcon, Award, ChevronRight, CreditCard, UserSquare2 } from "lucide-react";
import { DocumentItem } from "./types";

interface VerificationAndDocumentsProps {
    kycCompleted: boolean;
    onStartKYC: () => void;
    documents: DocumentItem[];
    onUploadDocument: (file: File, category?: 'aadhar' | 'pan' | 'other') => void;
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
    const aadharInputRef = useRef<HTMLInputElement>(null);
    const panInputRef = useRef<HTMLInputElement>(null);
    const certificateInputRef = useRef<HTMLInputElement>(null);

    const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'aadhar');
            e.target.value = "";
        }
    };

    const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'pan');
            e.target.value = "";
        }
    };

    const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadCertificate(e.target.files[0]);
            e.target.value = "";
        }
    };

    // Filter documents
    const aadharDocs = documents.filter(d => d.category === 'aadhar');
    const panDocs = documents.filter(d => d.category === 'pan');
    const otherDocs = documents.filter(d => !d.category || d.category === 'other');

    return (
        <div className="space-y-6">
            {/* Merged KYC & Documents Section */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        {/* @ts-ignore */}
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                            KYC Verification & Documents
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Verify your identity to build trust. <span className="font-semibold text-gray-800">Please upload your Aadhar Card and PAN Card.</span>
                        </p>
                    </div>
                </div>

                {kycCompleted ? (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            {/* @ts-ignore */}
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
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                        <p className="text-xs sm:text-sm text-yellow-800 font-medium flex items-center">
                            <span>⚠️ KYC Pending</span>
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                            Upload both documents below to complete the process.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Aadhar Upload Section */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            {/* @ts-ignore */}
                            <UserSquare2 className="w-4 h-4 mr-2 text-orange-600" />
                            Aadhar Card
                        </h4>

                        <div
                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                            onClick={() => aadharInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={aadharInputRef}
                                className="hidden"
                                onChange={handleAadharChange}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    {/* @ts-ignore */}
                                    <Upload className="w-5 h-5 text-orange-600" />
                                </div>
                                <p className="text-xs font-semibold text-gray-700">Upload Aadhar</p>
                            </div>
                        </div>

                        {/* Aadhar Files List */}
                        {aadharDocs.length > 0 && (
                            <div className="space-y-2">
                                {aadharDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            {/* @ts-ignore */}
                                            <FileIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-medium text-gray-700 truncate">{doc.name}</span>
                                        </div>
                                        <button onClick={() => onDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500">
                                            {/* @ts-ignore */}
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PAN Upload Section */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            {/* @ts-ignore */}
                            <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                            PAN Card
                        </h4>

                        <div
                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                            onClick={() => panInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={panInputRef}
                                className="hidden"
                                onChange={handlePanChange}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    {/* @ts-ignore */}
                                    <Upload className="w-5 h-5 text-orange-600" />
                                </div>
                                <p className="text-xs font-semibold text-gray-700">Upload PAN</p>
                            </div>
                        </div>

                        {/* PAN Files List */}
                        {panDocs.length > 0 && (
                            <div className="space-y-2">
                                {panDocs.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            {/* @ts-ignore */}
                                            <FileIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-medium text-gray-700 truncate">{doc.name}</span>
                                        </div>
                                        <button onClick={() => onDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500">
                                            {/* @ts-ignore */}
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Other Documents (Backward Compatibility) */}
                {otherDocs.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Other Documents</h4>
                        <div className="space-y-2">
                            {otherDocs.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        {/* @ts-ignore */}
                                        <FileIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-700 truncate">{doc.name}</span>
                                    </div>
                                    <button onClick={() => onDeleteDocument(doc.id)} className="text-gray-400 hover:text-red-500">
                                        {/* @ts-ignore */}
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Certificates Section */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    {/* @ts-ignore */}
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
                                {/* @ts-ignore */}
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={() => certificateInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                    {/* @ts-ignore */}
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
