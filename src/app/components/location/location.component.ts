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

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Aktualisiere jede Sekunde
    
    this.weatherService.getCurrentWeather().subscribe(data => {
      if (data && data.current_weather) {
        this.temperature = data.current_weather.temperature;
        this.weatherIcon = this.getWeatherIcon(data.current_weather.weathercode, data.current_weather.time);
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

  getWeatherIcon(code: number, isoTime?: string): string {
    // Nachtlogik: Zeige Mond-Icon zwischen 19 und 6 Uhr
    let hour = -1;
    if (isoTime) {
      // Zeit in Zeitzone Peru berechnen
      const utcDate = new Date(isoTime);
      // Hole die Stunde in Peru
      const peruHourStr = utcDate.toLocaleString('de-DE', { timeZone: 'America/Lima', hour: '2-digit', hour12: false });
      hour = parseInt(peruHourStr, 10);
    }
    const isNight = hour >= 19 || hour < 6;
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
    
    const germanyElement = document.getElementById('time-germany');
    const peruElement = document.getElementById('time-peru');

    if (germanyElement) germanyElement.textContent = germanyTime;
    if (peruElement) peruElement.textContent = peruTime;
  }
}