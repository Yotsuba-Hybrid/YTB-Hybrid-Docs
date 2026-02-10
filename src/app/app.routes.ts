import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Community } from './components/community/community';
import { AuthCallback } from './components/community/auth-callback/auth-callback';
import { Documentation } from './components/documentation/documentation';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'documentation',
    component: Documentation
  },
  {
    path: 'documentation/:channel',
    component: Documentation
  },
  {
    path: 'community',
    component: Community
  },
  {
    path: 'community/callback',
    component: AuthCallback
  }
];
