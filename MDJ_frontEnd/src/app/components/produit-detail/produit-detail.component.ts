import { Component, inject, input } from '@angular/core';
import { CarouselModule} from 'primeng/carousel';
import { ActivatedRoute } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Produit, ProduitService } from '../../services/produits/produit.service';
import { CommandeService } from '../../services/commandes/commande.service';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-produit-detail',
  standalone: true,
  imports: [SlicePipe, CarouselModule],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.scss'
})
export class ProduitDetailComponent {
list_p:any[]=[];
product_selected = input<Produit | null>(null);
// product_selected:Produit | undefined;
must_like_product:Produit[]=[];
commandeService = inject(CommandeService);
userService = inject(UserService);
responsiveOptions : any[]=[
  {
      breakpoint: '576px',
      numVisible: 1,
      numScroll: 1,
      circular: true,
      showIndicators:false
  }
  
]

constructor(private route: ActivatedRoute, private produitService:ProduitService){}

ngOnInit():void{
  // const slug=this.route.snapshot.paramMap.get('slug');
  // this.produitService.getProductBySlug(<string>slug).subscribe({
  //   next:(data:Produit)=>{
  //     this.product_selected()=data;
  //     this.list_p=this.product_selected.images;

  //     if (this.product_selected && this.product_selected.categorie?.slug) {
  //       const categorySlug = this.product_selected.categorie.slug;
  //       this.produitService.getProductByCategory(categorySlug).subscribe({
  //         next: (data: Produit[]) => {
  //           this.must_like_product = data;
  //         },
  //         error: (error) => {
  //           console.log('Erreur lors de l\'affichage des produits similaires :', error.error.detail);
  //         }
  //       });
  //     } else {
  //       console.log('Aucun slug de catégorie disponible pour ce produit.');
  //     }
  //   },
  //   error:(error)=>{console.log('Erreur lors de l affichage du produit :', error.error.detail);}
  // })

  console.log('final: ', this.must_like_product)
}

CreerCommande(){
  this.commandeService.creerCommande([]);
}

addToCart(){
  this.commandeService.addProductToCart();
}

}


