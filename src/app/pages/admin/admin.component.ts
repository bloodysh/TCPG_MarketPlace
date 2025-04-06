import { Component } from '@angular/core';
import {PendingSalesComponent} from '@/app/admin/pending-sales/pending-sales.component';
import {SellersComponent} from '@/app/admin/sellers/sellers.component';

@Component({
  selector: 'app-admin',
  imports: [
    PendingSalesComponent,
    SellersComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
