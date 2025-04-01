import {Component, inject} from '@angular/core';
import {ShinyCardComponent} from '@/app/shiny-card/shiny-card.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {CardService} from '@/app/card.service';
import {SalesService} from '@/app/sales.service';

@Component({
  selector: 'app-card',
  imports: [
    ShinyCardComponent,
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    CurrencyPipe,
    MatButton,
    MatAnchor,
    RouterLink
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
