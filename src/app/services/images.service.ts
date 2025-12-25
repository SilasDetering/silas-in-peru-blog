import { Injectable } from '@angular/core';
import images from '../../assets/fotos/images.json';
import images_cashibo from '../../assets/fotos/cashibo.json';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // CDN settings (zentralisiert, wiederverwendbar)
  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_SMALL_SUBFOLDER = '800px';
  private readonly CDN_VIDEO_THUMBNAIL_SUBFOLDER = 'video-thumbnails';

  // Fixed CDN folder name (immutable): always use this for full/small URLs
  private readonly CDN_FOLDER = 'Fotos';

  private imageData: { [key: string]: string[] } = images as any;
  private cashiboData: { [key: string]: string[] } = images_cashibo as any;

  /**
   * Gibt die kleine (800px) CDN-URL für ein Bild zurück.
   */
  getCdnSmallUrl(filename: string): string {
    const fname = (filename.split('/').pop() || filename).trim();
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${this.CDN_SMALL_SUBFOLDER}/${fname}`;
  }

  /**
   * Gibt die volle CDN-URL für ein Bild zurück (ohne Subfolder).
   */
  getCdnFullUrl(filename: string): string {
    const fname = (filename.split('/').pop() || filename).trim();
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${fname}`;
  }

  /**
   * Für Videos: liefert die erwartete Thumbnail-URL (gleicher Dateiname mit .jpg).
   * Falls auf dem CDN Thumbnails mit .jpg erzeugt sind, kann diese URL als poster verwendet werden.
   */
  getCdnVideoThumbnailUrl(filename: string): string {
    const base = (filename.split('/').pop() || filename).trim();
    const nameOnly = base.replace(/\.[^/.]+$/, '');
    const thumb = `${nameOnly}.jpg`;
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${this.CDN_VIDEO_THUMBNAIL_SUBFOLDER}/${thumb}`;
  }

  getFolders(): string[] {
    return Object.keys(this.imageData);
  }

  getImagesByFolder(folder: string): string[] {
    return this.imageData[folder] || [];
  }

  // Liefert die Einträge aus assets/fotos/cashibo.json (Schlüssel "Cashibo")
  getCashiboImages(): any[] {
    return (this.cashiboData && this.cashiboData['Cashibo']) ? this.cashiboData['Cashibo'] : [];
  }

  // Neue Hilfen für verschachtelte Struktur

  /**
   * Liefert alle top-level Sektionen (z.B. "September/Oktober").
   */
  getSectionNames(): string[] {
    return Object.keys(this.imageData as any);
  }

  /**
   * Liefert die Subfolder-Namen innerhalb einer Sektion.
   * Falls die Sektion ein einfaches Array ist, gibt [] zurück.
   */
  getSubfolders(section: string): string[] {
    const sec = (this.imageData as any)[section];
    if (sec && typeof sec === 'object' && !Array.isArray(sec)) {
      return Object.keys(sec);
    }
    return [];
  }

  /**
   * Liefert die Bilder eines Subfolders innerhalb einer Sektion.
   * Falls das alte (flache) Format vorliegt, versucht es als fallback.
   */
  private normalizeEntries(entries: any): any[] {
    if (!entries) return [];

    // bereits altes Format: Array von Einträgen
    if (Array.isArray(entries)) return entries;

    // Neues einfaches Mapping: { "filename.jpg": "comment", ... }
    if (entries && typeof entries === 'object') {
      // Falls Struktur { order: [...], items: { filename: comment } }
      if (Array.isArray((entries as any).order) && (entries as any).items && typeof (entries as any).items === 'object') {
        const items = (entries as any).items;
        const order = (entries as any).order as string[];
        // Erzeuge Array im spezifizierten order
        return order.map(fn => ({ [fn]: items[fn] ?? '' }));
      }

      // Falls einfaches Mapping von filename -> comment
      return Object.keys(entries).map(key => ({ [key]: (entries as any)[key] }));
    }

    return [];
  }

  getImagesIn(section: string, subfolder: string): any[] {
    const sec = (this.imageData as any)[section];

    // Wenn section ein Objekt mit Subfolders ist
    if (sec && typeof sec === 'object' && !Array.isArray(sec)) {
      const raw = sec[subfolder];
      const normalized = this.normalizeEntries(raw);
      if (normalized.length) return normalized;
      // Falls nicht gefunden: vielleicht ist subfolder ein top-level key (fallback)
    }

    // Falls section selbst ein Array (altes Format) und subfolder == section
    if (Array.isArray(sec) && section === subfolder) return this.normalizeEntries(sec as any);

    // fallback: eventuell ist subfolder ein top-level key (altes Format oder Mapping)
    const fallback = (this.imageData as any)[subfolder];
    return this.normalizeEntries(fallback);
  }
}
