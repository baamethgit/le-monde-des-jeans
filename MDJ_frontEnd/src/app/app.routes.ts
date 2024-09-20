import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProduitsComponent } from './produits/produits.component';
import { ProduitDetailComponent } from './produit-detail/produit-detail.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path:'Produits', component: ProduitsComponent, children:[
        
    ]},
    {path:'Produits/:ProduitRef', component: ProduitDetailComponent, pathMatch:'full'},
];
