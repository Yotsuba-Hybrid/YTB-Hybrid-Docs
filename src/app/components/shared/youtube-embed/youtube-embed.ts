import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../../utils/youtube.utils';

@Component({
  selector: 'app-youtube-embed',
  standalone: true,
  imports: [],
  templateUrl: './youtube-embed.html',
  styleUrl: './youtube-embed.css'
})
export class YouTubeEmbed implements OnChanges {
  @Input({ required: true }) videoId!: string;
  @Input() lazyLoad = true;

  embedUrl: SafeResourceUrl | null = null;
  thumbnailUrl = '';
  activated = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoId'] && this.videoId) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        getYouTubeEmbedUrl(this.videoId)
      );
      this.thumbnailUrl = getYouTubeThumbnailUrl(this.videoId, 'hq');
      this.activated = !this.lazyLoad;
    }
  }

  activate() {
    this.activated = true;
  }
}
