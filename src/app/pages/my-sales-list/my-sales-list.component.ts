import {Component, inject} from '@angular/core';
import {SalesService} from '@/app/services/sales.service';
import {AsyncPipe} from '@angular/common';
import {SaleCardComponent} from '@/app/sale-card/sale-card.component';

@Component({
  selector: 'app-my-sales-list',
  imports: [
    AsyncPipe,
    SaleCardComponent
  ],
  templateUrl: './my-sales-list.component.html',
  styleUrl: './my-sales-list.component.css'
})
export class MySalesListComponent {
  salesService = inject(SalesService);

  sales$ = this.salesService.getMySales();
}
