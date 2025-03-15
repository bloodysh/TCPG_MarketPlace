import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';
import { ApexGenComponent } from './Expansions/apex-gen/apex-gen.component';
import { MythicalIslandComponent } from './Expansions/mythical-island/mythical-island.component';
import { SpaceTimeSmackdownComponent } from './Expansions/space-time-smackdown/space-time-smackdown.component';
import { PromoAComponent } from './Expansions/promo-a/promo-a.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path : 'home', component: HomeComponent },
    { path : 'apexGen', component: ApexGenComponent },
    { path : 'collection', component: CollectionComponent },
    { path : 'mythicalIsland', component: MythicalIslandComponent },
    { path : 'spacetime', component: SpaceTimeSmackdownComponent },
    { path : 'promoCards', component: PromoAComponent }
];
