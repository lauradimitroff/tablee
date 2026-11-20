import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  it('affiche le nom et le slogan', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('h1')?.textContent).toBe('Tablée');
    expect(page.querySelector('.slogan')?.textContent).toBe('Soirées jeux');
  });
});
