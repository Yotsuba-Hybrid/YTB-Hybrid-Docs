import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, SecurityContext, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { DiscordService } from '../../../services/discord.service';
import { DiscordMessage, DiscordChannel, DiscordAttachment } from '../../../models/discord.model';
import { YouTubeEmbed } from '../../shared/youtube-embed/youtube-embed';
import { extractYouTubeVideoIds } from '../../../utils/youtube.utils';

@Component({
  selector: 'app-message-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    YouTubeEmbed
  ],
  templateUrl: './message-feed.html',
  styleUrls: ['./message-feed.css']
})
export class MessageFeed implements OnChanges, AfterViewInit {
  @Input() channelId!: string;
  @Input() channel?: DiscordChannel;
  @Input() displayMode: 'chat' | 'docs' = 'chat';
  @ViewChild('messageContainer') messageContainer?: ElementRef;

  messages: DiscordMessage[] = [];
  loading = true;
  loadingOlder = false;
  error = false;
  isLearnChannel = false;
  hasMoreMessages = true;
  private readonly PAGE_SIZE = 50;
  private youtubeIdsCache = new Map<string, string[]>();

  constructor(
    private discordService: DiscordService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    // Configure marked for better markdown rendering
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['channelId'] && this.channelId) {
      this.messages = [];
      this.hasMoreMessages = true;
      this.loadMessages();
    }
    if (changes['channel'] && this.channel) {
      // Check if this is a Learn category channel (case-insensitive)
      this.isLearnChannel = this.channel.categoryName?.toLowerCase() === 'learn';
    }
  }

  ngAfterViewInit() {
    // Scroll will be handled after messages are loaded
  }

  loadMessages() {
    this.loading = true;
    this.error = false;
    this.youtubeIdsCache.clear();

    this.discordService.getChannelMessages(this.channelId, this.PAGE_SIZE).subscribe({
      next: (messages: any) => {
        this.messages = messages.reverse(); // Reverse to show oldest first
        this.hasMoreMessages = messages.length >= this.PAGE_SIZE;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Messages loaded:', this.messages);

        // Scroll based on channel type
        this.scrollToAppropriatePosition();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadOlderMessages() {
    if (this.loadingOlder || !this.hasMoreMessages || this.messages.length === 0) return;

    this.loadingOlder = true;
    const oldestMessageId = this.messages[0].id;
    const container = this.messageContainer?.nativeElement;
    const previousScrollHeight = container ? container.scrollHeight : 0;

    this.discordService.getChannelMessages(this.channelId, this.PAGE_SIZE, oldestMessageId).subscribe({
      next: (olderMessages: any) => {
        if (olderMessages.length === 0) {
          this.hasMoreMessages = false;
          this.loadingOlder = false;
          this.cdr.detectChanges();
          return;
        }

        const reversed = olderMessages.reverse();
        this.messages = [...reversed, ...this.messages];
        this.hasMoreMessages = olderMessages.length >= this.PAGE_SIZE;
        this.loadingOlder = false;
        this.cdr.detectChanges();

        // Maintain scroll position after prepending older messages
        if (container) {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - previousScrollHeight;
          });
        }
      },
      error: () => {
        this.loadingOlder = false;
        this.cdr.detectChanges();
      }
    });
  }

  scrollToBottom() {
    if (!this.messageContainer) return;
    const container = this.messageContainer.nativeElement;
    // Double rAF to ensure DOM is fully laid out after *ngIf switch
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    });
  }

  private scrollToAppropriatePosition() {
    if (!this.messageContainer) return;

    const container = this.messageContainer.nativeElement;
    if (this.isLearnChannel) {
      // Learn channels: scroll to top (first message)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTop = 0;
        });
      });
    } else {
      // Normal channels: scroll to bottom (last message)
      this.scrollToBottom();
    }
  }

  scrollToTag(tag: string) {
    const container = this.messageContainer?.nativeElement;
    if (!container) return;

    const anchorElement = container.querySelector(`#tag-${tag}`) as HTMLElement;
    if (anchorElement) {
      // Find the parent message-item
      const messageItem = anchorElement.closest('.message-item') as HTMLElement;

      if (messageItem) {
        // Scroll to the message
        messageItem.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight effect to the message item
        messageItem.classList.add('highlighted');
        setTimeout(() => messageItem.classList.remove('highlighted'), 2000);
      }
    }
  }

  getAvatarUrl(message: DiscordMessage): string {
    if (message.author.avatar) {
      return `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`;
    }
    const defaultIndex = this.getDefaultAvatarIndex(message.author.id);
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  }

  private getDefaultAvatarIndex(userId: string): number {
    // Parse user ID as number, handle NaN case
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return 0; // Default fallback
    }
    return userIdNum % 5;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Hoy a las ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer a las ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // Parse content with markdown support and goto tag detection
  parseContent(content: string): SafeHtml {
    try {
      // Detect and convert goto tags and anchor tags
      // Pattern: (start of string or whitespace) followed by goto#keyword or #keyword
      const tagPattern = /(^|\s)(goto)?#(\w+)/gi;

      let processedContent = content.replace(tagPattern, (match, prefix, isGoto, keyword) => {
        if (isGoto) {
          // This is a goto link - make it clickable with data attribute
          return `${prefix}<a href="#" class="goto-tag" data-tag="${keyword}" tabindex="0" role="button" aria-label="Go to tag ${keyword}">goto#${keyword}</a>`;
        } else {
          // This is an anchor - add an ID for scrolling
          return `${prefix}<span id="tag-${keyword}" class="anchor-tag">#${keyword}</span>`;
        }
      });

      // First, parse markdown
      const html = marked.parse(processedContent) as string;
      // Then sanitize the HTML (allowing our custom attributes)
      return this.sanitizer.sanitize(SecurityContext.HTML, html) || content;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      // Fallback to plain text with link conversion
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const withLinks = content.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
      return this.sanitizer.sanitize(SecurityContext.HTML, withLinks) || content;
    }
  }

  trackByAttachmentId(index: number, attachment: DiscordAttachment): string {
    return attachment.id || `${attachment.filename}-${index}`;
  }

  trackByMessageId(index: number, message: DiscordMessage): string {
    return message.id;
  }

  getAttachmentKind(attachment: DiscordAttachment): 'image' | 'video' | 'audio' | 'pdf' | 'file' {
    const contentType = this.getAttachmentContentType(attachment);

    if (contentType.startsWith('image/')) {
      return 'image';
    }
    if (contentType.startsWith('video/')) {
      return 'video';
    }
    if (contentType.startsWith('audio/')) {
      return 'audio';
    }
    if (contentType === 'application/pdf' || this.hasFileExtension(attachment.filename, ['pdf'])) {
      return 'pdf';
    }

    return 'file';
  }

  getAttachmentUrl(attachment: DiscordAttachment): string {
    return attachment.proxy_url || attachment.url;
  }

  private getAttachmentContentType(attachment: DiscordAttachment): string {
    return (attachment.original_content_type || attachment.content_type || '').toLowerCase();
  }

  private hasFileExtension(filename: string, extensions: string[]): boolean {
    const lower = filename.toLowerCase();
    return extensions.some((ext) => lower.endsWith(`.${ext}`));
  }

  onMessageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('goto-tag')) {
      event.preventDefault();
      const tag = target.textContent?.replace('goto#', '');
      if (tag) {
        this.scrollToTag(tag);
      }
    }
  }

  getYouTubeIds(message: DiscordMessage): string[] {
    if (!this.youtubeIdsCache.has(message.id)) {
      this.youtubeIdsCache.set(message.id, extractYouTubeVideoIds(message.content));
    }
    return this.youtubeIdsCache.get(message.id)!;
  }
}
