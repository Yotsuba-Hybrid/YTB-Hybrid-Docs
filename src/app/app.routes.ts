import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Community } from './components/community/community';
import { AuthCallback } from './components/community/auth-callback/auth-callback';

export const routes: Routes = [
  {
    path: '',
    component: Home
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
