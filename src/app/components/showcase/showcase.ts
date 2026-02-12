import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface ShowcaseItem {
  title: string;
  description: string;
  code: string[];
}

@Component({
  selector: 'app-showcase',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './showcase.html',
  styleUrl: './showcase.css',
})
export class Showcase {
  showcaseItems: ShowcaseItem[] = [
    {
      title: 'Crea Entidades con Facilidad',
      description: 'Sistema ECS muy semántico e intuitivo para construir objetos de juego modulares y reutilizables.',
      code: [
        'var player = new Yotsuba();',
        'EntityManager.AddEntity(player);',
        'TransformComponent transform = new TransformComponent { Position = new Vector3(0, 0, 0) };',
        'EntityManager.AddTransformComponent(player, transform);',
      ]
    },
    {
      title: 'Carga Escenas Fácilmente',
      description: 'Cambia fácilmente entre escenas y niveles con una sola línea de código.',
      code: [
        'ChangeScene("Level2")',
        ''
      ]
    },
    {
      title: 'Física 2D Potente',
      description: 'Motor de física con colisiones, triggers y control preciso.',
      code: [
        'ref var rb = ref GetRigibodyComponent();',
        'rb.Velocity = new Vector2(10, 0, 0);',
        '',
      ]
    }
  ];
}
