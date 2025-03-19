import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { paCards$ } from '@/CardExtraction'; // Changed to import from CardExtraction
import { Subscription } from 'rxjs'; // Added Subscription import

@Component({
  selector: 'app-promo-a',
  imports: [CommonModule],
  templateUrl: './promo-a.component.html',
  styleUrl: './promo-a.component.css',
  standalone: true
})
export class PromoAComponent implements OnInit, OnDestroy { // Changed to OnDestroy
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Changed from @Input to @Output

  groupedCards: Map<string, CardType[]> = new Map();
  loading: boolean = true; // Added loading state
  error: string | null = null; // Added error handling
  
  private cardsSubscription?: Subscription; // Added subscription tracking

  constructor() {} // Removed constructor logic, moved to ngOnInit

  ngOnInit(): void {
    // If cards are provided as input, use those
    if (this.cards.length > 0) {
      this.organizeCards();
      this.loading = false;
      return;
    }
    
    // Otherwise subscribe to the observable
    console.log('Subscribing to paCards$ observable...');
    this.loading = true;
    
    this.cardsSubscription = paCards$.subscribe({
      next: (cards) => {
        console.log(`Received ${cards.length} cards from paCards$ observable`);
        this.cards = cards;
        this.organizeCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching Promo-A cards:', err);
        this.error = 'Failed to load cards. Please try again later.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
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

  // Helper method for template
  getSetNames(): string[] {
    return Array.from(this.groupedCards.keys());
  }
}