import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProduitsComponent } from './produits/produits.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path:'Produits', component: ProduitsComponent},
];
