import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '../../core/i18n/translate.service';
import { SeoService } from '../../core/seo.service';
import { ContactService } from '../../core/contact.service';
import { IconComponent } from '../../shared/icon/icon.component';

type Status = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly i18n = inject(TranslateService);
  private seo = inject(SeoService);
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  readonly status = signal<Status>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    industry: ['', Validators.required],
    employees: ['', Validators.required],
    contact: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
    // honeypot: real visitors never see or fill this field
    website: [''],
  });

  get industryOptions(): string[] {
    return this.i18n.list<string>('contact.form.industryOptions');
  }

  get employeesOptions(): string[] {
    return this.i18n.list<string>('contact.form.employeesOptions');
  }

  constructor() {
    effect(() => this.seo.set(this.i18n.t('meta.titles.contact'), this.i18n.t('contact.subtitle')));
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.form.get('website')?.value) {
      // honeypot tripped — pretend to succeed, send nothing
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
      await this.contactService.submit({ ...payload, lang: this.i18n.lang() });
      this.status.set('success');
      this.form.reset();
    } catch {
      this.status.set('error');
    }
  }
}
