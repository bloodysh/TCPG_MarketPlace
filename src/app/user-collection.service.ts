import { Card } from '@/types/Card';
import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { 
  Firestore, arrayRemove, arrayUnion, collection, 
  doc, getDoc, getDocs, query, setDoc, updateDoc, where
} from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCollectionService {
  // Core state
  public userCollection: string[] = [];
  public loading = true;
  public error: string | null = null;
  
  // Observable for collection changes
  private collectionSubject = new BehaviorSubject<string[]>([]);
  public collection$ = this.collectionSubject.asObservable();
  
  // Services
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private user: User | null = null;
  
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        this.loadUserCollection(user.uid);
      } else {
        this.userCollection = [];
        this.collectionSubject.next([]);
        this.loading = false;
        this.error = 'Please log in to view your collection';
      }
    });
  }
  
  // Add card to collection
  async addCardToUserCollection(card: Card): Promise<boolean> {
    if (!this.user) return false;
    
    try {
      const cardId = card.card_id;
      
      // Update local state
      if (!this.userCollection.includes(cardId)) {
        this.userCollection.push(cardId);
        this.collectionSubject.next([...this.userCollection]);
      }
      
      // Update Firestore
      const userDocRef = doc(this.firestore, 'userCollection', this.user.uid);
      const docSnapshot = await getDoc(userDocRef);
      
      if (docSnapshot.exists()) {
        await updateDoc(userDocRef, { collection: arrayUnion(cardId) });
      } else {
        await setDoc(userDocRef, {
          collection: [cardId],
          userId: this.user.uid,
          email: this.user.email
        });
      }
      
      return true;
    } catch (error) {
      // Revert local state on error
      const cardId = card.card_id;
      this.userCollection = this.userCollection.filter(id => id !== cardId);
      this.collectionSubject.next([...this.userCollection]);
      return false;
    }
  }
  
  // Remove card from collection
  async removeFromCollection(cardId: string): Promise<boolean> {
    if (!this.user) return false;
    
    try {
      // Update local state
      this.userCollection = this.userCollection.filter(id => id !== cardId);
      this.collectionSubject.next([...this.userCollection]);
      
      // Update Firestore
      const userDocRef = doc(this.firestore, 'userCollection', this.user.uid);
      await updateDoc(userDocRef, { collection: arrayRemove(cardId) });
      
      return true;
    } catch {
      return false;
    }
  }
  
  // Load user's collection
  async loadUserCollection(userId: string): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      const userDocRef = doc(this.firestore, 'userCollection', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.userCollection = userData['collection'] || [];
      } else {
        await setDoc(userDocRef, { 
          collection: [],
          userId,
          email: this.user?.email
        });
        this.userCollection = [];
      }
      
      this.collectionSubject.next([...this.userCollection]);
    } catch {
      this.error = 'Failed to load your collection';
    } finally {
      this.loading = false;
    }
  }

  // Get full card details from IDs
  async getCardsWithDetails(): Promise<Card[]> {
    if (!this.userCollection.length) return [];
    
    try {
      const cardsCollection = collection(this.firestore, 'AllCards');
      let allCards: Card[] = [];
      
      // Process in batches of 10 (Firestore limit)
      for (let i = 0; i < this.userCollection.length; i += 10) {
        const batch = this.userCollection.slice(i, i + 10);
        const q = query(cardsCollection, where('card_id', 'in', batch));
        const snapshot = await getDocs(q);
        
        const batchResults = snapshot.docs.map(doc => 
          ({ ...doc.data(), document_id: doc.id }) as unknown as Card
        );
        
        allCards = [...allCards, ...batchResults];
      }
      
      return allCards;
    } catch {
      return [];
    }
  }
  
  // Observable for card details
  getCardsWithDetails$(): Observable<Card[]> {
    return this.collection$.pipe(
      switchMap(ids => ids.length ? from(this.getCardsWithDetails()) : of([]))
    );
  }
  
  // Utility methods
  isInCollection(cardId: string): boolean {
    return this.userCollection.includes(cardId);
  }
  
  isLoggedIn(): boolean {
    return !!this.user;
  }
}