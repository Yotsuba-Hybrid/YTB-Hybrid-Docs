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
      description: 'Optimizado para generar juegos de altísimo rendimiento. Minimiza allocaciones y maximiza FPS en todas las plataformas.'
    },
    {
      icon: 'code',
      title: 'C# Moderno',
      description: 'Usa las últimas características de C# 14+ con hot-reload para desarrollo rápido e iterativo.'
    },
    {
      icon: 'view_in_ar',
      title: 'ECS Architecture',
      description: 'Sistema Entity-Component-System para código modular, eficiente y fácil de mantener.'
    },
    {
      icon: 'layers',
      title: 'Sistema de Escenas',
      description: 'Crea escenas y niveles fácilmente con un sistema de gestión de escenas flexible y potente.'
    },
    {
      icon: 'gamepad',
      title: 'Collisiones 2D',
      description: 'Motor de Collisiones 2D integrado para agilizar tus juegos.'
    },
    {
      icon: 'animation',
      title: 'Animaciones',
      description: 'Sistema robusto para las animaciones de tus sprites animaciones.'
    },
    {
      icon: 'grid_on',
      title: 'TileMaps',
      description: 'La forma estandar en Yotsuba de crear niveles 2D es con Tiled editor. Crea tus niveles y exportalos.'
    },
    {
      icon: 'edit',
      title: 'Editor Integrado',
      description: 'Editor visual potente con ImGui para diseñar niveles, editar propiedades, y agilizar tu desarrollo.'
    }
  ];
}
