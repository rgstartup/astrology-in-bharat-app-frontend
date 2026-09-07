/**
 * Extracts the YouTube video ID from various URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const getYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
};

/**
 * Generates a YouTube embed URL from any YouTube URL.
 */
export const getYoutubeEmbedUrl = (url: string): string => {
    const videoId = getYoutubeId(url);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
};
