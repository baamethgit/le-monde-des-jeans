import { Produit } from "./produit";
import { StatutCommande } from "./StatutCommande";
import { User } from "./user";
import { ZoneLivraison } from "./zone-livraison";

export interface Commande {
    id : number;
    client : User;
    ref_code : string;
    produits : Produit[] ;
    date_commande : Date;
    date_livraison : Date ;
    statut : StatutCommande;
    zone_livraison : ZoneLivraison;
    recupere_magasin : boolean;
    achat_direct : boolean;
    total : number
}
