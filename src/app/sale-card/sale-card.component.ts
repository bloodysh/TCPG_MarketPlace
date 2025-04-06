import {Component, input} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgOptimizedImage} from "@angular/common";
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
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './sale-card.component.html',
  styleUrl: './sale-card.component.css'
})
export class SaleCardComponent {
  showCard = input(false);
  saleInput = input.required<Sale>();
}
