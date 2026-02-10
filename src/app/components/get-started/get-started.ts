import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-started',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './get-started.html',
  styleUrl: './get-started.css',
})
export class GetStarted {
}
