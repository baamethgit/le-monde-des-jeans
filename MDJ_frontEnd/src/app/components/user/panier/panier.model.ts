import { PanierProduit } from "../../../models/panier-produit";
import { User } from "../../../models/user";

export interface Ipanier{
    id : number;
    client : User;
    date_creation: string;
    montant: number;
    quantitePanier: number;
}

// export type IcontenuPanier = Pick<Ipanier, 'client' | 'montant'>;


export interface IcontenuPanier{
    id? : number,
    produits :PanierProduit[];
}