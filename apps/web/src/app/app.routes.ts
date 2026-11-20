import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Tablée · soirées jeux',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
];
