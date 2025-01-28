import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfosService } from '../../services/infos.service';
import { Infos } from '../../models/infos.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  infos:Infos | undefined;
  constructor(private readonly infosService:InfosService) { }
  ngOnInit(): void {
    this.loadInfos();
  }
  loadInfos(): void {
    this.infosService.getInfos().subscribe(
      {
        next: (data) => {
          this.infos = data;
        }}
    )
  }
}
