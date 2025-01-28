import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminHeaderComponent } from "./components/admin/admin-header/admin-header.component";
import { AdminDetailCommandeComponent } from './components/admin/admin-detail-commande/admin-detail-commande.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FooterComponent, HeaderComponent, AdminHeaderComponent,AdminDetailCommandeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MDJ_frontEnd';
  private isBrowser: boolean;


  constructor(private router: Router,    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if(this.isBrowser){
        window.scrollTo(0, 0);
      }
    });
  }
}
