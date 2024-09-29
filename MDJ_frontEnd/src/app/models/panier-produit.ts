import { Produit } from "./produit";

export interface PanierProduit {
    id: number;
    panier: number;
    produit: Produit;
    date_ajout: string;
}