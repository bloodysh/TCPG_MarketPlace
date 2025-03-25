import { Component } from '@angular/core';
import {MainNavigationComponent} from '@/app/main-navigation/main-navigation.component';

@Component({
  selector: 'app-root',
  imports: [MainNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'TCPG_MarketPlace';
}
