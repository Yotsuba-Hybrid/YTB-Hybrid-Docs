import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  features: Feature[] = [
    {
      icon: 'devices',
      title: 'Multiplataforma',
      description: 'Despliega en Windows, Linux, macOS, iOS, Android y consolas. Un código, todas las plataformas.'
    },
    {
      icon: 'speed',
      title: 'Alto Rendimiento',
      description: 'Optimizado para AOT compilation. Minimiza allocaciones y maximiza FPS en todas las plataformas.'
    },
    {
      icon: 'code',
      title: 'C# Moderno',
      description: 'Usa las últimas características de C# 12+ con hot-reload para desarrollo rápido e iterativo.'
    },
    {
      icon: 'view_in_ar',
      title: 'ECS Architecture',
      description: 'Sistema Entity-Component-System para código modular, eficiente y fácil de mantener.'
    },
    {
      icon: 'layers',
      title: 'Sistema de Escenas',
      description: 'Gestiona tus juegos con escenas serializables en formato JSON (.ytb) fácil de usar.'
    },
    {
      icon: 'gamepad',
      title: 'Física 2D',
      description: 'Motor de física 2D integrado con colisiones, triggers y física realista para tus juegos.'
    },
    {
      icon: 'animation',
      title: 'Animaciones',
      description: 'Sistema completo de animaciones con soporte para sprites, transiciones y estados.'
    },
    {
      icon: 'grid_on',
      title: 'TileMaps',
      description: 'Editor y runtime para tilemaps con soporte para múltiples capas y colisiones.'
    },
    {
      icon: 'edit',
      title: 'Editor Integrado',
      description: 'Editor visual potente con ImGui para diseñar niveles, editar propiedades y debuggear en tiempo real.'
    }
  ];
}
