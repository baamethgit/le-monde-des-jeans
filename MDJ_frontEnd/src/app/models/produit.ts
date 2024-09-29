import { categorie } from "./categorie";
import { ProduitImage } from "./image-produit";

export interface Produit {
    id: number;
    nom: string;
    prix: number;
    categorie: categorie;
    taille?: string;
    composition?: string;
    couleur?: string;
    slug: string;
    QuantiteStock: number;
    reserve: boolean;
    special: boolean;
    images: ProduitImage[];  // Change this to array of objects with 'image' property
  }