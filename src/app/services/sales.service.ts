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
  setDoc,
  orderBy,
  limit,
  Query
} from '@angular/fire/firestore';
import {map, Observable} from 'rxjs';
import {Sale, SaleInput} from '@/types/Sale';
import {Seller} from '@/types/Seller';
import {Auth} from '@angular/fire/auth';
import {Card} from '@/types/Card';
import {SellerService} from '@/app/services/seller.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  firestore = inject(Firestore);
  auth = inject(Auth);
  sellerService = inject(SellerService);
  seller: Seller | null = null;

  constructor() {
    this.sellerService.getSellerProfile().subscribe((seller) => {
      this.seller = seller;
    });
  }

  private dataFromQuery(query: Query) {
    return collectionData(query, {idField: 'fs_id'}).pipe(map((data) => {
      return data.map<Sale>((sale) => ({
        ...(sale as Omit<Sale, 'seller'>),
        seller: docData<Seller>(sale['seller'] as DocumentReference<Seller>, {idField: 'fs_id'}) as Observable<Seller>,
        card: docData<Card>(sale['card'] as DocumentReference<Card>, {idField: 'fs_id'}) as Observable<Card>
      }));
    }));
  }

  getSales() {
    const salesCollection = collection(this.firestore, 'Sales');
    const salesQuery = query(
      salesCollection,
      where('buyer', '==', null),
      where('approved', '==', true),
      orderBy('created', 'desc'),
      limit(100)
    );
    return this.dataFromQuery(salesQuery);
  }

  getMySales() {
    if (!this.seller) return;
    const salesCollection = collection(this.firestore, 'Sales');
    const salesQuery = query(
      salesCollection,
      where('seller', '==', doc(this.firestore, `Sellers/${this.seller.fs_id}`)),
      orderBy('created', 'desc'),
      limit(100)
    );
    return this.dataFromQuery(salesQuery);
  }

  getSalesForCard(cardId: string) {
    const salesCollection = collection(this.firestore, 'Sales');
    const cardRef = doc(this.firestore, `AllCards/${cardId}`);
    const salesQuery = query(
      salesCollection,
      where('card', '==', cardRef),
      where('buyer', '==', null),
      where('approved', '==', true)
    );
    return this.dataFromQuery(salesQuery);
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
    return this.dataFromQuery(salesQuery);
  }

  async setApprovedState(sale: Sale, approved: boolean) {
    const saleDoc = doc(this.firestore, `Sales/${sale.fs_id}`);
    await setDoc(saleDoc, {approved}, {merge: true});
  }

  async buySale(sale: Sale, message: string) {
    if (!this.auth.currentUser) return;
    const saleDoc = doc(this.firestore, `Sales/${sale.fs_id}`);
    await setDoc(saleDoc, {
      buyer: {
        id: this.auth.currentUser!.uid,
        name: this.auth.currentUser!.displayName || this.auth.currentUser!.email,
        message
      }
    }, {merge: true});
  }
}
