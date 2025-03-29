import {Component, inject, Input} from '@angular/core';
import {Card} from '@/types/Card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Observable} from 'rxjs';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {UserCollectionService} from '../user-collection.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cards-grid',
  imports: [
    MatGridList,
    MatGridTile,
    AsyncPipe,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.css'
})
export class CardsGridComponent {
  @Input() cards$!: Observable<Card[]>;

  private collectionService = inject(UserCollectionService);  // Inject the service
  private auth = inject(Auth);

  isLoggedIn = false;
  notification = {show: false, message: '', success: false, timer: null as any};

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }

  addToCollection(card: Card) {
    if (this.isLoggedIn) {
      this.collectionService.addCardToUserCollection(card);
      this.showNotify(`Added ${card.name} to your collection!`, true);
    } else {
      console.log('User not logged in');
    }
  }
  showNotify(message: string, success: boolean) {
    this.notification = {show: true, message, success, timer: setTimeout(() => this.notification = {show: false, message: '', success: false, timer: null}, 3000)};
  }

  async removeFromCollection(cardId: string) {
    if (!this.isLoggedIn) return;

    const result = await this.collectionService.removeFromCollection(cardId)
      .catch(err => console.error('Error:', err));

    if (result) console.log('Card removed successfully');
  }


}
