import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DiscordService } from './discord.service';
import { environment } from '../../environments/environment';

describe('DiscordService', () => {
  let service: DiscordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiscordService]
    });
    service = TestBed.inject(DiscordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should use environment configuration for API URL', () => {
    expect(service['apiUrl']).toBe(environment.apiUrl);
  });

  it('should generate correct Discord OAuth URL', () => {
    const url = service.getDiscordAuthUrl();
    expect(url).toContain('discord.com/api/oauth2/authorize');
    expect(url).toContain(`client_id=${environment.discord.clientId}`);
    expect(url).toContain(encodeURIComponent(environment.discord.redirectUri));
  });

  it('should get channels', () => {
    const mockChannels = [
      { id: '1', name: 'general', type: 0 },
      { id: '2', name: 'announcements', type: 0 }
    ];

    service.getChannels().subscribe(channels => {
      expect(channels.length).toBe(2);
      expect(channels).toEqual(mockChannels);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/discord/channels`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChannels);
  });

  it('should get channel messages', () => {
    const channelId = '123';
    const mockMessages = [
      { id: '1', content: 'Hello', author: { id: '1', username: 'User1' } }
    ];

    service.getChannelMessages(channelId).subscribe(messages => {
      expect(messages.length).toBe(1);
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/discord/channels/${channelId}/messages?limit=50`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should login with Discord code', () => {
    const code = 'test-code';
    const mockResponse = { sessionId: 'test-session-id' };
    const mockUser = { id: '1', username: 'TestUser', discordUserId: '123' };

    service.loginWithDiscord(code).subscribe(response => {
      expect(response.sessionId).toBe('test-session-id');
      expect(localStorage.getItem('discord_session_id')).toBe('test-session-id');
    });

    const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/discord/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({ code });
    loginReq.flush(mockResponse);

    // Handle the automatic loadCurrentUser call
    const userReq = httpMock.expectOne(`${environment.apiUrl}/users/me`);
    userReq.flush(mockUser);
  });

  it('should send message with session ID', () => {
    const channelId = '123';
    const content = 'Test message';
    const sessionId = 'test-session-id';
    
    localStorage.setItem('discord_session_id', sessionId);

    service.sendMessage(channelId, content).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/discord/channels/${channelId}/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-Session-Id')).toBe(sessionId);
    expect(req.request.body).toEqual({ content });
    req.flush({});
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBeFalsy();
    
    localStorage.setItem('discord_session_id', 'test-session');
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should logout and clear session', () => {
    localStorage.setItem('discord_session_id', 'test-session');
    
    service.logout();
    
    expect(localStorage.getItem('discord_session_id')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });
});
