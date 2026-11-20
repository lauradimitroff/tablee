import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Le logo : une table vue de dessus et ses six convives. Le point terre cuite, c'est toi. */
@Component({
  selector: 'tb-logo',
  template: `
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="17" y="21" width="30" height="22" rx="5" />
      <circle cx="25" cy="11" r="5" />
      <circle cx="39" cy="11" r="5" />
      <circle cx="7" cy="32" r="5" />
      <circle cx="57" cy="32" r="5" />
      <circle cx="25" cy="53" r="5" />
      <circle class="toi" cx="39" cy="53" r="5" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 3rem;
      aspect-ratio: 1;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
    .toi {
      fill: var(--terre);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {}
