import { ChangeDetectionStrategy, Component, Input, forwardRef, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';

const PREFIX = '+998';
const LOCAL_DIGITS = 9;

export function uzPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  return !value || /^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(value) ? null : { phone: true };
}

const format = (digits: string): string =>
  [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ');

@Component({
  selector: 'app-phone-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneFieldComponent), multi: true }],
  template: `
    <div class="phone-field" [class.phone-field--disabled]="disabled()">
      <span class="phone-field__prefix"><small>UZ</small> {{ prefix }}</span>
      <input
        [id]="inputId"
        type="tel"
        inputmode="numeric"
        autocomplete="tel-national"
        [placeholder]="placeholder"
        [value]="display()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
    </div>
  `,
  styles: `
    .phone-field {
      display: flex;
      align-items: stretch;
      height: 48px;
      border-radius: var(--r-sm);
      background: var(--surface-2);
      border: 1px solid var(--line);
      transition: border-color var(--dur-fast), box-shadow var(--dur-fast);
      overflow: hidden;

      &:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
    }
    :host { display: block; }
    :host(.is-invalid) .phone-field { border-color: #f16a6a; }
    .phone-field--disabled { opacity: 0.6; }
    .phone-field__prefix {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0 14px 0 16px;
      border-right: 1px solid var(--line);
      font: 500 0.9rem var(--font-body);
      color: var(--fg);
      white-space: nowrap;
      small { font: 500 0.6rem var(--font-mono); letter-spacing: 0.08em; color: var(--fg-4); }
    }
    input {
      flex: 1;
      width: 100%;
      min-width: 0;
      padding: 0 16px;
      border: 0;
      background: transparent;
      color: var(--fg);
      font: 400 0.9rem var(--font-body);
      letter-spacing: 0.02em;
      outline: none;
      &::placeholder { color: var(--fg-3); }
    }
  `,
})
export class PhoneFieldComponent implements ControlValueAccessor {
  @Input() inputId = '';
  @Input() placeholder = '90 123 45 67';

  readonly prefix = PREFIX;
  readonly display = signal('');
  readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    const digits = String(value ?? '').replace(/\D/g, '').replace(/^998/, '').slice(0, LOCAL_DIGITS);
    this.display.set(format(digits));
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled.set(disabled); }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Pasting "+998 91 ..." or "998..." should not duplicate the country code.
    let digits = input.value.replace(/\D/g, '');
    if (digits.length > LOCAL_DIGITS && digits.startsWith('998')) digits = digits.slice(3);
    digits = digits.slice(0, LOCAL_DIGITS);

    const formatted = format(digits);
    input.value = formatted;
    this.display.set(formatted);
    this.onChange(digits ? `${PREFIX} ${formatted}` : '');
  }
}
