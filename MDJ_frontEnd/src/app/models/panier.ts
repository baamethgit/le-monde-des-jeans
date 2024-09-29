import { PanierProduit } from "./panier-produit";
import { Produit } from "./produit";
import { User } from "./user";

export interface Panier {
    id: number;
    client: User;
    produits: PanierProduit[];
    date_creation: string;
    get_total: number;
}