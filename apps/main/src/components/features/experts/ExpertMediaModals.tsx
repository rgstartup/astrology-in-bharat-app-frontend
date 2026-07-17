"use client";

import React from "react";
import NextImage from "next/image";

const Image = NextImage as any;

import { CloseButton } from "@repo/ui";
import { getYoutubeId, getYoutubeEmbedUrl } from "@/utils/video-utils";

interface ExpertMediaModalsProps {
  expertName: string;
  selectedVideo: string | null;
  setSelectedVideo: (url: string | null) => void;
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
}

const ExpertMediaModals: React.FC<ExpertMediaModalsProps> = ({
  expertName,
  selectedVideo,
  setSelectedVideo,
  selectedImage,
  setSelectedImage,
}) => {
  return (
    <>
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-200 flex flex-col">
            <CloseButton 
              onClick={() => setSelectedVideo(null)} 
              className="absolute -top-3 -right-3 z-50 shadow-lg"
            />
            <div className="relative w-full bg-black rounded-t-2xl shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
              {getYoutubeId(selectedVideo) ? (
                <iframe
                  src={`${getYoutubeEmbedUrl(selectedVideo)}?autoplay=1`}
                  className="w-full h-full max-h-[80vh]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="w-full h-full max-h-[80vh]"
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="bg-white p-4 flex items-center justify-between border-t border-gray-100 rounded-b-2xl shadow-2xl">
              <h4 className="text-base font-bold text-gray-800">Playing Video</h4>
              <span className="text-xs text-gray-500">Expert {expertName}</span>
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedVideo(null)} aria-hidden="true"></div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center animate-in zoom-in-95 duration-200">
            <div className="absolute -top-12 right-0 z-50">
              <CloseButton onClick={() => setSelectedImage(null)} />
            </div>
            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
              <Image src={selectedImage} alt="Full view" fill sizes="100vw" className="object-contain" />
            </div>
          </div>
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedImage(null)} aria-hidden="true"></div>
        </div>
      )}
    </>
  );
};

export default ExpertMediaModals;
