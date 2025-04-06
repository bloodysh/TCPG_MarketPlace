import {Component, inject, model} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Card} from '@/types/Card';
import {Sale} from '@/types/Sale';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {CurrencyPipe} from '@angular/common';
import {SalesService} from '@/app/services/sales.service';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface BuyDialogData {
  card: Card;
  sale: Sale;
}

@Component({
  selector: 'app-buy-dialog',
  imports: [
    MatLabel,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatInput,
    CurrencyPipe,
    MatDialogTitle,
    FormsModule
  ],
  templateUrl: './buy-dialog.component.html',
  styleUrl: './buy-dialog.component.css'
})
export class BuyDialogComponent {
  dialogRef = inject(MatDialogRef<BuyDialogComponent>);
  data = inject<BuyDialogData>(MAT_DIALOG_DATA);
  salesService = inject(SalesService);
  snackBar = inject(MatSnackBar);
  message = model('');

  onCancel() {
    this.dialogRef.close();
  }

  async onConfirm() {
    await this.salesService.buySale(this.data.sale, this.message());
    this.snackBar.open("Your purchase was registered successfully! Wait for the seller's response...", "Close");
    this.dialogRef.close();
  }
}
