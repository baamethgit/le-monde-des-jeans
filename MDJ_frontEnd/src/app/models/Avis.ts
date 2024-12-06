import { User } from "./user";

export interface Avis{
    id: number,
    Avis_author: User ,
    Texte_avis: string,
    temoigne_le: Date,
    nbre_etoiles: number
}

export type AvisCreationData = Omit<Avis,'id' | 'Avis_author' > & {'Avis_author':number}