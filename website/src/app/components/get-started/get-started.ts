import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Step {
  number: number;
  title: string;
  description: string;
  command?: string;
}

@Component({
  selector: 'app-get-started',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './get-started.html',
  styleUrl: './get-started.css',
})
export class GetStarted {
  steps: Step[] = [
    {
      number: 1,
      title: 'Instala el Motor',
      description: 'Descarga YotsubaEngine desde nuestro repositorio o instálalo vía NuGet.',
      command: 'dotnet add package YotsubaEngine'
    },
    {
      number: 2,
      title: 'Crea tu Proyecto',
      description: 'Usa la plantilla de proyecto para iniciar rápidamente.',
      command: 'dotnet new ytbgame -n MyGame'
    },
    {
      number: 3,
      title: 'Escribe tu Primer Script',
      description: 'Define comportamientos para tus entidades con componentes C#.',
      command: 'public class MyScript : Component { }'
    },
    {
      number: 4,
      title: '¡Compila y Ejecuta!',
      description: 'Compila tu juego y despliégalo en cualquier plataforma soportada.',
      command: 'dotnet run'
    }
  ];

  copyCommand(command: string) {
    navigator.clipboard.writeText(command);
  }
}
