import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
export interface MenuItem {
  id: number;
  label: any;
  icon: string;
  iconActive?: string;
  link: string;
  subItems: any[];
  parentId?: number;
  isUiElement?: boolean;
}
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  isNavbarCollapsed = false;
  listMenu!: MenuItem[];
  listSubMenu!: MenuItem[];
  showSubMenu = true;
  changeValueIsMenuCollapse(): void {
    this.layoutService.valueIsMenuCollapse.subscribe(isAction => {
      this.isNavbarCollapsed = isAction;
    });
  }

  getListSubMenu(item: MenuItem, index: number): void {
    this.selected = index;
    if (item.link) {
      this.router.navigate([item.link]);
      this.listSubMenu = [];
    } else {
      const itemParent = this.listMenu.filter((element: MenuItem) => element.id === item.id);
      this.listSubMenu = itemParent.length > 0 ? itemParent[0].subItems : [];
      this.showSubMenu = this.listSubMenu.length > 0;
    }
  }
}