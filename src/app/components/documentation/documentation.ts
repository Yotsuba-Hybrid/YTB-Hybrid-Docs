import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { DiscordService } from '../../services/discord.service';
import { DiscordChannel } from '../../models/discord.model';
import { MessageFeed } from '../community/message-feed/message-feed';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MessageFeed
  ],
  templateUrl: './documentation.html',
  styleUrls: ['./documentation.css']
})
export class Documentation implements OnInit, OnDestroy {
  channels: DiscordChannel[] = [];
  selectedChannelId: string | null = null;
  selectedChannel?: DiscordChannel;
  loading = true;
  error = false;
  isMobile = false;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  private destroy$ = new Subject<void>();
  private readonly learnCategoryName = 'learn';
  private pendingChannelRef: string | null = null;

  constructor(
    private discordService: DiscordService,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.watchChannelFromUrl();
    this.loadChannels();

    this.breakpointObserver.observe(['(max-width: 719px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
        if (result.matches) {
          this.sidenavMode = 'over';
          this.sidenavOpened = false;
        } else {
          this.sidenavMode = 'side';
          this.sidenavOpened = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadChannels() {
    this.loading = true;
    this.error = false;
    this.discordService.getChannels().subscribe({
      next: (channels: DiscordChannel[]) => {
        this.ngZone.run(() => {
          this.channels = this.extractLearnChannels(channels);
          this.loading = false;

          if (this.selectedChannelId) {
            const current = this.channels.find(channel => channel.id === this.selectedChannelId);
            this.selectedChannel = current;
            if (!current) {
              this.selectedChannelId = null;
            }
          }

          this.trySelectChannelFromRef();

          if (!this.selectedChannelId && this.channels.length > 0) {
            this.selectChannel(this.channels[0], false);
          }

          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.ngZone.run(() => {
          this.error = true;
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  selectChannel(channel: DiscordChannel, closeOnMobile: boolean = true) {
    this.selectedChannelId = channel.id;
    this.selectedChannel = channel;
    if (closeOnMobile && this.sidenavMode === 'over') {
      this.sidenavOpened = false;
    }
  }

  trackByChannelId(index: number, channel: DiscordChannel): string {
    return channel.id;
  }

  private watchChannelFromUrl() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, query]) => {
        const ref = this.extractChannelRef(query, params);
        this.pendingChannelRef = ref;
        if (ref) {
          this.trySelectChannelFromRef();
        }
      });
  }

  private extractChannelRef(query: { get: (key: string) => string | null }, params: { get: (key: string) => string | null }): string | null {
    return this.getParamValue(query) ?? this.getParamValue(params);
  }

  private getParamValue(paramMap: { get: (key: string) => string | null }): string | null {
    return paramMap.get('channel') ?? paramMap.get('id') ?? paramMap.get('name');
  }

  private trySelectChannelFromRef() {
    if (!this.pendingChannelRef || this.channels.length === 0) {
      return;
    }

    const target = this.findChannelByRef(this.pendingChannelRef);
    if (target) {
      this.selectChannel(target, false);
    }
  }

  private findChannelByRef(ref: string): DiscordChannel | undefined {
    const rawRef = this.safeDecode(ref);
    const normalizedRef = this.normalizeChannelRef(rawRef);
    return this.channels.find(channel =>
      channel.id === rawRef ||
      channel.id === normalizedRef ||
      this.normalizeChannelRef(channel.name ?? '') === normalizedRef
    );
  }

  private normalizeChannelRef(value: string): string {
    return value
      .trim()
      .replace(/^#/, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  private safeDecode(value: string): string {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  private extractLearnChannels(channels: DiscordChannel[]): DiscordChannel[] {
    const learnCategory = channels.find(
      channel => channel.type === 4 && channel.name?.toLowerCase() === this.learnCategoryName
    );
    if (!learnCategory) {
      return [];
    }

    return channels
      .filter(channel =>
        (channel.type === 0 || channel.type === 15) && channel.parent_id === learnCategory.id
      )
      .map(channel => ({ ...channel, categoryName: learnCategory.name }))
      .sort((a, b) => a.position - b.position);
  }
}
