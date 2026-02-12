import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DiscordService } from '../../../services/discord.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './message-input.html',
  styleUrls: ['./message-input.css']
})
export class MessageInput implements AfterViewInit {
  @Input() channelId!: string;
  @Output() messageSent = new EventEmitter<void>();
  @ViewChild('messageTextarea') messageTextarea?: ElementRef<HTMLTextAreaElement>;

  messageContent = '';
  sending = false;
  inputFocused = false;

  constructor(
    private discordService: DiscordService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.autoResize();
  }

  sendMessage() {
    if (!this.messageContent.trim() || this.sending) {
      return;
    }

    this.sending = true;
    this.cdr.detectChanges();

    this.discordService.sendMessage(this.channelId, this.messageContent).subscribe({
      next: () => {
        this.messageContent = '';
        this.sending = false;
        this.resetTextareaHeight();
        this.cdr.detectChanges();
        this.snackBar.open('Mensaje enviado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.messageSent.emit();
      },
      error: () => {
        this.sending = false;
        this.cdr.detectChanges();
        this.snackBar.open('Error al enviar el mensaje', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoResize() {
    const textarea = this.messageTextarea?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }

  private resetTextareaHeight() {
    const textarea = this.messageTextarea?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
  }
}
