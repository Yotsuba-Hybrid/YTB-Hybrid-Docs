import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'code', name: 'GitHub', url: 'https://github.com/MyEngine-Official/YotsubaEngine' },
    { icon: 'chat', name: 'Discord', url: '#' },
    { icon: 'article', name: 'Docs', url: '#' }
  ];

  links = {
    product: [
      { label: 'Características', url: '#features' },
      { label: 'Descargas', url: '#' },
      { label: 'Roadmap', url: '#' },
      { label: 'Changelog', url: '#' }
    ],
    developers: [
      { label: 'Documentación', url: '#' },
      { label: 'API Reference', url: '#' },
      { label: 'Tutoriales', url: '#' },
      { label: 'Ejemplos', url: '#' }
    ],
    community: [
      { label: 'Discord', url: '#' },
      { label: 'GitHub', url: 'https://github.com/MyEngine-Official/YotsubaEngine' },
      { label: 'Twitter', url: '#' },
      { label: 'Blog', url: '#' }
    ]
  };
}
