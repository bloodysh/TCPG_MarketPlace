import { Card as CardType} from '@/types/Card';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { a1aCards } from '@/CardsDB';


@Component({
  selector: 'app-mythical-island',
  imports: [CommonModule],
  templateUrl: './mythical-island.component.html',
  styleUrl: './mythical-island.component.css',
  standalone: true
})
export class MythicalIslandComponent implements OnInit, AfterViewInit{
  @Input() cards: CardType[] = [];
  @Input() cardClick = new EventEmitter<string>();

  groupedCards: Map<string, CardType[]> = new Map;

  constructor() {
    if (this.cards.length === 0) {
      this.cards = a1aCards;
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
