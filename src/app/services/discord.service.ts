import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, DiscordChannel, DiscordMessage, AuthResponse } from '../models/discord.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscordService {
  private apiUrl = environment.apiUrl;
  private sessionIdKey = 'discord_session_id';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load session from localStorage
    const sessionId = this.getSessionId();
    if (sessionId) {
      this.loadCurrentUser().subscribe();
    }
  }

  private getHeaders(): HttpHeaders {
    const sessionId = this.getSessionId();
    let headers = new HttpHeaders();
    if (sessionId) {
      headers = headers.set('X-Session-Id', sessionId);
    }
    return headers;
  }

  private getSessionId(): string | null {
    return localStorage.getItem(this.sessionIdKey);
  }

  private setSessionId(sessionId: string): void {
    localStorage.setItem(this.sessionIdKey, sessionId);
  }

  private clearSessionId(): void {
    localStorage.removeItem(this.sessionIdKey);
  }

  loginWithDiscord(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/discord/login`, { code }).pipe(
      tap(response => {
        this.setSessionId(response.sessionId);
        this.loadCurrentUser().subscribe();
      })
    );
  }

  logout(): void {
    this.clearSessionId();
    this.currentUserSubject.next(null);
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, { headers: this.getHeaders() }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getChannels(): Observable<DiscordChannel[]> {
    return this.http.get<DiscordChannel[]>(`${this.apiUrl}/discord/channels`);
  }

  getChannelMessages(channelId: string, limit: number = 50): Observable<DiscordMessage[]> {
    return this.http.get<DiscordMessage[]>(`${this.apiUrl}/discord/channels/${channelId}/messages?limit=${limit}`);
  }

  sendMessage(channelId: string, content: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/discord/channels/${channelId}/messages`,
      { content },
      { headers: this.getHeaders() }
    );
  }

  isAuthenticated(): boolean {
    return !!this.getSessionId();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Helper to construct Discord OAuth URL
  getDiscordAuthUrl(): string {
    const clientId = environment.discord.clientId;
    const redirectUri = encodeURIComponent(environment.discord.redirectUri);
    const scopes = encodeURIComponent('identify guilds');
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
  }
}
