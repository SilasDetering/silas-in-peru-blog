import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Typdefinition für window.va (Vercel Analytics)
declare global {
  interface Window {
    va?: (eventType: string, eventData?: Record<string, any>) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private router: Router) {
    this.trackPageViews();
  }

  /**
   * Automatisches Tracking von Seitenaufrufen
   */
  private trackPageViews(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Vercel Analytics trackt automatisch
        // Du kannst hier zusätzliche benutzerdefinierte Events tracken
        console.log('Page viewed:', event.url);
      });
  }

  /**
   * Benutzerdefinierte Events tracken
   * z.B. Klicks auf wichtige Buttons oder Interaktionen
   */
  trackEvent(eventName: string, data?: any): void {
    // Verwende window.va wenn du benutzerdefinierte Events tracken möchtest
    if (window.va) {
      window.va('event', {
        name: eventName,
        ...data
      });
    }
  }
}
