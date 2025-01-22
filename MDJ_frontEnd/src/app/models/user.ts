export interface User {
    id?:number;
    nom_complet : string;
    phone_number: string;
    addresse_mail:string;
    password?: string;
    slug:string;
    is_staff?:boolean,
    is_superuser?:boolean,
}
