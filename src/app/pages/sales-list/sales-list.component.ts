import {Component, inject} from '@angular/core';
import {SalesService} from '@/app/services/sales.service';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SaleCardComponent} from '@/app/sale-card/sale-card.component';
import {Card} from '@/types/Card';
import {Sale} from '@/types/Sale';
import {BuyDialogComponent} from '@/app/buy-dialog/buy-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-sales-list',
  imports: [
    AsyncPipe,
    MatButton,
    MatIcon,
    SaleCardComponent,
  ],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css'
})
export class SalesListComponent {
  salesService = inject(SalesService);
  dialog = inject(MatDialog);

  sales$ = this.salesService.getSales();

  openBuyDialog(card: Card, sale: Sale) {
    this.dialog.open(BuyDialogComponent, {
      data: { card, sale }
    });
  }
}
