import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tribes-wordcloud',
  templateUrl: './tribes-wordcloud.component.html',
  styleUrls: ['./tribes-wordcloud.component.css']
})
export class TribesWordcloudComponent implements OnInit {

  constructor() {}

  tribes: { [key: string]: number } = {
    "Ashaninka": 100,
    "Shipibo": 80,
    "Yanesha": 60,
    "Cashibo": 40,
    "Shawi": 30,
    "er": 100,
    "werwer": 80,
    "werwerer": 60,
    "werewr": 40,
    "werwrwerf": 30,
    "vrwrewv": 100,
    "wvwevwr": 80,
    "wev": 60,
    "Caswevwehibo": 40,
    "wevwevrewrw": 30
  }
  
  entries: { word: string; weight: number }[] = [];
  // add small random rotation for a more 'cloud' look
  entriesWithRot: { word: string; weight: number; rot: number }[] = [];
  private minFont = 14; // px
  private maxFont = 64; // px
  private minWeight = 0;
  private maxWeight = 1;

  ngOnInit(): void {
    // convert tribes object to array and compute min/max weights
    this.entries = Object.keys(this.tribes).map(k => ({ word: k, weight: this.tribes[k] }));
    // shuffle so layout looks less ordered
    this.entries.sort(() => Math.random() - 0.5);
    if (this.entries.length) {
      this.minWeight = Math.min(...this.entries.map(e => e.weight));
      this.maxWeight = Math.max(...this.entries.map(e => e.weight));
    }
    // create entries with rotation
    this.entriesWithRot = this.entries.map(e => ({ ...e, rot: (Math.random() - 0.5) * 30 }));
  }

  getFontSize(weight: number): number {
    if (this.maxWeight === this.minWeight) return (this.minFont + this.maxFont) / 2;
    const t = (weight - this.minWeight) / (this.maxWeight - this.minWeight);
    return Math.round(this.minFont + t * (this.maxFont - this.minFont));
  }
}