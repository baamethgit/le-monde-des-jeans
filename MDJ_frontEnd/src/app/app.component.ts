import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminHeaderComponent } from "./components/admin/admin-header/admin-header.component";
import { AdminDetailCommandeComponent } from './components/admin/admin-detail-commande/admin-detail-commande.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FooterComponent, HeaderComponent, AdminHeaderComponent,AdminDetailCommandeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MDJ_frontEnd';
  isAdmin = false;
}
