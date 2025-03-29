import {Component, inject, Input} from '@angular/core';
import {Card} from '@/types/Card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Observable} from 'rxjs';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {UserCollectionService} from '../user-collection.service';

@Component({
  selector: 'app-cards-grid',
  standalone: true, // Add if it's a standalone component
  imports: [
    MatGridList,
    MatGridTile,
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.css'
})
export class CardsGridComponent {
  @Input() cards$!: Observable<Card[]>;

  private collectionService = inject(UserCollectionService);  // Inject the service
  private auth = inject(Auth);

  isLoggedIn = false;
  
  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }
  
  addToCollection(card: Card) {
    if (this.isLoggedIn) {
      this.collectionService.addCardToUserCollection(card);
    } else {
      console.log('User not logged in');
    }
  }

  async removeFromCollection(cardId: string) {
    if (!this.isLoggedIn) return;
    
    const result = await this.collectionService.removeFromCollection(cardId)
      .catch(err => console.error('Error:', err));
      
    if (result) console.log('Card removed successfully');
  }
}