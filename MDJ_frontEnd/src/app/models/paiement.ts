import dayjs from "dayjs";
import { Commande } from "./commande"
import { PaymentMethod } from "./PaymentMethod";

export interface Paiement {
    commande : Commande;
    montant : number;
    methode_paiement : PaymentMethod ;
    date_paiement : dayjs.Dayjs;
}
