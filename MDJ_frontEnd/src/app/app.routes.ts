import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ClientsComponent } from './components/admin/clients/clients.component';
import { AdminAvisClientsComponent } from './components/admin/admin-avis-clients/admin-avis-clients.component';
import { HomeComponent } from './components/home/home.component';
import { ProduitDetailComponent } from './components/produit-detail/produit-detail.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { ProductFilterComponent } from './components/produits/product-filter/product-filter.component';
import { AllProductsComponent } from './components/produits/all-products/all-products.component';
import { AvisComponent } from './components/avis/avis.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PanierComponent } from './components/user/panier/panier.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { userGuard } from './utils/user.guard';
import { ProfilComponent } from './components/user/profil/profil.component';
import { ProfilUpdateComponent } from './components/user/profil-update/profil-update.component';
import { DetailClientComponent } from './components/admin/detail-client/detail-client.component';
import { DetailCommandeComponent } from './components/user/detail-commande/detail-commande.component';
import { CommandeValideeComponent } from './components/user/commande-validee/commande-validee.component';

import { ContactsComponent } from './components/contacts/contacts.component';
import { detailProduitResolver } from './services/produits/resolvers/detail-produit.resolver';
import { ProduitService } from './services/produits/produit.service';
import { inject } from '@angular/core';
import { AdminListeCommandesComponent } from './components/admin/admin-liste-commandes/admin-liste-commandes.component';
import { AdminDetailCommandeComponent } from './components/admin/admin-detail-commande/admin-detail-commande.component';

import { AdminProduitsComponent } from './components/admin/admin-produits/admin-produits.component';

import { MesCommandesComponent } from './components/user/mes-commandes/mes-commandes.component';
import { ListeZonesComponent } from './components/admin/liste-zones/liste-zones.component';
import { UpdateZoneComponent } from './components/admin/update-zone/update-zone.component';
import { CreateZoneComponent } from './components/admin/create-zone/create-zone.component';


export const routes: Routes = [
    {path: '', component: HomeComponent,
          canActivate: [userGuard]}
        ,
    {path: 'resetpwd', component: ResetPasswordComponent,canActivate: [userGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'inscription', component: SignupComponent},
    {path: 'panier', component: PanierComponent, canActivate: [userGuard]},
    {path:'produits', component: ProduitsComponent},
    {path: 'commande-validee', component:CommandeValideeComponent,
        canActivate: [userGuard]},
    {path: 'profile', component: ProfilComponent,
        canActivate: [userGuard]},
    {path: 'profile/edit', component: ProfilUpdateComponent,
        canActivate: [userGuard]},
    {path: 'detail-commande', component: DetailCommandeComponent,
        canActivate: [userGuard]},
    {path: 'mes-commandes', component: MesCommandesComponent,
        canActivate: [userGuard]},
    {path:'produits', component: AllProductsComponent, children:[

        {path:'',component:AllProductsComponent, pathMatch:'full'},
        {path:'categorie/:slug', component:ProductFilterComponent, pathMatch:'full'}
    ]},
    {path:'produits/:slug', component: ProduitDetailComponent, pathMatch:'full'},
    {path:'avis', component:AvisComponent, pathMatch:'full'},
    {path:'contacts', component:ContactsComponent, pathMatch:'full'},
    {path:'mdj_admin', component: AdminHomeComponent, children:[
        {path:'dashboard', component: DashboardAdminComponent, pathMatch:'full'},
        {path:'commandes', component: AdminListeCommandesComponent, pathMatch:'full'},
        {path:'produits', component: AdminProduitsComponent, pathMatch:'full'},
        {path: 'commande/:ref-code', component: AdminDetailCommandeComponent},
        {path:'clients', component: ClientsComponent, pathMatch:'full'},
        {path:'infos-client/:slug', component: DetailClientComponent, pathMatch:'full'},
        {path:'avis', component: AdminAvisClientsComponent, pathMatch:'full'},

        {path:'zones-livraison', component: ListeZonesComponent, pathMatch:'full'},
        {path:'zone/:id/modifier', component: UpdateZoneComponent , pathMatch:'full'},
        {path:'creer-zone', component: CreateZoneComponent , pathMatch:'full'},

    ]},
]