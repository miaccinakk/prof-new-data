/**
 * Composable to add version parameter to media URLs for cache busting
 * Uses the document's _id (MongoDB ObjectId contains timestamp) or updatedAt field
 */
export function useVersionedUrl() {
  /**
   * Adds a version query parameter to a URL based on document metadata
   * @param url - The original URL
   * @param document - MongoDB document with _id or updatedAt field
   * @returns URL with version parameter for cache busting
   */
  const getVersionedUrl = (
    url: string | undefined | null,
    document?: { _id?: string; updatedAt?: string | Date } | null
  ): string => {
    if (!url) return "";

    // If no document provided, return original URL
    if (!document) return url;

    // Generate version from updatedAt timestamp or _id
    let version: string;

    if (document.updatedAt) {
      // Use updatedAt timestamp
      const date =
        typeof document.updatedAt === "string"
          ? new Date(document.updatedAt)
          : document.updatedAt;
      version = date.getTime().toString(36); // Base36 for shorter URL
    } else if (document._id) {
      // Extract timestamp from MongoDB ObjectId (first 8 hex chars = timestamp)
      // ObjectId format: 4 bytes timestamp + 5 bytes random + 3 bytes counter
      const timestampHex = document._id.substring(0, 8);
      version = parseInt(timestampHex, 16).toString(36);
    } else {
      return url;
    }

    // Add version parameter
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${version}`;
  };

  /**
   * Adds version to multiple URLs from an array of file objects
   * @param files - Array of file objects with url property
   * @param document - Parent document for versioning
   * @returns Array of versioned URLs
   */
  const getVersionedUrls = (
    files: Array<{ url?: string }> | undefined | null,
    document?: { _id?: string; updatedAt?: string | Date } | null
  ): string[] => {
    if (!files || !Array.isArray(files)) return [];
    return files
      .map((file) => getVersionedUrl(file.url, document))
      .filter(Boolean);
  };

  /**
   * Adds version to image URL specifically, with fallback
   * @param imageUrl - The image URL
   * @param document - Document for versioning
   * @param fallback - Fallback URL if imageUrl is empty
   * @returns Versioned URL or fallback
   */
  const getVersionedImageUrl = (
    imageUrl: string | undefined | null,
    document?: { _id?: string; updatedAt?: string | Date } | null,
    fallback = "/profiterm.webp"
  ): string => {
    const url = imageUrl || fallback;
    return document ? getVersionedUrl(url, document) : url;
  };

  return {
    getVersionedUrl,
    getVersionedUrls,
    getVersionedImageUrl,
  };
}
