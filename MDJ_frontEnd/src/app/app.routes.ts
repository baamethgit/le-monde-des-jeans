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
import { PaymentComponent } from './components/admin/payment/payment.component';
import { PaiementFailedComponent } from './components/paiement-failed/paiement-failed.component';
import { InfosGenComponent } from './components/admin/infos-gen/infos-gen.component';
import {userGuard} from "./utils/user.guard";
import {adminGuard} from "./utils/admin.guard";
import {VerifyEmailComponent} from "./components/user/verify-email/verify-email.component";
import {InitresetpasswdComponent} from "./components/initresetpasswd/initresetpasswd.component";


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'LMDJ | Accueil' },
      { path: 'panier', component: PanierComponent, title: 'LMDJ | Panier',canActivate:[userGuard]  },
      { path: 'commande-validee', component: CommandeValideeComponent, title: 'LMDJ | Commande' ,canActivate:[userGuard] },
      { path: 'profile', component: ProfilComponent, title: 'LMDJ | Profile' ,canActivate:[userGuard] },
      { path: 'profile/edit', component: ProfilUpdateComponent, title: 'LMDJ | Profile' ,canActivate:[userGuard] },
      { path: 'detail-commande', component: DetailCommandeComponent, title: 'LMDJ | Commande',canActivate:[userGuard]  },
      { path: 'mes-commandes', component: MesCommandesComponent, title: 'LMDJ | Commandes',canActivate:[userGuard]  },
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
      { path: 'avis', component: AvisComponent, title: 'LMDJ | Avis'},
      { path: 'payment-success/:ref-code', component: CommandeValideeComponent, title: 'LMDJ | Paiement',canActivate:[userGuard]  },
      { path: 'payment-error/:ref-code', component: PaiementFailedComponent, title: 'LMDJ | Paiement' ,canActivate:[userGuard] }
    ]
  },
  {
    path: 'mdj_admin',
    component: AdminHomeComponent,

    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardAdminComponent , title: 'LMDJ | Admin-dashboard', canActivate: [adminGuard]},
      { path: 'commandes', component: AdminListeCommandesComponent , title: 'LMDJ | Admin-commandes', canActivate: [adminGuard]},
      { path: 'paiements', component: PaymentComponent , title: 'LMDJ | Admin-paiements', canActivate: [adminGuard]},
      { path: 'produits', component: AdminProduitsComponent , title: 'LMDJ | Admin-produits', canActivate: [adminGuard]},
      { path: 'commandes/:ref-code', component: AdminDetailCommandeComponent , title: 'LMDJ | Admin-detail-commande', canActivate: [adminGuard]},
      { path: 'clients', component: ClientsComponent , title: 'LMDJ | Admin-clients', canActivate: [adminGuard]},
      { path: 'infos-client/:slug', component: DetailClientComponent , title: 'LMDJ | Admin-infoclient', canActivate: [adminGuard]},
      { path: 'avis', component: AdminAvisClientsComponent , title: 'LMDJ | Admin-avis-client', canActivate: [adminGuard]},
      { path: 'zones-livraison', component: ListeZonesComponent , title: 'LMDJ | Admin-zones-livraisons', canActivate: [adminGuard]},
      { path: 'zones-livraison/:id/modifier', component: UpdateZoneComponent , title: 'LMDJ | Admin-update-zone', canActivate: [adminGuard]},
      { path: 'zones-livraison/creer', component: CreateZoneComponent , title: 'LMDJ | Admin-create-zone', canActivate: [adminGuard]},
      { path: 'informations-generales', component: InfosGenComponent , title: 'LMDJ | Admin-infospage', canActivate: [adminGuard]}
    ]
  },

    {path: 'resetpwd', component: InitresetpasswdComponent},
    {path: 'cpw-verify-email', component: ResetPasswordComponent},
    {path: 'login', component: LoginComponent,title: 'LMDJ | Login'},
    {path: 'inscription', component: SignupComponent,title: 'LMDJ | Inscription'},
    { path: 'verify-email', component: VerifyEmailComponent },
    {path: 'sdfsdfsd/suf_creer_/superuser/uI90', component: SignupComponent, title: 'LMDJ | Admin-sup', canActivate: [adminGuard]},

    { path: '**', component: NotFoundComponent },
]
