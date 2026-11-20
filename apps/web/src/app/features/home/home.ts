import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Logo } from '../../ui/logo/logo';

/** Page d'accueil provisoire, en attendant l'authentification (étape 2). */
@Component({
  selector: 'tb-home',
  imports: [Logo],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
