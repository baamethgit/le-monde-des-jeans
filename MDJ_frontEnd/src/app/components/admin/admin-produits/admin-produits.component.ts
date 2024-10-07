import { Component, inject, NgModule } from '@angular/core';
import { ProduitService } from '../../../services/produits/produit.service';
import { Produit } from '../../../models/produit';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { categorie } from '../../../models/categorie';
import { CategorieService } from '../../../services/categories/categorie.service';
import { spec } from 'node:test/reporters';

export const TAILLES = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' }
];

// compositions.ts
export const COMPO = [
  { value: 'coton', label: 'Coton' },
  { value: 'nilon', label: 'Nilon' }
];

// couleurs.ts
export const COULEUR = [
  { value: 'BL', label: 'Bleu' },
  { value: 'RD', label: 'Rouge' },
  { value: 'GR', label: 'Vert' },
  { value: 'YW', label: 'Jaune' },
  { value: 'BK', label: 'Noir' },
  { value: 'WH', label: 'Blanc' },
  { value: 'OR', label: 'Orange' },
  { value: 'PR', label: 'Pourpre' },
  { value: 'PK', label: 'Rose' },
  { value: 'GY', label: 'Gris' },
  { value: 'BR', label: 'Marron' }
];



@Component({
  selector: 'app-admin-produits',
  standalone: true,
  imports: [NgbPaginationModule, CommonModule, FormsModule, NgxFileDropModule, ReactiveFormsModule],
  templateUrl: './admin-produits.component.html',
  styleUrl: './admin-produits.component.scss'
})


export class AdminProduitsComponent {
private produitsService=inject(ProduitService)
private categoryService=inject(CategorieService)
produits:Produit[]=[];
category:categorie[]=[];
tailles=TAILLES
compo=COMPO
couleur=COULEUR
paginateProduits:Produit[]=[]
page:number=1;
pageSize:number=10;
collectionSize:number=0;
AddProductForm!:FormGroup;
formBuilder=inject(FormBuilder)
files: NgxFileDropEntry[] = [];
acceptedFilesType: string = '.png,.jpg,.jpeg';
previewUrls: string[] = [];

ngOnInit():void{
  this.loadProducts()
  this.categoryService.getAllCategories().subscribe({
    next:(data)=>{
      this.category=data;
      console.log(this.category)
    }
  })

  this.AddProductForm=this.formBuilder.group(
    {
      prix_produit:['',[Validators.required,Validators.pattern("^[0-9]*$"),]],
      stock_produit:['1',[Validators.pattern("^[0-9]*$"),]],
      categorySelect:['',[Validators.required]],
      nom_produit:[''],
      taille:[''],
      couleur:[''],
      composition:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
      special_checkbox:[],
      desc_produit:[],
    }
  )
  
}
loadProducts(){
  this.produitsService.getProducts().subscribe({
    next:(data)=>{
      this.produits=data;
      this.collectionSize=this.produits.length
      this.getProductsPagination()
    }
  })
}

getProductsPagination(){
  this.paginateProduits=this.produits.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
}


get imagesFormArray(): FormArray {
  return this.AddProductForm.get('images') as FormArray;
}


dropped(files: NgxFileDropEntry[]) {
  this.files = files;
  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imagesFormArray.push(this.formBuilder.control(file));
        this.previewFile(file);
      });
    }
  }
}

previewFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrls.push(reader.result as string);
  };
  reader.readAsDataURL(file);
  console.log(this.previewUrls)
}

removeImage(index: number) {
  this.imagesFormArray.removeAt(index);
  this.previewUrls.splice(index, 1);
}



// createProduct(){
//   if (this.AddProductForm.valid) {
//     const formData = new FormData();
//     let nom=this.AddProductForm.getRawValue().nom_produit
//     let prix=this.AddProductForm.getRawValue().prix_produit
//     let categorie=this.AddProductForm.getRawValue().categorySelect
//     let couleur=this.AddProductForm.getRawValue().couleur
//     let composition=this.AddProductForm.getRawValue().composition
//     let taille=this.AddProductForm.getRawValue().taille


//     console.log(categorie)
//   }else {
//     this.AddProductForm.markAllAsTouched();
//   }
// }

checkValue(event:any){
  console.log(event.target.checked)
}

createProduct() {
  if (this.AddProductForm.valid) {
    const formData = new FormData();
    
    formData.append('prix', this.AddProductForm.get('prix_produit')?.value);
    formData.append('categorie', this.AddProductForm.get('categorySelect')?.value);

    const nom = this.AddProductForm.get('nom_produit')?.value;
    const taille = this.AddProductForm.get('taille')?.value;
    const couleur = this.AddProductForm.get('couleur')?.value;
    const composition = this.AddProductForm.get('composition')?.value;
    const desc = this.AddProductForm.get('desc_produit')?.value;
    const stock = this.AddProductForm.get('stock_produit')?.value;
    const special = this.AddProductForm.get('special_checkbox')?.value ? 'true' : 'false';

    if (nom) formData.append('nom', nom);
    if (taille) formData.append('taille', taille);
    if (couleur) formData.append('couleur', couleur);
    if (composition) formData.append('composition', composition);
    if (desc) formData.append('description', desc);
    if (stock) formData.append('QuantiteStock', stock);
    formData.append('special', special);

    this.imagesFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.produitsService.CreateProduct(formData).subscribe({
      next: (data) => { 
        console.log('Enregistrement réussi !!! :', data);
        this.resetForm();
      },
      error: (error) => { console.log('Erreur lors de l\'enregistrement : ', error); }
    });
  } else {
    this.AddProductForm.markAllAsTouched();
  }
}


resetForm() {
  this.AddProductForm.reset();
  this.files = [];
  this.imagesFormArray.clear();
  this.previewUrls=[];
}
}


