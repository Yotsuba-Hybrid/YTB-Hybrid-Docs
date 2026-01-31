import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  constructor(private router: Router) {}

  scrollToFeatures() {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToCommunity() {
    this.router.navigate(['/community']);
  }
}
