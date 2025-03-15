import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CardsTableComponent } from './cards-table/cards-table.component';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path : 'home', component: HomeComponent },
    { path : 'apexGen', component: CardsTableComponent },
    { path : 'collection', component: CollectionComponent },
];
