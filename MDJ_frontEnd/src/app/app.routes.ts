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
import { ProfilComponent } from './components/user/profil/profil.component';
import { ProfilUpdateComponent } from './components/user/profil-update/profil-update.component';
import { DetailClientComponent } from './components/admin/detail-client/detail-client.component';
import { DetailCommandeComponent } from './components/user/detail-commande/detail-commande.component';
import { CommandeValideeComponent } from './components/user/commande-validee/commande-validee.component';
import { AdminListeCommandesComponent } from './components/admin/admin-liste-commandes/admin-liste-commandes.component';
import { AdminDetailCommandeComponent } from './components/admin/admin-detail-commande/admin-detail-commande.component';

import { AdminProduitsComponent } from './components/admin/admin-produits/admin-produits.component';

import { MesCommandesComponent } from './components/user/mes-commandes/mes-commandes.component';
import { ListeZonesComponent } from './components/admin/liste-zones/liste-zones.component';
import { UpdateZoneComponent } from './components/admin/update-zone/update-zone.component';
import { CreateZoneComponent } from './components/admin/create-zone/create-zone.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PaiementComponent } from './components/user/paiement/paiement.component';
import { PaymentComponent } from './components/admin/payment/payment.component';
import { PaiementSuccessComponent } from './components/paiement-success/paiement-success.component';
import { PaiementFailedComponent } from './components/paiement-failed/paiement-failed.component';
import { InfosGenComponent } from './components/admin/infos-gen/infos-gen.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'LMDJ | Accueil' },
      { path: 'panier', component: PanierComponent, title: 'LMDJ | Panier' },
      { path: 'commande-validee', component: CommandeValideeComponent, title: 'LMDJ | Commande' },
      { path: 'profile', component: ProfilComponent, title: 'LMDJ | Profile' },
      { path: 'profile/edit', component: ProfilUpdateComponent, title: 'LMDJ | Profile' },
      { path: 'detail-commande', component: DetailCommandeComponent, title: 'LMDJ | Commande' },
      { path: 'mes-commandes', component: MesCommandesComponent, title: 'LMDJ | Commandes' },
      {
        path: 'produits',
        component: ProduitsComponent,
        children: [
          { path: '', component: AllProductsComponent, pathMatch: 'full' },
          { path: 'categorie/:slug', component: ProductFilterComponent }
        ],
        title: 'LMDJ | Produits'
      },
      { path: 'produits/:slug', component: ProduitDetailComponent, title: 'LMDJ | Produit' },
      { path: 'avis', component: AvisComponent, title: 'LMDJ | Avis' },
      { path: 'payment-success/:id', component: CommandeValideeComponent, title: 'LMDJ | Paiement' },
      { path: 'payment-error/:id', component: PaiementFailedComponent, title: 'LMDJ | Paiement' }
    ]
  },
  {
    path: 'mdj_admin',
    component: AdminHomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAdminComponent },
      { path: 'commandes', component: AdminListeCommandesComponent },
      { path: 'paiements', component: PaymentComponent },
      { path: 'produits', component: AdminProduitsComponent },
      { path: 'commandes/:ref-code', component: AdminDetailCommandeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'infos-client/:slug', component: DetailClientComponent },
      { path: 'avis', component: AdminAvisClientsComponent },
      { path: 'zones-livraison', component: ListeZonesComponent },
      { path: 'zones-livraison/:id/modifier', component: UpdateZoneComponent },
      { path: 'zones-livraison/creer', component: CreateZoneComponent },
      { path: 'informations-generales', component: InfosGenComponent }
    ]
  },

    {path: 'resetpwd', component: ResetPasswordComponent},
    {path: 'login', component: LoginComponent,title: 'LMDJ | Login'},
    {path: 'inscription', component: SignupComponent,title: 'LMDJ | Inscription'},
    {path: 'sdfsdfsd/suf_creer_/superuser/uI90', component: SignupComponent},

    { path: '**', component: NotFoundComponent, data: { breadcrumb: 'Page not found' } },
]
