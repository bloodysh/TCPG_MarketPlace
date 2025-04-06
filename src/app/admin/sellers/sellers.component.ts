import {Component, inject} from '@angular/core';
import {SellersService} from '@/app/services/sellers.service';
import {AsyncPipe} from '@angular/common';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {Seller} from '@/types/Seller';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-sellers',
  imports: [
    AsyncPipe,
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatSlideToggle,
    MatCardContent,
    MatIcon
  ],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.css'
})
export class SellersComponent {
  sellersService = inject(SellersService);
  sellers$ = this.sellersService.getSellers();

  async handleCertifiedClick(seller: Seller) {
    await this.sellersService.toggleSellerCertifiedStatus(seller);
  }
}
