import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardsTableComponent } from "./cards-table/cards-table.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardsTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'TCPG_MarketPlace';
}
