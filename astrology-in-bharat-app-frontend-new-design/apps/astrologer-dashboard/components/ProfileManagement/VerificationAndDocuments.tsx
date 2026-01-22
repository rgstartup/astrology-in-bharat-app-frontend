import React, { useRef, useState } from "react";
import { Shield, CheckCircle2, FileText, Upload, Trash2, File as FileIcon, Award, ChevronRight, ChevronDown, ChevronUp, CreditCard, UserSquare2, X } from "lucide-react";
import { DocumentItem } from "./types";

interface VerificationAndDocumentsProps {
    kycCompleted: boolean;
    onStartKYC: () => void;
    documents: DocumentItem[];
    onUploadDocument: (file: File, category?: 'aadhar' | 'pan' | 'other', side?: 'front' | 'back') => void;
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
    const aadharFrontInputRef = useRef<HTMLInputElement>(null);
    const aadharBackInputRef = useRef<HTMLInputElement>(null);
    const panFrontInputRef = useRef<HTMLInputElement>(null);
    const panBackInputRef = useRef<HTMLInputElement>(null);
    const certificateInputRef = useRef<HTMLInputElement>(null);
    const [viewDoc, setViewDoc] = useState<DocumentItem | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isCertExpanded, setIsCertExpanded] = useState(true);

    const handleAadharFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'aadhar', 'front');
            e.target.value = "";
        }
    };

    const handleAadharBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'aadhar', 'back');
            e.target.value = "";
        }
    };

    const handlePanFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'pan', 'front');
            e.target.value = "";
        }
    };

    const handlePanBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUploadDocument(e.target.files[0], 'pan', 'back');
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
    const aadharFrontDocs = documents.filter(d => d.category === 'aadhar' && d.side === 'front');
    const aadharBackDocs = documents.filter(d => d.category === 'aadhar' && d.side === 'back');
    const aadharOtherDocs = documents.filter(d => d.category === 'aadhar' && !d.side); // Fallback for old docs

    const panFrontDocs = documents.filter(d => d.category === 'pan' && d.side === 'front');
    const panBackDocs = documents.filter(d => d.category === 'pan' && d.side === 'back');
    const panOtherDocs = documents.filter(d => d.category === 'pan' && !d.side); // Fallback for old docs
    const otherDocs = documents.filter(d => !d.category || d.category === 'other');

    return (
        <div className="space-y-6">
            {/* Merged KYC & Documents Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div
                    className="p-4 sm:p-6 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        {/* @ts-ignore */}
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                KYC Verification & Documents
                            </h2>
                            {/* @ts-ignore */}
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Verify your identity to build trust. <span className="font-semibold text-gray-800">Please upload your Aadhar Card and PAN Card.</span>
                        </p>
                    </div>
                </div>

                {isExpanded && (
                    <div className="p-4 sm:p-6 pt-0">

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
                            {/* Aadhar Upload Section - Full Width for 2 columns */}
                            <div className="md:col-span-2">
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                    {/* @ts-ignore */}
                                    <UserSquare2 className="w-4 h-4 mr-2 text-orange-600" />
                                    Aadhar Card
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Front Side */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-gray-600 mb-2">Front Side</h5>
                                        <div
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                                            onClick={() => aadharFrontInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={aadharFrontInputRef}
                                                className="hidden"
                                                onChange={handleAadharFrontChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-2 bg-white rounded-full shadow-sm">
                                                    {/* @ts-ignore */}
                                                    <Upload className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700">Upload Front</p>
                                            </div>
                                        </div>
                                        {/* Front Files List */}
                                        {aadharFrontDocs.length > 0 && (
                                            <div className="space-y-2">
                                                {aadharFrontDocs.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                        <div
                                                            className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                            onClick={() => doc.url && setViewDoc(doc)}
                                                        >
                                                            {/* @ts-ignore */}
                                                            <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                            <span className="text-xs font-medium truncate">{doc.name}</span>
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

                                    {/* Back Side */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-gray-600 mb-2">Back Side</h5>
                                        <div
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                                            onClick={() => aadharBackInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={aadharBackInputRef}
                                                className="hidden"
                                                onChange={handleAadharBackChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-2 bg-white rounded-full shadow-sm">
                                                    {/* @ts-ignore */}
                                                    <Upload className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700">Upload Back</p>
                                            </div>
                                        </div>
                                        {/* Back Files List */}
                                        {aadharBackDocs.length > 0 && (
                                            <div className="space-y-2">
                                                {aadharBackDocs.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                        <div
                                                            className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                            onClick={() => doc.url && setViewDoc(doc)}
                                                        >
                                                            {/* @ts-ignore */}
                                                            <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                            <span className="text-xs font-medium truncate">{doc.name}</span>
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

                                {/* Legacy/Unspecified Aadhar Docs */}
                                {aadharOtherDocs.length > 0 && (
                                    <div className="mt-4 pt-2 border-t border-dashed border-gray-200">
                                        <h5 className="text-xs font-semibold text-gray-500 mb-2">Other Aadhar Files</h5>
                                        <div className="space-y-2">
                                            {aadharOtherDocs.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                    <div
                                                        className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                        onClick={() => doc.url && setViewDoc(doc)}
                                                    >
                                                        {/* @ts-ignore */}
                                                        <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-medium truncate">{doc.name}</span>
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

                            {/* PAN Upload Section */}
                            {/* PAN Upload Section - Full Width for 2 columns */}
                            <div className="md:col-span-2">
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                    {/* @ts-ignore */}
                                    <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                                    PAN Card
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Front Side */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-gray-600 mb-2">Front Side</h5>
                                        <div
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                                            onClick={() => panFrontInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={panFrontInputRef}
                                                className="hidden"
                                                onChange={handlePanFrontChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-2 bg-white rounded-full shadow-sm">
                                                    {/* @ts-ignore */}
                                                    <Upload className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700">Upload Front</p>
                                            </div>
                                        </div>
                                        {/* Front Files List */}
                                        {panFrontDocs.length > 0 && (
                                            <div className="space-y-2">
                                                {panFrontDocs.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                        <div
                                                            className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                            onClick={() => doc.url && setViewDoc(doc)}
                                                        >
                                                            {/* @ts-ignore */}
                                                            <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                            <span className="text-xs font-medium truncate">{doc.name}</span>
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

                                    {/* Back Side */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-gray-600 mb-2">Back Side</h5>
                                        <div
                                            className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50/30 mb-3"
                                            onClick={() => panBackInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={panBackInputRef}
                                                className="hidden"
                                                onChange={handlePanBackChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            />
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="p-2 bg-white rounded-full shadow-sm">
                                                    {/* @ts-ignore */}
                                                    <Upload className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700">Upload Back</p>
                                            </div>
                                        </div>
                                        {/* Back Files List */}
                                        {panBackDocs.length > 0 && (
                                            <div className="space-y-2">
                                                {panBackDocs.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                        <div
                                                            className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                            onClick={() => doc.url && setViewDoc(doc)}
                                                        >
                                                            {/* @ts-ignore */}
                                                            <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                            <span className="text-xs font-medium truncate">{doc.name}</span>
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

                                {/* Legacy/Unspecified PAN Docs */}
                                {panOtherDocs.length > 0 && (
                                    <div className="mt-4 pt-2 border-t border-dashed border-gray-200">
                                        <h5 className="text-xs font-semibold text-gray-500 mb-2">Other PAN Files</h5>
                                        <div className="space-y-2">
                                            {panOtherDocs.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                    <div
                                                        className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                        onClick={() => doc.url && setViewDoc(doc)}
                                                    >
                                                        {/* @ts-ignore */}
                                                        <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                        <span className="text-xs font-medium truncate">{doc.name}</span>
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

                            {/* Other Documents (Backward Compatibility) */}
                            {otherDocs.length > 0 && (
                                <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">Other Documents</h4>
                                    <div className="space-y-2">
                                        {otherDocs.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                <div
                                                    className="flex items-center space-x-2 overflow-hidden cursor-pointer hover:text-blue-600 transition-colors"
                                                    onClick={() => doc.url && setViewDoc(doc)}
                                                >
                                                    {/* @ts-ignore */}
                                                    <FileIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                                                    <span className="text-xs font-medium truncate">{doc.name}</span>
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
                    </div>
                )}
            </div>

            {/* Certificates Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div
                    className="p-4 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsCertExpanded(!isCertExpanded)}
                >
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        {/* @ts-ignore */}
                        <Award className="w-5 h-5 mr-2 text-yellow-600" /> Certificates
                    </h3>
                    <div className="flex items-center space-x-2">
                        {/* @ts-ignore */}
                        {isCertExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                </div>

                {isCertExpanded && (
                    <div className="p-4 sm:p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        {certificates.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-4 text-center">No certificates added.</p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                {certificates.map((cert, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            const name = cert.split('/').pop()?.split('?')[0] || `Certificate-${i + 1}`;
                                            setViewDoc({
                                                id: i,
                                                name: name,
                                                url: cert,
                                                type: name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image/jpeg" : "application/pdf"
                                            });
                                        }}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-yellow-300 hover:bg-yellow-50/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {/* @ts-ignore */}
                                                <FileText className="w-4 h-4 text-yellow-600" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate group-hover:text-yellow-700">
                                                {cert.split('/').pop()?.split('?')[0] || "Certificate"}
                                            </span>
                                        </div>
                                        {/* @ts-ignore */}
                                        <ChevronRight size={16} className="text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-0.5 transition-all" />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <button
                            onClick={() => certificateInputRef.current?.click()}
                            className="w-full flex items-center justify-center space-x-2 bg-yellow-50 text-yellow-700 border border-yellow-100 px-4 py-3 rounded-xl cursor-pointer hover:bg-yellow-100 transition-all text-sm font-semibold"
                        >
                            {/* @ts-ignore */}
                            <Upload className="w-4 h-4" />
                            <span>Upload New Certificate</span>
                        </button>
                        <input
                            type="file"
                            ref={certificateInputRef}
                            className="hidden"
                            onChange={handleCertificateChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                    </div>
                )}
            </div>
            {/* Document View Modal */}
            {
                viewDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewDoc(null)}>
                        <div
                            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-800 truncate pr-4">{viewDoc.name}</h3>
                                <button
                                    onClick={() => setViewDoc(null)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    {/* @ts-ignore */}
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto bg-gray-50 p-4 flex items-center justify-center">
                                {viewDoc.type?.startsWith('image/') || viewDoc.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                    <img
                                        src={viewDoc.url}
                                        alt={viewDoc.name}
                                        className="max-w-full max-h-full object-contain shadow-md rounded"
                                    />
                                ) : (
                                    <iframe
                                        src={viewDoc.url}
                                        title={viewDoc.name}
                                        className="w-full h-full min-h-[60vh] border rounded shadow-sm bg-white"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
