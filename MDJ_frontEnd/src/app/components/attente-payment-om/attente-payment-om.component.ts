import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {environment} from "../../../environments/environment";
import {Infos} from "../../models/infos.module";
import {InfosService} from "../../services/infos.service";
import {Commande} from "../../models/commande";
import {finalize} from "rxjs";
import {CommandeService} from "../../services/commandes/commande.service";

@Component({
  selector: 'app-attente-payment-om',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './attente-payment-om.component.html',
  styleUrl: './attente-payment-om.component.scss'
})
export class AttentePaymentOmComponent implements OnInit,OnDestroy{
  numAdmin : string = environment.numAdmin;
  private readonly infosService = inject(InfosService);
  private readonly commandeService = inject(CommandeService);
  infos:Infos | undefined;
  remainingTime: string = '';
  private timerInterval?: any;

  commande : Commande | undefined;


  constructor(private router: Router,
              private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const vientDeRedirection = navigation?.extras?.state?.['vientDeRedirection'];

    if (!vientDeRedirection) {
      this.router.navigate(['/not-found']);
    }
  }

  ngOnInit() {
    this.loadData();
    this.getAdminNumber();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer() {
    this.updateRemainingTime();
    this.timerInterval = setInterval(() => this.updateRemainingTime(), 60000);
  }

  private updateRemainingTime() {
    if (!this.commande) return;

    const now = new Date().getTime();
    const expirationDate = new Date(this.commande.date_expiration).getTime();
    const distance = expirationDate - now;

    if (distance < 0) {
      this.remainingTime = 'Expiré';
      clearInterval(this.timerInterval);
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    this.remainingTime = `${hours}h ${minutes}min`;
  }

  isLoading = false;
  loadData(){
    this.isLoading = true;
    this.commandeService.getCurrentCommande().pipe(
      finalize(
        ()=>{
          this.isLoading = false;
        }
      )
    ).subscribe({
      next:(data)=>{
        this.commande = data;
        this.startTimer();
      },
      error:(error)=>{
        this.router.navigate(['/**']);
      }
    })
  }


  getAdminNumber():void{
    this.infosService.getInfos().subscribe(
      {
        next: (data) => {
          this.infos = data;
        }
      }
    )
  }
}
