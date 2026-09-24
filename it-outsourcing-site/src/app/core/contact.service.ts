import { Injectable } from '@angular/core';

export interface ContactPayload {
  name: string;
  company: string;
  industry: string;
  employees: string;
  contact: string;
  message: string;
}

/**
 * Sending the Telegram/email notification requires a server-side bot token,
 * which must never live in frontend code. This service is the integration
 * point for that backend endpoint; until one is configured it resolves
 * locally so the form remains fully testable end to end.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async submit(payload: ContactPayload): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    // eslint-disable-next-line no-console
    console.info('[contact] request captured', payload);
  }
}
