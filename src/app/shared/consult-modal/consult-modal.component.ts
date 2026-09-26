import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultModalService } from '../../core/consult-modal.service';
import { ContactService } from '../../core/contact.service';
import { CONTACT } from '../../core/contact-info';
import { TranslateService } from '../../core/i18n/translate.service';
import { IconComponent } from '../icon/icon.component';
import { PhoneFieldComponent, uzPhoneValidator } from '../phone-field/phone-field.component';

type Status = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-consult-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent, PhoneFieldComponent],
  templateUrl: './consult-modal.component.html',
  styleUrl: './consult-modal.component.scss',
})
export class ConsultModalComponent {
  readonly modal = inject(ConsultModalService);
  readonly i18n = inject(TranslateService);
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  readonly info = CONTACT;
  readonly status = signal<Status>('idle');
  private nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    contact: ['', [Validators.required, uzPhoneValidator]],
    industry: [''],
    employees: [''],
    position: [''],
    website: [''],
  });

  constructor() {
    effect(() => {
      const open = this.modal.isOpen();
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        this.status.set('idle');
        setTimeout(() => this.nameInput()?.nativeElement.focus(), 50);
      }
    });
  }

  get industryOptions(): string[] {
    return this.i18n.list<string>('contact.form.industryOptions');
  }

  get employeesOptions(): string[] {
    return this.i18n.list<string>('contact.form.employeesOptions');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modal.isOpen()) this.modal.close();
  }

  isInvalid(name: 'name' | 'contact'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.controls.website.value) {
      this.status.set('success');
      this.form.reset();
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    try {
      const { website: _website, ...payload } = this.form.getRawValue();
      await this.contactService.submit({ ...payload, lang: this.i18n.lang(), source: 'modal' });
      this.status.set('success');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }
}
