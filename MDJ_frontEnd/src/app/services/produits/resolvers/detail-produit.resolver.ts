import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Produit } from '../../../models/produit';
import { inject } from '@angular/core';
import { ProduitService } from '../produit.service';
import { mergeMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

export const detailProduitResolver: ResolveFn<Produit> = (route : ActivatedRouteSnapshot) : any => {
  const slugProd = route.params['slug'];
  if (slugProd){
    const prodService = inject(ProduitService);
    return prodService.getProductBySlug(slugProd).pipe(
      // mergeMap((projet: HttpResponse<Produit>) => {
        // if (projet.body) {
        //   return of(projet.body);
        // } else {
        //   inject(Router).navigate(['404']);
        //   return EMPTY;
        // }
      // }),
    );;
  }
};
