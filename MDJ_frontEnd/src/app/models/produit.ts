export interface Produit {
    produitNom ?: string;
    produitImage: string[];
    produitPrix: number;
    produitTaille: string;
    produitCompo: string;
    categorie:string;
    produitRef:string;
}

  
export interface ProduitAvecImageAny extends Omit<Produit, 'produitImage'> {
    produitImage: any;
  }