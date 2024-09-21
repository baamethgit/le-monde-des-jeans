import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { navbarData } from './navData';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  isNavbarCollapsed = false;
  navData = navbarData;
    collapsed = false;
    screenWidth = 0;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.screenWidth = window.innerWidth;
      if(this.screenWidth <= 768 ) {
        this.collapsed = false;
      }
    }

    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
    }

    toggleCollapse(): void {
      this.collapsed = !this.collapsed;
    }

    closeSidenav(): void {
      this.collapsed = false;
    }
}