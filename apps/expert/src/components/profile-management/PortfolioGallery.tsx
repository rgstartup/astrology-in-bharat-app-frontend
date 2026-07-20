import React, { useRef, useState } from "react";
import { Image as ImageIcon, Video, Trash2, Plus, Upload, Link as LinkIcon, X, Play, Save, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import { Profile } from "@/types/profile";

interface PortfolioGalleryProps {
    images: string[];
    videos: string[];
    introVideo: string;
    tempIntroVideo: string;
    isEditingIntro: boolean;
    onEditIntro: () => void;
    onSaveIntro: () => void;
    onCancelIntro: () => void;
    onIntroVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadIntroVideo: (file: File) => void;
    onAddImage: (file: File) => void;
    onRemoveImage: (index: number) => void;
    onAddVideo: (url: string) => void;
    onRemoveVideo: (index: number) => void;
    onRemoveIntro?: () => void;
    onUploadVideoFile?: (file: File) => void;
    isActive?: boolean;
}

export default function PortfolioGallery({
    images,
    videos,
    introVideo,
    tempIntroVideo,
    isEditingIntro,
    onEditIntro,
    onSaveIntro,
    onCancelIntro,
    onIntroVideoChange,
    onUploadIntroVideo,
    onAddImage,
    onRemoveImage,
    onAddVideo,
    onRemoveVideo,
    onRemoveIntro,
    onUploadVideoFile,
    isActive
}: PortfolioGalleryProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'intro-video'>('images');
    const [isExpanded, setIsExpanded] = useState(true);

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
        if (file) {
            // Check file size (50MB limit)
            if (file.size > 50 * 1024 * 1024) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                toast.error(`❌ Video too large! Your file is ${sizeMB}MB. Maximum allowed size is 50MB.`);
                if (e.target) e.target.value = "";
                return;
            }
            if (onUploadVideoFile) {
                onUploadVideoFile(file);
            }
        }
        if (e.target) e.target.value = "";
    };

    const handleIntroVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            toast.error(`❌ Video too large! Your file is ${sizeMB}MB. Maximum allowed size is 50MB.`);
            if (e.target) e.target.value = "";
            return;
        }

        // Validation for Video Duration
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';

        videoElement.onloadedmetadata = () => {
            window.URL.revokeObjectURL(videoElement.src);
            const duration = videoElement.duration;

            if (duration < 30) {
                toast.error("Intro video cannot be shorter than 30 seconds! (Minimum 30 seconds required)");
                if (e.target) e.target.value = "";
                return;
            }

            if (duration > 90) {
                toast.error("Intro video cannot be longer than 90 seconds! (Maximum 90 seconds allowed)");
                if (e.target) e.target.value = "";
                return;
            }

            // If passes validation
            onUploadIntroVideo(file);
            if (e.target) e.target.value = "";
        };

        videoElement.onerror = () => {
            toast.error("Video file invalid hai ya load nahi ho rahi.");
            if (e.target) e.target.value = "";
        };

        videoElement.src = URL.createObjectURL(file);
    };

    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2] && match[2].length === 11) ? match[2] : null;
    };

    const introVideoId = getYoutubeId(introVideo);
    const introEmbedUrl = introVideoId ? `https://www.youtube.com/embed/${introVideoId}` : introVideo;

    return (
        <div className="bg-white rounded-2xl shadow-lg border-orange-400 border-2 overflow-hidden transition-all duration-300">
            <div
                className={`flex items-center justify-between cursor-pointer transition-all duration-300 select-none ${
                    isActive 
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 sm:p-6 shadow-md shadow-orange-500/10" 
                        : "hover:bg-gray-50/50 p-4 sm:p-6 text-gray-900"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-lg font-bold flex items-center">
                    <ImageIcon className={`w-5 h-5 mr-2 ${isActive ? "text-white" : "text-orange-500"}`} /> Portfolio & Media
                </h2>
                {isExpanded ? (
                    <ChevronUp className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                ) : (
                    <ChevronDown className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                )}
            </div>

            {isExpanded && (
                <div className="p-4 sm:p-6 pt-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                        <button
                            onClick={() => setActiveTab('images')}
                            className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer hover:cursor-pointer ${activeTab === 'images'
                                ? 'border-orange text-orange'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ImageIcon className="w-4 h-4 mr-2" /> Gallery ({images.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer hover:cursor-pointer ${activeTab === 'videos'
                                ? 'border-orange text-orange'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Video className="w-4 h-4 mr-2" /> Videos ({videos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('intro-video')}
                            className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer hover:cursor-pointer ${activeTab === 'intro-video'
                                ? 'border-orange text-orange'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Play className="w-4 h-4 mr-2" /> Intro Video
                        </button>
                    </div>

                    {/* Images Content */}
                    {activeTab === 'images' && (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="flex justify-end mb-4">
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="primary"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Image
                                </Button>
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
                                            <Button
                                                onClick={() => onRemoveImage(i)}
                                                variant="secondary"
                                                size="sm"
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Videos Content */}
                    {activeTab === 'videos' && (
                        <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <div className="flex flex-wrap justify-end mb-4 gap-2">
                                {onUploadVideoFile && (
                                    <>
                                        <Button
                                            onClick={() => videoInputRef.current?.click()}
                                            variant="primary"
                                            size="sm"
                                            className="flex items-center gap-1"
                                        >
                                            <Upload className="w-4 h-4" /> Upload Video
                                        </Button>
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
                                    <Button
                                        onClick={() => setIsAddingVideo(true)}
                                        variant="primary"
                                        size="sm"
                                        className="flex items-center gap-1"
                                    >
                                        <LinkIcon className="w-4 h-4" /> Add Video Link
                                    </Button>
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
                                        <Button
                                            onClick={handleAddVideo}
                                            variant="primary"
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            onClick={() => setIsAddingVideo(false)}
                                            variant="secondary"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {videos.map((vid, i) => {
                                    const vidId = getYoutubeId(vid);
                                    const embedUrl = vidId ? `https://www.youtube.com/embed/${vidId}` : vid;
                                    return (
                                        <div key={i} className="space-y-3">
                                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-200 shadow-inner">
                                                {vidId ? (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={embedUrl}
                                                        title={`Video ${i + 1}`}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video
                                                        src={vid}
                                                        className="w-full h-full object-contain"
                                                        controls
                                                    />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2 overflow-hidden flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                                        <LinkIcon className="w-4 h-4 text-red-500" />
                                                    </div>
                                                    <span className="text-xs text-gray-500 truncate" title={vid}>{vid}</span>
                                                </div>
                                                <Button
                                                    onClick={() => onRemoveVideo(i)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0 ml-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {videos.length === 0 && !isAddingVideo && (
                                <div className="text-center py-6">
                                    <p className="text-sm text-gray-400">No videos added yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Intro Video Content */}
                    {activeTab === 'intro-video' && (
                        <div className="animate-in fade-in zoom-in duration-300">
                            {isEditingIntro ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Intro Video URL (YouTube/Vimeo/Direct)</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="url"
                                                name="video"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-black"
                                                value={tempIntroVideo}
                                                onChange={onIntroVideoChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-gray-400 font-medium">Or</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => videoInputRef.current?.click()}
                                        variant="outline"
                                        fullWidth
                                        className="py-4 border-2 border-dashed flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-5 h-5" />
                                        <span>Upload Video File</span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={handleIntroVideoFileChange}
                                    />

                                    <div className="flex gap-2 justify-end pt-2">
                                        <Button
                                            onClick={onCancelIntro}
                                            variant="secondary"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={onSaveIntro}
                                            variant="primary"
                                            className="flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save Video</span>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {introVideo ? (
                                        <div className="space-y-3">
                                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-200 shadow-inner">
                                                {introVideoId ? (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={introEmbedUrl}
                                                        title="Introduction Video"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video
                                                        src={introVideo}
                                                        className="w-full h-full object-contain"
                                                        controls
                                                    />
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="flex items-center gap-2 overflow-hidden flex-1">
                                                    <LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="text-xs text-gray-500 truncate" title={introVideo}>{introVideo}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={onEditIntro}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-orange hover:text-orange/80"
                                                    >
                                                        Change
                                                    </Button>
                                                    {onRemoveIntro && (
                                                        <Button
                                                            onClick={onRemoveIntro}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            title="Remove Introduction Video"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 px-6">
                                            <Video className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Add Intro Video</h3>
                                            <p className="text-xs text-gray-500 mb-4">Introduce yourself to users through a short video message.</p>
                                            <Button
                                                onClick={onEditIntro}
                                                variant="outline"
                                                size="sm"
                                                className="inline-flex items-center gap-2 rounded-full"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


