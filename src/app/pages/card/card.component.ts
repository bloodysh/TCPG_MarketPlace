import {Component, inject} from '@angular/core';
import {ShinyCardComponent} from '@/app/shiny-card/shiny-card.component';
import {ActivatedRoute} from '@angular/router';
import {Firestore, DocumentReference, doc, docData, query, collection, where, collectionData} from '@angular/fire/firestore';
import {Observable, switchMap, map} from 'rxjs';
import {Card} from '@/types/Card';
import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Sale} from '@/types/Sale';
import {Seller} from '@/types/Seller';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

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
    MatGridList,
    MatGridTile
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private readonly route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  card$ = this.route.paramMap.pipe(switchMap((params) => {
    const selectedCard = params.get('cardId')!;
    const cardDocument = doc(this.firestore, `AllCards/${selectedCard}`);
    return docData(cardDocument, {idField: 'fs_id'}) as Observable<Card | undefined>;
  }));

  sales$ = this.card$.pipe<Sale[]>(switchMap((card) => {
    if (!card) return [[]];
    const salesCollection = collection(this.firestore, 'Sales');
    const cardRef = doc(this.firestore, `AllCards/${card.fs_id}`);
    const salesQuery = query(
      salesCollection,
      where('card', '==', cardRef)
    );
    return collectionData(salesQuery, {idField: 'fs_id'}).pipe(map((data) => {
      return data.map<Sale>((sale) => ({
        ...(sale as Omit<Sale, 'seller'>),
        seller: docData<Seller>(sale['seller'] as DocumentReference<Seller>, {idField: 'fs_id'}) as Observable<Seller>
      }));
    }));
  }));

  getSellerProfile(sellerReference: DocumentReference) {
    return docData(sellerReference, {idField: 'fs_id'});
  }
}
