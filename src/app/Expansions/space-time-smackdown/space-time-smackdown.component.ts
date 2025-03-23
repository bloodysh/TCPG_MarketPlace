import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a2Cards1 } from '@/CardExtraction'; // Changed to import from CardExtraction

@Component({
  selector: 'app-space-time-smackdown',
  imports: [CommonModule],
  templateUrl: './space-time-smackdown.component.html',
  styleUrl: './space-time-smackdown.component.css',
  standalone: true
})
export class SpaceTimeSmackdownComponent implements OnInit{
  @Input() cards: CardType[] = [];
  @Output() cardClick = new EventEmitter<string>(); // Changed from @Input to @Output

  loading: boolean = true; // Added loading state
  error: string | null = null; // Added error handling
  
  constructor() {}

  async ngOnInit(): Promise<void> {
    try {
      this.cards = await a2Cards1; // Changed to await
      this.loading = false;
    }
    catch (error) {
      this.error = (error instanceof Error) ? error.message : 'An unknown error occurred';
      this.loading = false;
    }
  }
}