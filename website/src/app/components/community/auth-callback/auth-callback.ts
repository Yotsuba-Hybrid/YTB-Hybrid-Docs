import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DiscordService } from '../../../services/discord.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="callback-container">
      <mat-spinner diameter="60"></mat-spinner>
      <p>Autenticando con Discord...</p>
      <p *ngIf="error" class="error-message">{{ error }}</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #36393f;
      color: #fff;
    }

    .callback-container p {
      margin-top: 16px;
      font-size: 16px;
    }

    .error-message {
      color: #f04747;
    }
  `]
})
export class AuthCallback implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private discordService: DiscordService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.error = 'Error de autenticación: ' + error;
        setTimeout(() => this.router.navigate(['/community']), 3000);
        return;
      }

      if (code) {
        this.discordService.loginWithDiscord(code).subscribe({
          next: () => {
            this.router.navigate(['/community']);
          },
          error: () => {
            this.error = 'Error al autenticar con Discord';
            setTimeout(() => this.router.navigate(['/community']), 3000);
          }
        });
      } else {
        this.error = 'No se recibió código de autenticación';
        setTimeout(() => this.router.navigate(['/community']), 3000);
      }
    });
  }
}
