import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Card} from '@/types/Card';
import {Observable, switchMap} from 'rxjs';
import {CardsGridComponent} from '@/app/cards-grid/cards-grid.component';
import {Firestore, collection, query, where, orderBy, collectionData} from '@angular/fire/firestore';

@Component({
  selector: 'app-cards',
  imports: [
    CardsGridComponent
  ],
  template: '<app-cards-grid [cards$]="cards$"></app-cards-grid>'
})
export class CardsComponent {
  private readonly route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  selectedCardSet: string = '';
  cards$: Observable<Card[]>;

  private price : number = 0;

  constructor() {
    this.cards$ = this.route.paramMap.pipe(switchMap((params) => {
      this.selectedCardSet = params.get('setId')!;
      const cardsCollection = collection(this.firestore, 'AllCards');
      const cardsQuery = query(
        cardsCollection,
        where('expansion', '==', this.selectedCardSet),
        orderBy("order")
      );
      return collectionData(cardsQuery) as Observable<Card[]>;
    }));
  }

  getPrice(card: Card) {
    switch (card.rarity) {
      case '◊': this.price = 0.3; break;
      case '◊◊': this.price = 0.5; break;
      case '◊◊◊': this.price = 0.8; break;
      case '◊◊◊◊': this.price = 1.5; break;
      case '☆': this.price = 5; break;
      case '☆☆': this.price = 10; break;
      case '☆☆☆': this.price = 15; break;
      case '♛': this.price = 50; break;
      default: this.price = 0;
  }
  return this.price;
}}