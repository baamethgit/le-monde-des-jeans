import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProduitsComponent } from './produits/produits.component';
import { ProduitDetailComponent } from './produit-detail/produit-detail.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ClientsComponent } from './components/admin/clients/clients.component';
import { AdminAvisClientsComponent } from './components/admin/admin-avis-clients/admin-avis-clients.component';

export const routes: Routes = [
    // {path: '', component: HomeComponent},
    // {path:'Produits', component: ProduitsComponent, children:[
        
    // ]},
    // {path:'Produits/:ProduitRef', component: ProduitDetailComponent, pathMatch:'full'},
    {path:'mdj_admin', component: AdminHomeComponent, children:[
        {path:'dashboard', component: DashboardAdminComponent, pathMatch:'full'},
        {path:'commandes', component: ProduitDetailComponent, pathMatch:'full'},
        {path:'clients', component: ClientsComponent, pathMatch:'full'},
        {path:'avis', component: AdminAvisClientsComponent, pathMatch:'full'},
    ]},
];
