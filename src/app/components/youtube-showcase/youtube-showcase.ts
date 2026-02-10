import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { YouTubeEmbed } from '../shared/youtube-embed/youtube-embed';

interface FeaturedVideo {
  id: string;
  title: string;
}

@Component({
  selector: 'app-youtube-showcase',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, YouTubeEmbed],
  templateUrl: './youtube-showcase.html',
  styleUrl: './youtube-showcase.css'
})
export class YouTubeShowcase {
  channelUrl = 'https://www.youtube.com/@YotsubaHybrid';

  featuredVideos: FeaturedVideo[] = [
    { id: '5KItyB4Q-Gk', title: 'Yotsuba Hybrid Engine' }
  ];
}
