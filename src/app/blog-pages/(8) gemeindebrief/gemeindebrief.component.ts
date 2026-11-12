import { AfterViewInit, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-gemeindebrief',
  templateUrl: './gemeindebrief.component.html',
  styleUrls: ['../blog-pages.css']
})
export class GemeindebriefComponent implements AfterViewInit {

    readonly image1Filename = '9C3EC1A0-F138-46A3-BC42-6CEB0F9457BF_1_105_c.jpeg';
    readonly image2Filename = 'dji_fly_20260529_064922_0231_1780076354540_photo_beautify.jpg';
    readonly image3Filename = 'IMG_5030.JPG';
    readonly image4Filename = 'IMG_0648.jpeg';
    readonly image5Filename = '358BE6F2-359B-4B0E-AF0D-95104932F9D9_1_105_c.jpeg';
    readonly image6Filename = 'IMG_4297.JPG';
    readonly image7Filename = 'IMG_4773.JPG';
  
    image1: string = '';
    image2: string = '';
    image3: string = '';
    image4: string = '';
    image5: string = '';
    image6: string = '';
    image7: string = '';
    blogImages: { filename: string; comment?: string; type: 'image' | 'video' }[] = [];
  
    constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService) {
      this.image1 = this.imagesService.getCdnSmallUrl(this.image1Filename);
      this.image2 = this.imagesService.getCdnSmallUrl(this.image2Filename);
      this.image3 = this.imagesService.getCdnSmallUrl(this.image3Filename);
      this.image4 = this.imagesService.getCdnSmallUrl(this.image4Filename);
      this.image5 = this.imagesService.getCdnSmallUrl(this.image5Filename);
      this.image6 = this.imagesService.getCdnSmallUrl(this.image6Filename);
      this.image7 = this.imagesService.getCdnSmallUrl(this.image7Filename);

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
  
        if (tooltip.parentElement !== document.body) {
          document.body.appendChild(tooltip);
          tooltip.style.position = 'fixed';
          tooltip.style.opacity = '0';
          tooltip.style.pointerEvents = 'none';
          tooltip.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
        }
  
        let touchOpen = false;
  
        const showTooltip = () => {
          tooltip.style.visibility = 'hidden';
          tooltip.style.display = 'block';
  
          const tooltipRect = tooltip.getBoundingClientRect();
          const refRect = ref.getBoundingClientRect();
  
          let top = refRect.top - tooltipRect.height - 12;
          let placeBelow = false;
          if (top < 8) {
            top = refRect.bottom + 12;
            placeBelow = true;
          }
  
          let left = refRect.left + refRect.width / 2 - tooltipRect.width / 2;
          const minLeft = 8;
          const maxLeft = window.innerWidth - tooltipRect.width - 8;
          if (left < minLeft) left = minLeft;
          if (left > maxLeft) left = maxLeft;
  
          const arrowLeft = Math.max(12, Math.min(refRect.left + refRect.width / 2 - left, tooltipRect.width - 20));
          tooltip.style.setProperty('--arrow-left', `${Math.round(arrowLeft)}px`);
  
          tooltip.style.left = `${Math.round(left)}px`;
          tooltip.style.top = `${Math.round(top)}px`;
          tooltip.style.transform = 'translateY(0)';
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.style.pointerEvents = 'auto';
  
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
  
        if (isTouchDevice) {
          ref.addEventListener('click', (ev) => toggleTooltip(ev));
          const outsideHandler = (ev: Event) => {
            const target = ev.target as Node | null;
            if (!target) return;
            if (tooltip.contains(target) || ref.contains(target)) return;
            hideTooltip();
          };
          document.addEventListener('click', outsideHandler);
        }
  
        const recompute = () => {
          if (tooltip.style.opacity === '1') showTooltip();
        };
        window.addEventListener('resize', recompute);
        window.addEventListener('scroll', recompute, true);
      });
    }
  
    openBlogImageModal(index: number): void {
      const images = this.blogImages.map(img => ({
        filename: img.filename,
        comment: img.comment || '',
        type: img.type,
        url: this.imagesService.getCdnFullUrl(img.filename),
        poster: ''
      }));
  
      const detail = { sectionName: 'Juni/Juli 2026', folderName: 'Blog', index, images };
      window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail }));
    }
  }