import { Produit } from "./produit";
import { User } from "./user";

export interface Panier {
    client? : User;
    produits : Produit[];
    date_creation? : Date;
}
