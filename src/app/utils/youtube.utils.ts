const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[?&][^\s)]*)?/g;

export function extractYouTubeVideoIds(content: string): string[] {
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(YOUTUBE_REGEX.source, YOUTUBE_REGEX.flags);
  while ((match = regex.exec(content)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
  const qualityMap = { default: 'default', hq: 'hqdefault', maxres: 'maxresdefault' };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
