import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Features } from '../features/features';
import { Showcase } from '../showcase/showcase';
import { GetStarted } from '../get-started/get-started';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Hero,
    Features,
    Showcase,
    GetStarted
  ],
  template: `
    <app-hero></app-hero>
    <app-features></app-features>
    <app-showcase></app-showcase>
    <app-get-started></app-get-started>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class Home {}
