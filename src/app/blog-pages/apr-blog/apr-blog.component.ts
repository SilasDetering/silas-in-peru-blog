import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-apr-blog',
  templateUrl: './apr-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class AprBlogComponent implements AfterViewInit {

  readonly image1Filename = 'IMG_4297.HEIC';
  readonly image2Filename = 'DSCF9469.jpg';
  readonly image3Filename = 'DSCF9372.jpg';
  readonly image4Filename = '1119EBCC-CF46-45BE-AE2F-E59C016EB47B.jpeg';
  readonly image5Filename = 'IMG_4772.JPG';
  readonly image6Filename = 'IMG_4769.JPG';
  readonly image7Filename = 'IMG_4557.jpeg';

  image1: string = '';
  image2: string = '';
  image3: string = '';
  image4: string = '';
  image5: string = '';
  image6: string = '';
  image7: string = '';
  // Alle Bilder für Modal
  blogImages: { filename: string; comment?: string; type: 'image' | 'video' }[] = [];

  constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService, private renderer: Renderer2) {
    this.image1 = this.imagesService.getCdnSmallUrl(this.image1Filename);
    this.image2 = this.imagesService.getCdnSmallUrl(this.image2Filename);
    this.image3 = this.imagesService.getCdnSmallUrl(this.image3Filename);
    this.image4 = this.imagesService.getCdnSmallUrl(this.image4Filename);
    this.image5 = this.imagesService.getCdnSmallUrl(this.image5Filename);
    this.image6 = this.imagesService.getCdnSmallUrl(this.image6Filename);
    this.image7 = this.imagesService.getCdnSmallUrl(this.image7Filename);

    // Definiere alle Bilder für das Modal
    this.blogImages = [
      { filename: this.image1Filename, type: 'image', comment: this.imagesService.getComment(this.image1Filename) },
      { filename: this.image2Filename, type: 'image', comment: this.imagesService.getComment(this.image2Filename) },
      { filename: this.image3Filename, type: 'image', comment: this.imagesService.getComment(this.image3Filename) },
      { filename: this.image4Filename, type: 'image', comment: this.imagesService.getComment(this.image4Filename) },
      { filename: this.image5Filename, type: 'image', comment: this.imagesService.getComment(this.image5Filename) },
      { filename: this.image6Filename, type: 'image', comment: this.imagesService.getComment(this.image6Filename) },
      { filename: this.image7Filename, type: 'image', comment: this.imagesService.getComment(this.image7Filename) }
    ];
  }

  ngAfterViewInit(): void {
    const refs = document.querySelectorAll('.bible-ref');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(hover: none)').matches);

    refs.forEach((refEl) => {
      const ref = refEl as HTMLElement;
      const tooltip = ref.querySelector('.bible-tooltip') as HTMLElement | null;
      if (!tooltip) return;

      // Move tooltip to body to avoid being clipped by overflow:hidden parents
      if (tooltip.parentElement !== document.body) {
        document.body.appendChild(tooltip);
        // ensure the tooltip uses fixed positioning for viewport-based placement
        tooltip.style.position = 'fixed';
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
      }

      let touchOpen = false;

      const showTooltip = () => {
        // make tooltip visible for measurement
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';

        const tooltipRect = tooltip.getBoundingClientRect();
        const refRect = ref.getBoundingClientRect();

        // prefer above the reference
        let top = refRect.top - tooltipRect.height - 12;
        let placeBelow = false;
        if (top < 8) {
          top = refRect.bottom + 12;
          placeBelow = true;
        }

        // center horizontally over the reference
        let left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
        const minLeft = 8;
        const maxLeft = window.innerWidth - tooltipRect.width - 8;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // compute arrow position relative to tooltip left
        const arrowLeft = Math.max(12, Math.min(refRect.left + refRect.width / 2 - left, tooltipRect.width - 20));
        tooltip.style.setProperty('--arrow-left', `${Math.round(arrowLeft)}px`);

        // apply position
        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.style.transform = 'translateY(0)';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'auto';

        // if placed below, flip the arrow
        if (placeBelow) {
          tooltip.setAttribute('data-placement', 'bottom');
        } else {
          tooltip.setAttribute('data-placement', 'top');
        }
      };

      const hideTooltip = () => {
        tooltip.style.opacity = '0';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.visibility = 'hidden';
        tooltip.removeAttribute('data-placement');
        touchOpen = false;
      };

      const toggleTooltip = (ev?: Event) => {
        ev && ev.stopPropagation();
        if (tooltip.style.opacity === '1') {
          hideTooltip();
        } else {
          showTooltip();
          touchOpen = true;
        }
      };

      ref.addEventListener('mouseenter', showTooltip);
      ref.addEventListener('focus', showTooltip);
      ref.addEventListener('mouseleave', hideTooltip);
      ref.addEventListener('blur', hideTooltip);

      // Touch / click behavior: toggle on tap for touch devices
      if (isTouchDevice) {
        ref.addEventListener('click', (ev) => toggleTooltip(ev));
        // close on any tap outside
        const outsideHandler = (ev: Event) => {
          const target = ev.target as Node | null;
          if (!target) return;
          if (tooltip.contains(target) || ref.contains(target)) return;
          hideTooltip();
        };
        document.addEventListener('click', outsideHandler);
        // remember to remove listeners if needed when component destroyed - omitted for brevity
      }

      // Recompute on resize and scroll
      const recompute = () => {
        if (tooltip.style.opacity === '1') showTooltip();
      };
      window.addEventListener('resize', recompute);
      window.addEventListener('scroll', recompute, true);
    });
  }

  // Öffne Modal mit den Blog-Bildern
  openBlogImageModal(index: number): void {
    const images = this.blogImages.map(img => ({
      filename: img.filename,
      comment: img.comment || '',
      type: img.type,
      url: this.imagesService.getCdnFullUrl(img.filename),
      poster: ''
    }));

    const detail = { sectionName: 'Dezember 2025', folderName: 'Blog', index, images };
    window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail }));
  }
}
