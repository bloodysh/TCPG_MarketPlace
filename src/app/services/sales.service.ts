import {inject, Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  DocumentReference,
  Firestore,
  query,
  where,
  addDoc,
  setDoc
} from '@angular/fire/firestore';
import {map, Observable} from 'rxjs';
import {Sale, SaleInput} from '@/types/Sale';
import {Seller} from '@/types/Seller';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  firestore = inject(Firestore);

  getSalesForCard(cardId: string) {
    const salesCollection = collection(this.firestore, 'Sales');
    const cardRef = doc(this.firestore, `AllCards/${cardId}`);
    const salesQuery = query(
      salesCollection,
      where('card', '==', cardRef),
      where('approved', '==', true)
    );
    return collectionData(salesQuery, {idField: 'fs_id'}).pipe(map((data) => {
      return data.map<Sale>((sale) => ({
        ...(sale as Omit<Sale, 'seller'>),
        seller: docData<Seller>(sale['seller'] as DocumentReference<Seller>, {idField: 'fs_id'}) as Observable<Seller>
      }));
    }));
  }

  async createSale(sale: SaleInput) {
    await addDoc(collection(this.firestore, 'Sales'), {
      ...sale,
      buyer: null,
      approved: null,
    });
  }

  getPendingSales() {
    const salesCollection = collection(this.firestore, 'Sales')
    const salesQuery = query(
      salesCollection,
      where('approved', '==', null)
    );
    return collectionData(salesQuery, {idField: 'fs_id'}).pipe(map((data) => {
      return data.map<Sale>((sale) => ({
        ...(sale as Omit<Sale, 'seller'>),
        seller: docData<Seller>(sale['seller'] as DocumentReference<Seller>, {idField: 'fs_id'}) as Observable<Seller>
      }));
    }));
  }

  async setApprovedState(sale: Sale, approved: boolean) {
    const saleDoc = doc(this.firestore, `Sales/${sale.fs_id}`);
    await setDoc(saleDoc, {approved}, {merge: true});
  }
}
