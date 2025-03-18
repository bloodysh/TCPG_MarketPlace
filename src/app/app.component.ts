import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApexGenComponent } from "./Expansions/apex-gen/apex-gen.component";
import {LogInButtonComponent} from '@/app/log-in-button/log-in-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ApexGenComponent, LogInButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'TCPG_MarketPlace';
}
