export interface User {
    id?:number;
    nom_complet : string;
    phone_number: string;
    password?: string;
    slug:string;
}