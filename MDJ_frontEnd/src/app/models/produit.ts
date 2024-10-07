import dayjs from "dayjs";
import { categorie } from "./categorie";
import { ProduitImage } from "./image-produit";

export interface Produit {
    id: number;
    nom: string;
    prix: number;
    categorie_detail: categorie;
    taille?: string;
    composition?: string;
    couleur?: string;
    slug: string;
    QuantiteStock: number;
    Description:Text
    reserve: boolean;
    special: boolean;
    images: ProduitImage[];  // Change this to array of objects with 'image' property
  }

export interface Ipanierproduit extends Produit{
  date_ajout : dayjs.Dayjs
}