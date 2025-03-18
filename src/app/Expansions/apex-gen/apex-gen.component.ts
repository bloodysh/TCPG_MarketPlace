import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a1Cards$, fetchAllCards } from '@/CardExtraction';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apex-gen',
  imports: [CommonModule],
  templateUrl: './apex-gen.component.html',
  styleUrl: './apex-gen.component.css',
  standalone: true
})
export class ApexGenComponent implements OnInit, OnDestroy {
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Fixed: changed from @Input to @Output

  groupedCards: Map<string, CardType[]> = new Map();
  loading: boolean = true;
  error: string | null = null;
  
  private cardsSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    // If cards are provided as input, use those
    if (this.cards.length > 0) {
      this.organizeCards();
      this.loading = false;
      return;
    }
    
    // Otherwise subscribe to the Firestore observable
    console.log('Subscribing to a1Cards$ observable...');
    this.loading = true;
    
    this.cardsSubscription = a1Cards$.subscribe({
      next: (cards) => {
        console.log(`Received ${cards.length} cards from a1Cards$ observable`);
        this.cards = cards;
        this.organizeCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching A1 cards:', err);
        this.error = 'Failed to load cards. Please try again later.';
        this.loading = false;
      }
    });
    
    // If we don't have cards yet, trigger a fetch
    if (a1Cards$.getValue().length === 0) {
      console.log('No cards in observable yet, triggering fetch...');
      fetchAllCards().catch(err => {
        console.error('Failed to fetch cards:', err);
        this.error = 'Failed to load cards. Please try again later.';
        this.loading = false;
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
  }

  organizeCards(): void {
    console.log(`Organizing ${this.cards.length} cards`);
    // Group cards by set_details
    this.groupedCards = new Map<string, CardType[]>();
    
    this.cards.forEach(card => {
      const setName = card.set_details || 'Unknown Set'; // Added fallback for null/undefined
      if (!this.groupedCards.has(setName)) {
        this.groupedCards.set(setName, []);
      }
      this.groupedCards.get(setName)?.push(card);
    });
    
    console.log(`Organized into ${this.groupedCards.size} sets`);
  }

  // Method to handle card clicks
  onCardClick(cardId: string): void {
    console.log(`Card clicked: ${cardId}`);
    this.cardClick.emit(cardId);
  }
  
  // Helper method to get array of set names for template iteration
  getSetNames(): string[] {
    return Array.from(this.groupedCards.keys());
  }
}