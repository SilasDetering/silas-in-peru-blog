import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {

  // Koordinaten für Pucallpa
  private lat = -8.3791;
  private lon = -74.5539;
  private apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current_weather=true&hourly=relative_humidity_2m`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
