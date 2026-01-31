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
      description: 'Sistema ECS intuitivo para construir objetos de juego modulares y reutilizables.',
      code: [
        'var player = new Entity("Player");',
        'player.AddComponent<SpriteRenderer>();',
        'player.AddComponent<RigidBody2D>();',
        'player.AddComponent<PlayerController>();',
        'Scene.AddEntity(player);'
      ]
    },
    {
      title: 'Carga Escenas Fácilmente',
      description: 'Sistema de escenas flexible con serialización JSON para gestionar niveles complejos.',
      code: [
        'var scene = SceneManager.LoadScene("Level1.ytb");',
        'SceneManager.SetActiveScene(scene);',
        '',
        '// Hot-reload support',
        'scene.OnSceneReloaded += () => {',
        '    Console.WriteLine("Scene reloaded!");',
        '};'
      ]
    },
    {
      title: 'Física 2D Potente',
      description: 'Motor de física completo con colisiones, triggers y control preciso.',
      code: [
        'var rb = GetComponent<RigidBody2D>();',
        'rb.Velocity = new Vector2(10, 0);',
        'rb.ApplyForce(Vector2.Up * jumpForce);',
        '',
        'if (rb.IsGrounded) {',
        '    rb.Jump(jumpHeight);',
        '}'
      ]
    }
  ];
}
