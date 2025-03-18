import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Card} from '@/types/Card';
import {Observable, switchMap} from 'rxjs';
import {CardsGridComponent} from '@/app/cards-grid/cards-grid.component';

@Component({
  selector: 'app-cards',
  imports: [
    CardsGridComponent
  ],
  template: '<app-cards-grid [cards$]="cards$"></app-cards-grid>'
})
export class CardsComponent {
  private readonly route = inject(ActivatedRoute);

  selectedCardSet: string = '';
  cards$: Observable<Card[]>;

  constructor() {
    this.cards$ = this.route.paramMap.pipe(switchMap((params) => {
      this.selectedCardSet = params.get('setId')!;
      return [];
    }));
  }
}
