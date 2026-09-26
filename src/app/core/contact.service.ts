import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface ContactPayload {
  name: string;
  contact: string;
  company?: string;
  position?: string;
  industry?: string;
  employees?: string;
  message?: string;
  lang: string;
  source: 'modal' | 'contact';
}

// The Telegram bot token lives only in the /api/contact serverless function.
@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  async submit(payload: ContactPayload): Promise<void> {
    await firstValueFrom(this.http.post('/api/contact', payload));
  }
}
