import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ClientsComponent } from './components/admin/clients/clients.component';
import { AdminAvisClientsComponent } from './components/admin/admin-avis-clients/admin-avis-clients.component';
import { HomeComponent } from './components/home/home.component';
import { ProduitDetailComponent } from './components/produit-detail/produit-detail.component';
import { UpdateUserComponent } from './components/admin/update-user/update-user.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { ProductFilterComponent } from './components/produits/product-filter/product-filter.component';
import path from 'path';
import { AllProductsComponent } from './components/produits/all-products/all-products.component';
import { AvisComponent } from './avis/avis.component';
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path:'produits', component: ProduitsComponent, children:[
        {path:'',component:AllProductsComponent, pathMatch:'full'},
        {path:'categorie/:slug', component:ProductFilterComponent, pathMatch:'full'}
    ]},
    {path:'produits/:slug', component: ProduitDetailComponent, pathMatch:'full'},
    {path:'avis', component:AvisComponent, pathMatch:'full'},
    {path:'mdj_admin', component: AdminHomeComponent, children:[
        {path:'dashboard', component: DashboardAdminComponent, pathMatch:'full'},
        {path:'commandes', component: ProduitDetailComponent, pathMatch:'full'},
        {path:'clients', component: ClientsComponent, pathMatch:'full'},
        {path:'infos-client/:phone_number', component: UpdateUserComponent, pathMatch:'full'},
        {path:'avis', component: AdminAvisClientsComponent, pathMatch:'full'},
    ]},
];
