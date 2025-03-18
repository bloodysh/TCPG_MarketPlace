import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a1aCards$ } from '@/CardExtraction'; // Changed to import from CardExtraction and use observable
import { Subscription } from 'rxjs'; // Added Subscription import

@Component({
  selector: 'app-mythical-island',
  imports: [CommonModule],
  templateUrl: './mythical-island.component.html',
  styleUrl: './mythical-island.component.css',
  standalone: true
})
export class MythicalIslandComponent implements OnInit, OnDestroy {
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Changed from @Input to @Output

  groupedCards: Map<string, CardType[]> = new Map();
  loading: boolean = true; // Added loading state
  error: string | null = null; // Added error handling
  
  private cardsSubscription?: Subscription; // Added subscription management

  constructor() {}

  ngOnInit(): void {
    // If cards are provided as input, use those
    if (this.cards.length > 0) {
      this.organizeCards();
      this.loading = false;
      return;
    }
    
    // Otherwise subscribe to the observable
    console.log('Subscribing to a1aCards$ observable...');
    this.loading = true;
    
    this.cardsSubscription = a1aCards$.subscribe({
      next: (cards) => {
        console.log(`Received ${cards.length} cards from a1aCards$ observable`);
        this.cards = cards;
        this.organizeCards();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching A1a cards:', err);
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

  // Helper method to get array of set names for template iteration
  getSetNames(): string[] {
    return Array.from(this.groupedCards.keys());
  }
}