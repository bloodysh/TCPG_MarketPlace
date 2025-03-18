import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';
import {CardsComponent} from '@/app/pages/cards/cards.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path : 'home', component: HomeComponent },
    { path : 'cards/:setId', component: CardsComponent },
    { path : 'collection', component: CollectionComponent }
];
