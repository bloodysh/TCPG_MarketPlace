import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, docData, Firestore, limit, orderBy, query, where} from '@angular/fire/firestore';
import {Observable, of, switchMap} from 'rxjs';
import {Card} from '@/types/Card';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  firestore = inject(Firestore);
  private readonly route = inject(ActivatedRoute);

  selectedCardSet: string = '';
  cards$!: Observable<Card[]>;

  getCard(cardId: string) {
    const cardDocument = doc(this.firestore, `AllCards/${cardId}`);
    return docData(cardDocument, {idField: 'fs_id'}) as Observable<Card | undefined>;
  }

  getCardsBySet(cardSet: string) {
    // Set this immediately when the method is called
    this.selectedCardSet = cardSet;
    console.log('Selected card set:', this.selectedCardSet);
    
    this.cards$ = this.route.paramMap.pipe(
      switchMap((params) => {
        // Get from param or use provided cardSet
        const setId = params.get('setId') || cardSet;
        // Update to ensure it's always current
        this.selectedCardSet = setId;
        
        const cardsCollection = collection(this.firestore, 'AllCards');
        const cardsQuery = query(
          cardsCollection,
          where('expansion', '==', setId),
          orderBy("order")
        );
        return collectionData(cardsQuery, {idField: 'fs_id'}) as Observable<Card[]>;
      })
    );
    
    return this.cards$;
  }

  getCardsByRarity(rarity: string, cardSet?: string): Observable<Card[]> {
    const setId = cardSet || this.selectedCardSet;
    console.log('Selected card set for rarity:', setId);
    // Handle case where no set is selected
    if (!setId) {
      console.warn('No card set selected for filtering by rarity');
      return of([]);
    }
    
    const cardsCollection = collection(this.firestore, 'AllCards');
    const cardsQuery = query(
      cardsCollection,
      where('rarity', '==', rarity),
      where('expansion', '==', setId),
      orderBy("order")
    );
    console.log('Cards by rarity:', rarity, 'in set:', setId);
    console.log('Set', this.selectedCardSet);
    
    return collectionData(cardsQuery, {idField: 'fs_id'}) as Observable<Card[]>;
  }

  getCardPrice(card: Card) {
    switch (card.rarity) {
      case '◊': return 0.3;
      case '◊◊': return 0.5;
      case '◊◊◊': return 0.8;
      case '◊◊◊◊': return 1.5;
      case '☆': return 5;
      case '☆☆': return 10;
      case '☆☆☆': return 15;
      case 'Crown Rare':
      case '♛': return 50;
      default: return 0;
    }
  }

}
