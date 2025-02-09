import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
interface ImageItem {
  image: string;
}
@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {
  @Input() images: ImageItem[] = [];
  @Input() width: number | string = 50;
  @Input() height: number | string = 50;
  @Input() alt: string = '';

  isFullscreen = false;
  currentIndex = 0;

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      setTimeout(() => {
        const overlay = document.querySelector('.fullscreen-overlay') as HTMLElement;
        if (overlay) {
          overlay.focus();
        }
      });
    }
    this.currentIndex = 0;
  }

  previousImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  setCurrentImage(index: number): void {
    this.currentIndex = index;
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'Escape':
        this.toggleFullscreen();
        break;
    }
  }

}
