import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a2Cards } from '@/CardsDB';


@Component({
  selector: 'app-space-time-smackdown',
  imports: [CommonModule],
  templateUrl: './space-time-smackdown.component.html',
  styleUrl: './space-time-smackdown.component.css',
  standalone: true
})
export class SpaceTimeSmackdownComponent implements OnInit, AfterViewInit{
  @Input() cards: CardType[] = [];
  @Input() cardClick = new EventEmitter<string>();

  groupedCards: Map<string, CardType[]> = new Map;

  constructor() {
    if (this.cards.length === 0) {
      this.cards = a2Cards;
    }
  }

  ngOnInit(): void {
    this.organizeCards();
  }

  ngAfterViewInit(): void {
      
  }

  organizeCards(): void {
    // Group cards by set_details
    this.groupedCards = new Map<string, CardType[]>();
    
    this.cards.forEach(card => {
      const setName = card.set_details;
      if (!this.groupedCards.has(setName)) {
        this.groupedCards.set(setName, []);
      }
      this.groupedCards.get(setName)?.push(card);
    });
    
  }

}
