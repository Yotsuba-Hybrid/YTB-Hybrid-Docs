import { TestBed } from '@angular/core/testing';
import { Router, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterOutlet]
})
class TestHostComponent {}

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to home route', async () => {
    await router.navigate(['']);
    expect(location.path()).toBe('');
  });

  it('should navigate to community route', async () => {
    await router.navigate(['/community']);
    expect(location.path()).toBe('/community');
  });

  it('should navigate to community callback route', async () => {
    await router.navigate(['/community/callback']);
    expect(location.path()).toBe('/community/callback');
  });

  it('should navigate to documentation route', async () => {
    await router.navigate(['/documentation']);
    expect(location.path()).toBe('/documentation');
  });

  it('should navigate to documentation channel route', async () => {
    await router.navigate(['/documentation', 'setup']);
    expect(location.path()).toBe('/documentation/setup');
  });

  it('should have five routes configured', () => {
    expect(routes.length).toBe(5);
  });

  it('should have home route at root', () => {
    const homeRoute = routes.find(r => r.path === '');
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.component).toBeDefined();
  });

  it('should have community route', () => {
    const communityRoute = routes.find(r => r.path === 'community');
    expect(communityRoute).toBeDefined();
    expect(communityRoute?.component).toBeDefined();
  });

  it('should have documentation route', () => {
    const documentationRoute = routes.find(r => r.path === 'documentation');
    expect(documentationRoute).toBeDefined();
    expect(documentationRoute?.component).toBeDefined();
  });

  it('should have documentation channel route', () => {
    const documentationRoute = routes.find(r => r.path === 'documentation/:channel');
    expect(documentationRoute).toBeDefined();
    expect(documentationRoute?.component).toBeDefined();
  });
});
