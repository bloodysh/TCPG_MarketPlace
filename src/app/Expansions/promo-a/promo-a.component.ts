import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { paCards1 } from '@/CardExtraction'; // Changed to import from CardExtraction
import { Subscription } from 'rxjs'; // Added Subscription import

@Component({
  selector: 'app-promo-a',
  imports: [CommonModule],
  templateUrl: './promo-a.component.html',
  styleUrl: './promo-a.component.css',
  standalone: true
})
export class PromoAComponent implements OnInit { // Changed to OnDestroy
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Changed from @Input to @Output

  loading: boolean = true; // Added loading state
  error: string | null = null; // Added error handling

  constructor() {} // Removed constructor logic, moved to ngOnInit

  async ngOnInit(): Promise<void> {
    try{
      this.cards = await paCards1; // Changed to await
      this.loading = false;
    }
    catch {
      this.error = 'An unknown error occurred';
      this.loading = false;
    }
  }
  
}