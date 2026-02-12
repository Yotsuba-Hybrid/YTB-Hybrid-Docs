import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { DiscordService } from '../../services/discord.service';
import { DiscordChannel } from '../../models/discord.model';
import { ChannelList } from './channel-list/channel-list';
import { MessageFeed } from './message-feed/message-feed';
import { MessageInput } from './message-input/message-input';
import { Location } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    ChannelList,
    MessageFeed,
    MessageInput,
    RouterLink
],
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})

export class Community implements OnInit, OnDestroy {
  @ViewChild(MessageFeed) messageFeed?: MessageFeed;
  @ViewChild('channelList') channelList: any;
  
  selectedChannelId: string | null = null;
  selectedChannel: DiscordChannel | undefined = undefined;
  isAuthenticated = false;
  currentUser: any = null;
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(
    public discordService: DiscordService,
    private breakpointObserver: BreakpointObserver,
    private location: Location
  ) {}

  ngOnInit() {
    this.discordService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.isAuthenticated = !!user;
      });

    // Responsive: detect mobile for <720px
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

  onChannelSelected(channel: DiscordChannel) {
    this.selectedChannelId = channel.id;
    this.selectedChannel = channel;
    // Close sidenav on mobile after selecting a channel
    if (this.sidenavMode === 'over') {
      this.sidenavOpened = false;
    }
  }

  refreshMessages() {
    if (this.messageFeed) {
      this.messageFeed.loadMessages();
    }
  }

  onMessageSent() {
    if (this.messageFeed) {
      this.messageFeed.loadMessages();
    }
  }

  login() {
    window.location.href = this.discordService.getDiscordAuthUrl();
  }

  logout() {
    this.discordService.logout();
  }

  

  getUserAvatarUrl(): string {
    if (!this.currentUser) return '';
    
    if (this.currentUser.avatar) {
      // Check if avatar is a full Discord URL or just the hash
      if (this.currentUser.avatar.startsWith('http')) {
        return this.currentUser.avatar;
      }
      // Construct Discord CDN URL from user ID and avatar hash
      const userId = this.currentUser.discordUserId || this.currentUser.id;
      if (userId) {
        return `https://cdn.discordapp.com/avatars/${userId}/${this.currentUser.avatar}.png`;
      }
    }
    
    // Default Discord avatar
    const userId = this.currentUser.discordUserId || this.currentUser.id || '0';
    const defaultIndex = this.getDefaultAvatarIndex(userId);
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  }

  private getDefaultAvatarIndex(userId: string): number {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return 0;
    }
    return userIdNum % 5;
  }
}
