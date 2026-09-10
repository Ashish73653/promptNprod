/**
 * Parses any Google Drive public sharing link and generates
 * both an iframe-embeddable preview URL and direct download URL.
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/preview")) return url;

  // Pattern: https://drive.google.com/file/d/{FILE_ID}/view...
  const fileIdMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }

  return url;
}

export function getGoogleDriveDownloadUrl(url: string): string {
  if (!url) return "";

  const fileIdMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }

  return url;
}
