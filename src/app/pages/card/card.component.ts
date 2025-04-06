import {Component, inject} from '@angular/core';
import {ShinyCardComponent} from '@/app/shiny-card/shiny-card.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {CardService} from '@/app/services/card.service';
import {SalesService} from '@/app/services/sales.service';
import {SaleCardComponent} from '@/app/sale-card/sale-card.component';

@Component({
  selector: 'app-card',
  imports: [
    ShinyCardComponent,
    AsyncPipe,
    MatIcon,
    MatButton,
    MatAnchor,
    RouterLink,
    SaleCardComponent
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private readonly route = inject(ActivatedRoute);
  cardService = inject(CardService);
  salesService = inject(SalesService);

  card$ = this.route.paramMap.pipe(switchMap((params) => {
    const selectedCard = params.get('cardId')!;
    return this.cardService.getCard(selectedCard);
  }));

  sales$ = this.route.paramMap.pipe(switchMap((params) => {
    const selectedCard = params.get('cardId')!;
    return this.salesService.getSalesForCard(selectedCard);
  }));
}
