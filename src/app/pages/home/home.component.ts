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
export class HomeComponent implements OnInit {
  router = inject(Router);
  notification = {show: false, message: '', success: false, timer: null as any};

  navigateToExpansion(expansion: string): void {
    this.router.navigate(['/cards/', expansion]);
  }

  ngOnInit() {
    // Check if we need to show login success message
    if (sessionStorage.getItem('showLoginSuccess')) {
      // Show notification however you prefer
      this.showNotification('Successfully signed in!', true);
      
      // Remove the flag so it doesn't show again on refresh
      sessionStorage.removeItem('showLoginSuccess');
    }
  }
  
  // Your existing or new notification method
  showNotification(message: string, success: boolean) {
    // Use your preferred notification system here
    this.notification = {
      show: true, 
      message, 
      success, 
      timer: setTimeout(() => {
        this.notification = {show: false, message: '', success: false, timer: null}
      }, 3000)
    };
  }
}
