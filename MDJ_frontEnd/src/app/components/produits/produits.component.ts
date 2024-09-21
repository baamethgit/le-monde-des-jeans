import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produit } from '../../models/produit';
@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produits.component.html',
  styleUrl: './produits.component.scss'
})
export class ProduitsComponent {
product:Produit[]=[];

ngOnInit():void{
  this.product=[
    {
      produitRef: "PROD001",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 39.99,
      produitTaille: "M",
      produitCompo: "Coton",
      categorie: "Chemises"
    },
    {
      produitRef: "PROD002",
      produitNom: "Jean slim",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 59.99,
      produitTaille: "32",
      produitCompo: "Coton",
      categorie: "Pantalons"
    },
    {
      produitRef: "PROD003",
      produitNom: "Robe d'été",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 45.50,
      produitTaille: "S",
      produitCompo: "Viscose",
      categorie: "Lacoste"
    },
    {
      produitRef: "PROD004",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 89.99,
      produitTaille: "42",
      produitCompo: "Synthétique",
      categorie: "Chaussures"
    },
    {
      produitRef: "PROD005",
      produitNom: "T-shirt basique",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 15.99,
      produitTaille: "L",
      produitCompo: "Coton",
      categorie: "Tee-shirt"
    },
    {
      produitRef: "PROD006",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 199.99,
      produitTaille: "M",
      produitCompo: "Cuir",
      categorie: "Lacoste"
    },
    {
      produitRef: "PROD007",
      produitNom: "Écharpe en laine",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 29.99,
      produitTaille: "Unique",
      produitCompo: "Laine",
      categorie: "Pull"
    },
    {
      produitRef: "PROD008",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 49.99,
      produitTaille: "34",
      produitCompo: "Coton",
      categorie: "Pantalons"
    },
    {
      produitRef: "PROD009",
      produitNom: "Blouson bomber",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 79.99,
      produitTaille: "XL",
      produitCompo: "Polyester",
      categorie: "Pull"
    },
    {
      produitRef: "PROD010",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 129.99,
      produitTaille: "M",
      produitCompo: "Cachemire",
      categorie: "Pull"
    },
    {
      produitRef: "PROD011",
      produitNom: "Jupe plissée",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 39.99,
      produitTaille: "38",
      produitCompo: "Polyester",
      categorie: "Pantalons"
    },
    {
      produitRef: "PROD012",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 34.99,
      produitTaille: "Unique",
      produitCompo: "Soie",
      categorie: "Lacoste"
    },
    {
      produitRef: "PROD013",
      produitNom: "Chemisier en soie",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 89.99,
      produitTaille: "S",
      produitCompo: "Soie",
      categorie: "Chemises"
    },
    {
      produitRef: "PROD014",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 24.99,
      produitTaille: "M",
      produitCompo: "Polyester",
      categorie: "Tee-shirt"
    },
    {
      produitRef: "PROD015",
      produitNom: "Robe de soirée",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 149.99,
      produitTaille: "40",
      produitCompo: "Polyester",
      categorie: "Costumes"
    },
    {
      produitRef: "PROD016",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 19.99,
      produitTaille: "Unique",
      produitCompo: "Coton",
      categorie: "Lacoste"
    },
    {
      produitRef: "PROD017",
      produitNom: "Sweat à capuche",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 54.99,
      produitTaille: "L",
      produitCompo: "Coton",
      categorie: "Pull"
    },
    {
      produitRef: "PROD018",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 49.99,
      produitTaille: "M",
      produitCompo: "Nylon",
      categorie: "Lacoste"
    },
    {
      produitRef: "PROD019",
      produitNom: "Blazer classique",
      produitImage: ["../../assets/img/434324409_122138643518191964_1332089378028437094_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 119.99,
      produitTaille: "52",
      produitCompo: "Polyester",
      categorie: "Costumes"
    },
    {
      produitRef: "PROD020",
      produitImage: ["../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg", "../../assets/img/434184115_122138643842191964_5638486375775067626_n.jpg"],
      produitPrix: 9.99,
      produitTaille: "39-42",
      produitCompo: "Coton",
      categorie: "Chaussures"
    }
  ]
}

}
