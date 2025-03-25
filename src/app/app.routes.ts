import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';
import {CardsComponent} from '@/app/pages/cards/cards.component';
import {AuthHandlerPageComponent} from '@/app/auth/auth-handler-page/auth-handler-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path : 'home', component: HomeComponent },
    { path : 'cards/:setId', component: CardsComponent },
    { path : 'collection', component: CollectionComponent },
  { path: 'auth', component: AuthHandlerPageComponent }
];
