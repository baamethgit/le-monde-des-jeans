import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { ClientsComponent } from './components/admin/clients/clients.component';
import { AdminAvisClientsComponent } from './components/admin/admin-avis-clients/admin-avis-clients.component';
import { HomeComponent } from './components/home/home.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { ProduitDetailComponent } from './components/produit-detail/produit-detail.component';
import { UpdateUserComponent } from './components/admin/update-user/update-user.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { PanierComponent } from './components/user/panier/panier.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'resetpwd', component: ResetPasswordComponent},
    {path: 'login', component: LoginComponent},
    {path: 'inscription', component: SignupComponent},
    {path: 'panier', component: PanierComponent},
    {path:'produits', component: ProduitsComponent, children:[
        
    ]},
    {path:'produits/:ProduitRef', component: ProduitDetailComponent, pathMatch:'full'},
    {path:'mdj_admin', component: AdminHomeComponent, children:[
        {path:'dashboard', component: DashboardAdminComponent, pathMatch:'full'},
        {path:'commandes', component: ProduitDetailComponent, pathMatch:'full'},
        {path:'clients', component: ClientsComponent, pathMatch:'full'},
        {path:'infos-client/:phone_number', component: UpdateUserComponent, pathMatch:'full'},
        {path:'avis', component: AdminAvisClientsComponent, pathMatch:'full'},
    ]},
];
