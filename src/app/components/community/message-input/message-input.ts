import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DiscordService } from '../../../services/discord.service';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './message-input.html',
  styleUrls: ['./message-input.css']
})
export class MessageInput {
  @Input() channelId!: string;
  
  messageContent = '';
  sending = false;

  constructor(
    private discordService: DiscordService,
    private snackBar: MatSnackBar
  ) {}

  sendMessage() {
    if (!this.messageContent.trim() || this.sending) {
      return;
    }

    this.sending = true;

    this.discordService.sendMessage(this.channelId, this.messageContent).subscribe({
      next: () => {
        this.messageContent = '';
        this.sending = false;
        this.snackBar.open('Mensaje enviado', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        this.sending = false;
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
}
