import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserCollectionService } from '../services/user-collection.service';
import { Card } from '@/types/Card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-collection',
  imports: [
    CommonModule,  
    MatGridList, 
    MatGridTile, 
    MatIcon
  ],
  templateUrl: './user-collection.component.html',
  styleUrl: './user-collection.component.css',
  standalone: true
})
export class UserCollectionComponent implements OnInit, OnDestroy {
  // Add this line to define the cards property
  public cards: Card[] = [];
  
  public userCollection: string[] = [];
  private auth = inject(Auth);
  private userCollectionService = inject(UserCollectionService);
  private subscription: Subscription | null = null;
  private cardsSubscription: Subscription | null = null;
  
  user: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    // Subscribe to collection updates
    this.subscription = this.userCollectionService.collection$.subscribe(collection => {
      this.userCollection = collection;
      this.loading = this.userCollectionService.loading;
      this.error = this.userCollectionService.error;
    });
    
    // Add this subscription to load the full card details
    this.cardsSubscription = this.userCollectionService.getCardsWithDetails$()
      .subscribe(cards => {
        console.log('Cards loaded:', cards);
        this.cards = cards;
      });
    
    // Auth state already handled by the service
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (!user) {
        this.loading = false;
        this.error = 'Please log in to view your collection';
      }
    });
  }

  ngOnDestroy() {
    // Clean up both subscriptions
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.cardsSubscription) {
      this.cardsSubscription.unsubscribe();
    }
  }
  
  removeCard(cardId: string) {
    this.userCollectionService.removeFromCollection(cardId);
  }
}