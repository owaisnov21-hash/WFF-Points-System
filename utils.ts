/**
 * Converts a standard Google Drive sharing URL into a direct, embeddable image URL.
 * @param url The public Google Drive sharing URL (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * @returns A direct image link (e.g., https://drive.google.com/uc?export=view&id=FILE_ID), or the original URL if it's not a valid Drive link, or null if input is null.
 */
export const convertToDirectGoogleDriveUrl = (url: string | null): string | null => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return null;
    }

    // Regular expression to find the file ID in various Google Drive URL formats
    const regex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]{28,})/;
    const match = url.match(regex);

    if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    // If it doesn't match, it might already be a direct link or from another source. Return as is.
    return url;
};
