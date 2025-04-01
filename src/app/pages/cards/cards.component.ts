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

  constructor() {
    this.cards$ = this.route.paramMap.pipe(switchMap((params) => {
      this.selectedCardSet = params.get('setId')!;
      const cardsCollection = collection(this.firestore, 'AllCards');
      const cardsQuery = query(
        cardsCollection,
        where('expansion', '==', this.selectedCardSet),
        orderBy("order")
      );
      return collectionData(cardsQuery, {idField: 'fs_id'}) as Observable<Card[]>;
    }));
  }
}
