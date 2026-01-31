import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DiscordService } from '../../../services/discord.service';
import { DiscordChannel } from '../../../models/discord.model';

interface ChannelCategory {
  name: string;
  channels: DiscordChannel[];
  collapsed: boolean;
}

@Component({
  selector: 'app-channel-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './channel-list.html',
  styleUrls: ['./channel-list.css'],
  animations: [
    trigger('slideDown', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'visible',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', animate('200ms ease-in-out'))
    ])
  ]
})
export class ChannelList implements OnInit {
  @Output() channelSelected = new EventEmitter<DiscordChannel>();
  
  public categories: ChannelCategory[] = [];
  selectedChannelId: string | null = null;
  loading = true;
  error = false;

  constructor(private discordService: DiscordService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    this.loading = true;
    this.error = false;
    this.discordService.getChannels().subscribe({
      next: (channels: any) => {
        this.ngZone.run(() => {
          this.organizeChannels(channels);
          this.loading = false;
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

  private organizeChannels(channels: DiscordChannel[]) {
    // Separate categories and text channels
    const categories = channels
    .filter(c => c.type === 4); // Category type
    const textChannels = channels
    .filter(c => c.type === 0 || c.type === 15); // Text channel type

    // Group channels by category and add category name to each channel
    let groupedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      channels: textChannels
        .filter(channel => channel.parent_id === category.id)
        .map(channel => ({ ...channel, categoryName: category.name }))
        .sort((a, b) => a.position - b.position),
      collapsed: false
    })).filter(cat => cat.channels.length > 0);

    // Move category with id == 1466469051147751578 to the first position
    const specialId = '1466469051147751578';
    const specialIndex = groupedCategories.findIndex(cat => cat.id == specialId);
    if (specialIndex > -1) {
      const [specialCat] = groupedCategories.splice(specialIndex, 1);
      groupedCategories.unshift(specialCat);
    }

    // Remove id property for final categories
    this.categories = groupedCategories.map(({id, ...rest}) => rest);

    // Add uncategorized channels
    const uncategorized = textChannels.filter(c => !c.parent_id);
    if (uncategorized.length > 0) {
      this.categories.unshift({
        name: 'Canales',
        channels: uncategorized.sort((a, b) => a.position - b.position),
        collapsed: false
      });
    }
  }

  toggleCategory(category: ChannelCategory) {
    category.collapsed = !category.collapsed;
  }

  selectChannel(channel: DiscordChannel) {
    this.selectedChannelId = channel.id;
    this.channelSelected.emit(channel);
  }

  getChannelIcon(channel: DiscordChannel): string {
    return 'tag';
  }
}
