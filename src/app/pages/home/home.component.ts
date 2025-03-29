import { CommonModule } from '@angular/common';
import {Component, OnInit, AfterViewInit, inject} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {ShinyCardComponent} from '@/app/shiny-card/shiny-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ShinyCardComponent
  ],
})
export class HomeComponent {
  router = inject(Router);

  navigateToExpansion(expansion: string): void {
    this.router.navigate(['/cards/', expansion]);
  }
}
