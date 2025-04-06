import {Component, inject, Input, OnInit} from '@angular/core';
import {Card} from '@/types/Card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Observable} from 'rxjs';
import {AsyncPipe, CommonModule, NgOptimizedImage} from '@angular/common';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {UserCollectionService} from '../services/user-collection.service';
import {RouterLink} from '@angular/router';
import { CardService } from '../services/card.service';
import { MatIconModule } from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-cards-grid',
  imports: [
    MatGridList,
    MatGridTile,
    MatIconModule,
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    CommonModule,
    MatButton
  ],
  templateUrl: './cards-grid.component.html',
  styleUrl: './cards-grid.component.css'
})
export class CardsGridComponent implements OnInit{
  @Input() cards$!: Observable<Card[]>;

  private cardService = inject(CardService);
  private collectionService = inject(UserCollectionService);  // Inject the service
  private auth = inject(Auth);

  displayCards$!: Observable<Card[]> ;
  selectedRarity: string | null = null;
  cardSet: string = '';
  raritySymbols = ['◊', '◊◊', '◊◊◊', '◊◊◊◊', '☆', '☆☆', '☆☆☆', 'Crown Rare'];

  isLoggedIn = false;
  notification = {show: false, message: '', success: false, timer: null as any};

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    this.displayCards$ = this.cards$;

    this.cards$.subscribe(cards => {
      if (cards.length > 0) {
        this.cardSet = this.getCardExpansion(cards[0]);
      }
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

  filterByRarity(rarity: string) {
    this.selectedRarity = rarity;
    this.displayCards$ = this.cardService.getCardsByRarity(rarity, this.cardSet);
    this.showNotify(`Showing ${rarity} cards`, true);
  }

  clearFilter() {
    this.selectedRarity = null;
    this.displayCards$ = this.cards$;
    this.showNotify('Showing all cards', true);
  }

  getCardExpansion(card: Card): string {
    return card.expansion || 'Unknown Expansion';
  }
}
