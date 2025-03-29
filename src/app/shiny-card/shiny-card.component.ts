import {Component, ElementRef, input, signal, viewChild} from '@angular/core';

@Component({
  selector: 'app-shiny-card',
  imports: [],
  templateUrl: './shiny-card.component.html',
  styleUrl: './shiny-card.component.css'
})
export class ShinyCardComponent {
  imgSrc = input("https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket/A1/A1_036_EN.webp");
  cardAlt = input("Charizard Card");
  imgEl = viewChild.required<ElementRef<HTMLDivElement>>('imageElement');
  transformCss = signal('rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)');
  shineBackgroundPositionCss = signal('');
  shineOpacityCss = signal('1');

  mouseMove(e: MouseEvent) {
    const card = this.imgEl();
    const rect = card.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 30; // -20 to 20 degrees
    const rotateX = ((y - centerY) / centerY) * -30; // 20 to -20 degrees

    // Apply transformation
    this.transformCss.set(`rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.05, 1.05, 1.05)`);

    // Update shine position
    this.shineBackgroundPositionCss.set(`${x / 5}% ${y / 5}%`);
    this.shineOpacityCss.set('1');
  }

  mouseLeave() {
    this.transformCss.set('rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)');
    this.shineOpacityCss.set('0');
  }
}
