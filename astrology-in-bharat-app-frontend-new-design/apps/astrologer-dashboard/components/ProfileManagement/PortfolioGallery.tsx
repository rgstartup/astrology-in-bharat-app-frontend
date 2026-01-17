import React, { useRef, useState } from "react";
import { Image as ImageIcon, Video, Trash2, Plus, Upload, Link as LinkIcon, X } from "lucide-react";
import Image from "next/image";

interface PortfolioGalleryProps {
    images: string[];
    videos: string[];
    onAddImage: (file: File) => void;
    onRemoveImage: (index: number) => void;
    onAddVideo: (url: string) => void;
    onRemoveVideo: (index: number) => void;
    onUploadVideoFile?: (file: File) => void;
}

export default function PortfolioGallery({
    images,
    videos,
    onAddImage,
    onRemoveImage,
    onAddVideo,
    onRemoveVideo,
    onUploadVideoFile
}: PortfolioGalleryProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddImage(file);
        }
        if (e.target) e.target.value = "";
    };

    const handleAddVideo = () => {
        if (newVideoUrl.trim()) {
            onAddVideo(newVideoUrl.trim());
            setNewVideoUrl("");
            setIsAddingVideo(false);
        }
    };

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUploadVideoFile) {
            onUploadVideoFile(file);
        }
        if (e.target) e.target.value = "";
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600" /> Portfolio & Media
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('images')}
                    className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'images'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <ImageIcon className="w-4 h-4 mr-2" /> Gallery ({images.length})
                </button>
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'videos'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Video className="w-4 h-4 mr-2" /> Videos ({videos.length})
                </button>
            </div>

            {/* Images Content */}
            {activeTab === 'images' && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 flex items-center transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Image
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                    </div>
                    {images.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">No images added to gallery yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                    <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                                    <button
                                        onClick={() => onRemoveImage(i)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Videos Content */}
            {activeTab === 'videos' && (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex justify-end mb-4 gap-2">
                        {onUploadVideoFile && (
                            <>
                                <button
                                    onClick={() => videoInputRef.current?.click()}
                                    className="text-sm bg-purple-50 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-100 flex items-center transition-colors"
                                >
                                    <Upload className="w-4 h-4 mr-1" /> Upload Video
                                </button>
                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    className="hidden"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                />
                            </>
                        )}
                        {!isAddingVideo && (
                            <button
                                onClick={() => setIsAddingVideo(true)}
                                className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full hover:bg-red-100 flex items-center transition-colors"
                            >
                                <LinkIcon className="w-4 h-4 mr-1" /> Add Video Link
                            </button>
                        )}
                    </div>

                    {isAddingVideo && (
                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <input
                                type="url"
                                placeholder="Enter YouTube/Video URL"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddVideo}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setIsAddingVideo(false)}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <ul className="space-y-3">
                        {videos.map((vid, i) => (
                            <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                        <LinkIcon className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 truncate flex-1" title={vid}>{vid}</span>
                                </div>
                                <button
                                    onClick={() => onRemoveVideo(i)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    {videos.length === 0 && !isAddingVideo && (
                        <div className="text-center py-6">
                            <p className="text-sm text-gray-400">No videos added yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
