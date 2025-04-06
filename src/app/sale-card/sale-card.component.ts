import {Component, input} from '@angular/core';
import {AsyncPipe, CurrencyPipe} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {Sale} from '@/types/Sale';

@Component({
  selector: 'app-sale-card',
  imports: [
    CurrencyPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    AsyncPipe
  ],
  templateUrl: './sale-card.component.html',
  styleUrl: './sale-card.component.css'
})
export class SaleCardComponent {
  saleInput = input.required<Sale>();
}
