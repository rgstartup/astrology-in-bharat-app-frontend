"use client";

import { CloseButton } from "@repo/ui";
import { createPortal } from "react-dom";
import { getYoutubeEmbedUrl, getYoutubeId } from "@/utils/video-utils";

const EmptyVideoPlaceholder = ({ name }: { name: string }) => {
  return (
    <div className="m-2 flex h-[350px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-b from-orange-50/50 to-orange-100/30">
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
        <div className="absolute inset-0 animate-ping rounded-full bg-orange-200 opacity-20" />
        <i className="fa-solid fa-video-slash text-3xl text-orange-400" />
      </div>
      <h4 className="mb-2 text-xl font-black text-gray-800 md:text-2xl">
        Intro Video Unavailable
      </h4>
      <p className="max-w-sm px-6 text-center font-medium leading-relaxed text-gray-500">
        Looks like <span className="font-bold text-orange-600">{name}</span>{" "}
        hasn&apos;t uploaded an introductory video yet. You can still connect
        instantly via chat or call.
      </p>
    </div>
  );
};

const VideoPlayer = ({ video }: { video: string }) => {
  return (
    <video
      src={video}
      width="100%"
      height="500"
      controls
      autoPlay
      className="max-h-[60vh] w-full rounded-xl bg-black shadow-inner"
    />
  );
};

const YoutubePlayer = ({ video, title }: { video: string; title: string }) => {
  return (
    <iframe
      title={title}
      src={`${getYoutubeEmbedUrl(video)}?autoplay=1`}
      width="100%"
      height="500"
      className="max-h-[60vh] w-full rounded-xl bg-black shadow-inner"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

interface ExpertVideoModalProps {
  name: string;
  video?: string;
  title: string;
  onClose: () => void;
}

export default function ExpertVideoModal({
  name,
  video,
  title,
  onClose,
}: ExpertVideoModalProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h5 className="m-0 text-lg font-bold text-gray-900">{title}</h5>
          <CloseButton onClick={onClose} />
        </div>
        <div className="p-4">
          {video ? (
            getYoutubeId(video) ? (
              <YoutubePlayer video={video} title={title} />
            ) : (
              <VideoPlayer video={video} />
            )
          ) : (
            <EmptyVideoPlaceholder name={name} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
