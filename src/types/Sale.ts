import {DocumentReference} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Seller} from '@/types/Seller';

export interface Sale {
  fs_id: string;
  approved: boolean;
  buyer?: DocumentReference;
  card: string;
  description: string;
  price: number;
  seller: Observable<Seller>;
  created: Date;
}

export interface SaleInput {
  card: DocumentReference;
  description: string;
  price: number;
  seller: DocumentReference;
  created: Date;
}
