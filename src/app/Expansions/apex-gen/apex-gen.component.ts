import { Card as CardType } from '@/types/Card';
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
  @Output() cardClick = new EventEmitter<string>();

  groupedCards: Map<string, CardType[]> = new Map();
  loading: boolean = true;
  error: string | null = null;
  debugInfo: string = "";
  
  private cardsSubscription?: Subscription;

  constructor() {
    console.log('ApexGenComponent constructor initialized');
  }

  ngOnInit(): void {
    console.log('ApexGenComponent ngOnInit started');
    
    // If cards are provided as input, use those
    if (this.cards && this.cards.length > 0) {
      console.log(`Using ${this.cards.length} cards provided as input`);
      this.organizeCards();
      this.loading = false;
      return;
    }
    
    // Otherwise subscribe to the Firestore observable
    console.log('No input cards, subscribing to a1Cards$ observable...');
    this.loading = true;
    
    // Check if the observable has an initial value
    const initialValue = a1Cards$.getValue();
    console.log(`Initial BehaviorSubject value: ${initialValue.length} cards`);
    
    // Subscribe to updates
    this.cardsSubscription = a1Cards$.subscribe({
      next: (cards) => {
        console.log(`Received ${cards.length} cards from a1Cards$ observable`);
        
        if (cards.length > 0) {
          console.log(`Sample card: ${JSON.stringify(cards[0])}`);
        }
        
        this.cards = cards;
        this.organizeCards();
        this.loading = false;
        
        // Add debug info
        this.debugInfo = `Last updated: ${new Date().toLocaleTimeString()}. Total cards: ${cards.length}`;
      },
      error: (err) => {
        console.error('Error fetching A1 cards:', err);
        this.error = 'Failed to load cards. Please try again later.';
        this.loading = false;
      }
    });
    
    // If we don't have cards yet, trigger a fetch
    if (initialValue.length === 0) {
      console.log('No cards in observable yet, triggering fetch...');
      this.triggerFetch();
    }
    
    console.log('ApexGenComponent ngOnInit completed');
  }

  ngOnDestroy(): void {
    console.log('ApexGenComponent being destroyed, cleaning up subscription');
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
  }

  organizeCards(): void {
    console.log(`Organizing ${this.cards?.length || 0} cards`);
    
    // Safety check
    if (!this.cards || this.cards.length === 0) {
      console.warn('No cards to organize');
      return;
    }
    
    // Group cards by set_details
    this.groupedCards = new Map<string, CardType[]>();
    
    this.cards.forEach(card => {
      if (!card) {
        console.warn('Found null or undefined card');
        return;
      }
      
      const setName = card.set_details || 'Unknown Set';
      
      if (!this.groupedCards.has(setName)) {
        this.groupedCards.set(setName, []);
      }
      
      this.groupedCards.get(setName)?.push(card);
    });
    
    console.log(`Organized into ${this.groupedCards.size} sets:`);
    for (const [setName, cards] of this.groupedCards.entries()) {
      console.log(`- ${setName}: ${cards.length} cards`);
    }
  }

  // Method to handle card clicks
  onCardClick(cardId: string): void {
    console.log(`Card clicked: ${cardId}`);
    this.cardClick.emit(cardId);
  }
  
  // Helper method for template iteration
  getSetNames(): string[] {
    return Array.from(this.groupedCards.keys());
  }
  
  // Manual refresh method
  triggerFetch(): void {
    console.log('Manually triggering fetch...');
    this.loading = true;
    this.error = null;
    
    fetchAllCards()
      .then(result => {
        console.log(`Manual fetch completed successfully. Got A1 cards: ${result.a1.length}`);
      })
      .catch(err => {
        console.error('Manual fetch failed:', err);
        this.error = 'Failed to fetch cards. Please try again.';
        this.loading = false;
      });
  }
}