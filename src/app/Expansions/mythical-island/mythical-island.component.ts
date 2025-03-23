import { Card, Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a1aCards1 } from '@/CardExtraction'; // Changed to import from CardExtraction and use observable
import { Subscription } from 'rxjs'; // Added Subscription import
import { a } from 'node_modules/@angular/core/navigation_types.d-u4EOrrdZ';

@Component({
  selector: 'app-mythical-island',
  imports: [CommonModule],
  templateUrl: './mythical-island.component.html',
  styleUrl: './mythical-island.component.css',
  standalone: true
})
export class MythicalIslandComponent implements OnInit {
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Changed from @Input to @Output

  loading: boolean = true; // Added loading state
  error: string | null = null; // Added error handling

  constructor() {}

  async ngOnInit(): Promise<void> {
    try {
      this.cards = await a1aCards1; // Changed to await observable 
      this.loading = false;
    }
    catch (error) {
      this.error = (error instanceof Error) ? error.message : 'An unknown error occurred';
      this.loading = false;
    }
  }  

}