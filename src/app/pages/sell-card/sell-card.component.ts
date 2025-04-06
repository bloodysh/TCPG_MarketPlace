import {Component, inject, OnDestroy, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, switchMap} from 'rxjs';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardService} from '@/app/services/card.service';
import {Seller} from '@/types/Seller';
import {SellerService} from '@/app/services/seller.service';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext} from '@angular/material/stepper';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {SalesService} from '@/app/services/sales.service';
import {Card} from '@/types/Card';
import {doc, Firestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-sell-card',
  imports: [
    MatStepper,
    MatStep,
    MatStepLabel,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatStepperNext,
    MatCheckbox,
    MatHint,
    CurrencyPipe
  ],
  templateUrl: './sell-card.component.html',
  styleUrl: './sell-card.component.css'
})
export class SellCardComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  router = inject(Router);
  cardService = inject(CardService);
  sellerService = inject(SellerService);
  salesService = inject(SalesService);
  firestore = inject(Firestore);
  snackBar = inject(MatSnackBar);
  seller = signal<Seller|null>(null);
  sellerSubscription: Subscription;
  card = signal<Card | null>(null);
  cardSubscription: Subscription;

  card$ = this.route.paramMap.pipe(switchMap((params) => {
    const selectedCard = params.get('cardId')!;
    return this.cardService.getCard(selectedCard);
  }));

  sellerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    certified: new FormControl({value: false, disabled: true}),
  });

  saleForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
  });

  constructor() {
    this.sellerSubscription = this.sellerService.getSellerProfile().subscribe((seller) => {
      this.seller.set(seller);
      if (seller) {
        this.sellerForm.setValue({
          name: seller.name,
          certified: seller.certified ?? false
        });
      }
    });
    this.cardSubscription = this.card$.subscribe((card) => {
      this.card.set(card ?? null);
    })
  }

  async createSale() {
    const sellerDoc = await this.sellerService.upsertSellerProfile(this.sellerForm.value.name!);
    const cardId = this.card()!.fs_id;
    await this.salesService.createSale({
      card: doc(this.firestore, `AllCards/${cardId}`),
      created: new Date(),
      seller: sellerDoc!,
      description: this.saleForm.value.description!,
      price: this.saleForm.value.price!,
    });
    this.snackBar.open("The sale is now being moderated by our admins. Please wait!", "Close");
    this.router.navigateByUrl(`/cards/${this.card()?.expansion}/${cardId}`);
  }

  saveSale() {
    if (this.saleForm.invalid || this.sellerForm.invalid) return;
    this.createSale().then(console.log);
  }

  ngOnDestroy() {
    this.sellerSubscription.unsubscribe();
    this.cardSubscription.unsubscribe();
  }
}
