import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Aktualisiere jede Sekunde
  }

  updateTime(): void {
    const germanyTime = new Date().toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin' });
    const peruTime = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });

    const germanyElement = document.getElementById('time-germany');
    const peruElement = document.getElementById('time-peru');

    if (germanyElement) germanyElement.textContent = germanyTime;
    if (peruElement) peruElement.textContent = peruTime;
  }
}