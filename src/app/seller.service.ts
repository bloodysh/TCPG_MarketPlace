import {inject, Injectable} from '@angular/core';
import {docData, Firestore, doc, setDoc} from '@angular/fire/firestore';
import {Auth, User, user} from '@angular/fire/auth';
import {Observable, switchMap} from 'rxjs';
import {Seller} from '@/types/Seller';
@Injectable({
  providedIn: 'root'
})
export class SellerService {
  auth = inject(Auth);
  firestore = inject(Firestore);
  user$ = user(this.auth);
  seller$ = this.user$.pipe(switchMap((user) => {
    if (!user) return [null];
    const sellerDoc = doc(this.firestore, `Sellers/${user.uid}`);
    return docData(sellerDoc) as Observable<Seller | null>;
  }));
  private user: User | null = null;

  constructor() {
    this.user$.subscribe((user) => {
      this.user = user;
    })
  }

  getSellerProfile() {
    return this.seller$;
  }

  async upsertSellerProfile(name: string) {
    if (!this.user) return;
    const sellerDoc = doc(this.firestore, `Sellers/${this.user.uid}`);
    await setDoc(sellerDoc, {name, uid: this.user.uid}, {merge: true});
    return sellerDoc;
  }
}
