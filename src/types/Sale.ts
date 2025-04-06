import {DocumentReference} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Seller} from '@/types/Seller';
import {Card} from '@/types/Card';

export interface Sale {
  fs_id: string;
  approved: boolean;
  buyer: null | {
    id: string;
    name: string;
    message: string;
  };
  card: Observable<Card>;
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
