import {inject, Injectable} from '@angular/core';
import {doc, docData, Firestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Card} from '@/types/Card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  firestore = inject(Firestore);

  getCard(cardId: string) {
    const cardDocument = doc(this.firestore, `AllCards/${cardId}`);
    return docData(cardDocument, {idField: 'fs_id'}) as Observable<Card | undefined>;
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
