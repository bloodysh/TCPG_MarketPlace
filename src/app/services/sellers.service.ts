import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Seller} from '@/types/Seller';

@Injectable({
  providedIn: 'root'
})
export class SellersService {
  private firestore = inject(Firestore);

  createSellersObservable() {
    return collectionData(
      collection(this.firestore, 'Sellers'),
      {idField: 'fs_id'}
    ) as Observable<Seller[]>
  };

  private sellers$ = this.createSellersObservable();

  getSellers() {
    return this.sellers$;
  }

  async toggleSellerCertifiedStatus(seller: Seller) {
    const sellerDoc = doc(this.firestore, `Sellers/${seller.fs_id}`);
    await setDoc(sellerDoc, {certified: !seller.certified}, {merge: true});
  }
}
