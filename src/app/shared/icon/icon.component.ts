import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type IconName =
  | 'layers' | 'cart' | 'shield' | 'check' | 'users' | 'lock' | 'sprint'
  | 'telegram' | 'phone' | 'mail' | 'arrow-right' | 'menu' | 'close'
  | 'chevron-down' | 'clock' | 'award' | 'globe';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <ng-container [ngSwitch]="name">
        <ng-container *ngSwitchCase="'layers'">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </ng-container>

        <ng-container *ngSwitchCase="'cart'">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21 8H6"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'shield'">
          <path d="M12 3 4.5 6v6c0 4.6 3.2 7.4 7.5 9 4.3-1.6 7.5-4.4 7.5-9V6L12 3Z"></path>
          <path d="m9.5 12 1.8 1.8L15 10"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'check'">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="m8.5 12.5 2.4 2.4L16 10"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'users'">
          <path d="M16 21v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V21"></path>
          <circle cx="9" cy="7.5" r="3.5"></circle>
          <path d="M17.5 11.5a3.5 3.5 0 0 0 0-7"></path>
          <path d="M21.5 21v-1.5a4 4 0 0 0-3-3.87"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'lock'">
          <rect x="4.5" y="10.5" width="15" height="10" rx="2"></rect>
          <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'sprint'">
          <path d="M5 21 12 3l7 18"></path>
          <path d="M8.5 13h7"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'telegram'">
          <path d="m21 4-3 16.5-6-4.5-3 3-1-5L21 4Z"></path>
          <path d="M8 13.5 19 5"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'phone'">
          <path d="M6 3h3l1.5 4.5-2 1.7a12 12 0 0 0 6.3 6.3l1.7-2L21 15v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'mail'">
          <rect x="3" y="5" width="18" height="14" rx="2"></rect>
          <path d="m3.5 6 8.5 7 8.5-7"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'arrow-right'">
          <path d="M4 12h16"></path>
          <path d="m13.5 5.5 6.5 6.5-6.5 6.5"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'menu'">
          <path d="M4 6.5h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 17.5h16"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'close'">
          <path d="m5 5 14 14"></path>
          <path d="m19 5-14 14"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'chevron-down'">
          <path d="m5.5 8.5 6.5 6.5 6.5-6.5"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'clock'">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3.5 2"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'award'">
          <circle cx="12" cy="8" r="5.5"></circle>
          <path d="m8.5 13-1.5 8 5-2.5 5 2.5-1.5-8"></path>
        </ng-container>

        <ng-container *ngSwitchCase="'globe'">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18"></path>
          <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"></path>
        </ng-container>
      </ng-container>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
  `],
  imports: [NgSwitch, NgSwitchCase],
})
export class IconComponent {
  @Input() name: IconName = 'check';
  @Input() size = 24;
}
