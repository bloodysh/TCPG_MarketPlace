import {Component, inject, signal} from '@angular/core';
import {SalesService} from '@/app/services/sales.service';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {SaleCardComponent} from '@/app/sale-card/sale-card.component';
import {Sale} from '@/types/Sale';

@Component({
  selector: 'app-pending-sales',
  imports: [
    AsyncPipe,
    MatButton,
    MatIcon,
    SaleCardComponent
  ],
  templateUrl: './pending-sales.component.html',
  styleUrl: './pending-sales.component.css'
})
export class PendingSalesComponent {
  salesService = inject(SalesService);

  pendingSales$ = this.salesService.getPendingSales();

  lockActions = signal(false);

  async setApprovedState(sale: Sale, approved: boolean) {
    this.lockActions.set(true);
    await this.salesService.setApprovedState(sale, approved);
    this.lockActions.set(false);
  }
}
