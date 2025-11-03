import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  temperature: number | null = null;
  humidity: number | null = null;
  weatherIcon: string = 'bi-cloud-sun';
  timeDifference: string = '-7 St.';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Aktualisiere jede Sekunde
    
    this.weatherService.getCurrentWeather().subscribe(data => {
      console.log('Weather data:', data);
      if (data && data.current_weather) {
        this.temperature = data.current_weather.temperature;
        this.weatherIcon = this.getWeatherIcon(data.current_weather.weathercode);
        if (data.hourly && data.hourly.relative_humidity_2m && data.hourly.time && data.current_weather.time) {
          const idx = data.hourly.time.indexOf(data.current_weather.time);
          if (idx !== -1) {
            this.humidity = data.hourly.relative_humidity_2m[idx];
          } else {
            this.humidity = null;
          }
        } else {
          this.humidity = null;
        }
      }
    });
  }

  getWeatherIcon(code: number): string {
    const peruTime = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', hour12: false });
    const hour = parseInt(peruTime, 10);
    console.log(hour);
    const isNight = hour >= 18 || hour < 6;
    if ([0].includes(code)) return isNight ? 'bi-moon' : 'bi-sun'; // Klar
    if ([1,2,3].includes(code)) return isNight ? 'bi-cloud-moon' : 'bi-cloud-sun'; // Teilweise bewölkt
    if ([45,48].includes(code)) return 'bi-cloud-fog2'; // Nebel
    if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'bi-cloud-drizzle'; // Regen
    if ([71,73,75,77,85,86].includes(code)) return 'bi-cloud-snow'; // Schnee
    if ([95,96,99].includes(code)) return 'bi-cloud-lightning-rain'; // Gewitter
    return isNight ? 'bi-moon' : 'bi-cloud'; // Standard
  }

  updateTime(): void {
    const germanyTime = new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hour12: false });
    const peruTime = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Berechne die Zeitdifferenz in Stunden zwischen Deutschland und Peru
    try {
      const germanyOffset = this.getTimezoneOffsetHours('Europe/Berlin');
      const peruOffset = this.getTimezoneOffsetHours('America/Lima');
      const diff = peruOffset - germanyOffset; // z.B. Germany UTC+1 (1) - Peru UTC-5 (-5) = 6
      this.timeDifference = this.formatHourDiff(diff);
    } catch (e) {
      // Falls etwas schief geht, belasse die bisherige Anzeige
      console.error('Fehler beim Berechnen der Zeitdifferenz:', e);
      this.timeDifference = '-';
    }

    const germanyElement = document.getElementById('time-germany');
    const peruElement = document.getElementById('time-peru');

    if (germanyElement) germanyElement.textContent = germanyTime;
    if (peruElement) peruElement.textContent = peruTime;
  }

  private getTimezoneOffsetHours(timeZone: string): number {
    // Erhalte die Komponenten der lokalen Zeit in der gewünschten Zeitzone
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).formatToParts(now);

    const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0);
    const year = get('year');
    const month = get('month');
    const day = get('day');
    const hour = get('hour');
    const minute = get('minute');
    const second = get('second');

    // Interpretiere die wall-clock Zeit der Zeitzone als UTC und vergleiche mit jetzt (UTC)
    const tzMillis = Date.UTC(year, month - 1, day, hour, minute, second);
    const nowMillis = Date.now();
    const offsetHours = (tzMillis - nowMillis) / (1000 * 60 * 60);
    // Rundung auf 0.5 Schritte, falls nötig (für halbstündige Zeitzonen)
    const rounded = Math.round(offsetHours * 2) / 2;
    return rounded;
  }

  private formatHourDiff(diff: number): string {
    const sign = diff >= 0 ? '+' : '-';
    const abs = Math.abs(diff);
    // Wenn ganze Stunde, zeige ohne Dezimalstelle, sonst eine Nachkommastelle
    const value = Number.isInteger(abs) ? String(abs) : abs.toFixed(1);
    return `${sign}${value} St.`;
  }
}