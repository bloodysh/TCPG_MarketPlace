import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  constructor(private router: Router) { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.setupCardEffect();
  }
  
  setupCardEffect(): void {
    const card = document.getElementById('card1');
    
    if (!card) return;
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 30; // -20 to 20 degrees
      const rotateX = ((y - centerY) / centerY) * -30; // 20 to -20 degrees
      
      // Apply transformation
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // Update shine position
      const shine = card.querySelector('.card-shine') as HTMLElement;
      if (shine) {
        shine.style.backgroundPosition = `${x / 5}% ${y / 5}%`;
        shine.style.opacity = '1';
      }
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
      
      const shine = card.querySelector('.card-shine') as HTMLElement;
      if (shine) {
        shine.style.opacity = '0';
      }
    });
  }
  
  navigateToExpansion(expansion: string): void {
    this.router.navigate(['/cards/', expansion]);
  }
}