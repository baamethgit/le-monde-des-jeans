import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Component, Inject, inject, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/users/user.service';
import { Infos } from '../../models/infos.module';
import { InfosService } from '../../services/infos.service';
import { log } from 'console';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  currentUser: User | undefined = undefined;
  is_authenticated = false;
  infos:Infos | undefined;
  private readonly infosService = inject(InfosService);
  private readonly userService = inject(UserService);
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadInfos();
    this.userService.getUser().subscribe({
      next: (data) => {
          this.currentUser = data;
          this.is_authenticated = true;
      },
      error: (error) => {
        this.is_authenticated = false;
      }
    })
  }

  loadInfos(): void {
    this.infosService.getInfos().subscribe(
      {
        next: (data) => {
          this.infos = data;
        }
      }
    )
  }

  logout(): void {
    this.userService.logout().subscribe(
      (response) => {
        if(this.isBrowser){
          window.location.reload();

        }
      }
    );
  }
}
