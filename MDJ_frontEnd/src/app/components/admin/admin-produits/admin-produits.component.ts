import { Component, inject, NgModule, TemplateRef } from '@angular/core';
import { ProduitService } from '../../../services/produits/produit.service';
import { Produit } from '../../../models/produit';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { categorie } from '../../../models/categorie';
import { CategorieService } from '../../../services/categories/categorie.service';
import { spec } from 'node:test/reporters';
import { RouterLink } from '@angular/router';

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
  imports: [NgbPaginationModule, CommonModule, FormsModule, NgxFileDropModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-produits.component.html',
  styleUrl: './admin-produits.component.scss'
})


export class AdminProduitsComponent {
private produitsService=inject(ProduitService)
private categoryService=inject(CategorieService)
private modalService=inject(NgbModal)
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
UpdateProductForm!:FormGroup;
AddCategoryForm!:FormGroup;
UpdateCategoryForm!:FormGroup;

formBuilder=inject(FormBuilder)
files: NgxFileDropEntry[] = [];
acceptedFilesType: string = '.png,.jpg,.jpeg';
previewUrls: string[] = [];

ngOnInit():void{
  this.loadProducts()
  this.loadCategories()

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
  );

  this.UpdateProductForm=this.formBuilder.group(
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
  );

  this.AddCategoryForm=this.formBuilder.group(
    {
      nom_categorie:['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"),]],
      desc_categorie:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    }
  )
  this.UpdateCategoryForm=this.formBuilder.group(
    {
      nom_categorie:['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"),]],
      desc_categorie:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
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
loadCategories(){
  this.categoryService.getAllCategories().subscribe({
    next:(data)=>{
      this.category=data;
    }
  })
}
openSm(content: TemplateRef<any>) {
  this.modalService.open(content, { size: 'sm',centered: true });
}
openWindowCustomClass(content: TemplateRef<any>) {
  this.modalService.open(content, { windowClass: 'dark-modal', centered:true });
}

openUpdateProductModal(content: TemplateRef<any>, product: Produit) {
  this.UpdateProductForm.patchValue({
    nom_produit: product.nom,
    prix_produit: product.prix,
    categorySelect: product.categorie_detail.id,
    taille: product.taille,
    couleur: product.couleur,
    composition: product.composition,
    stock_produit: product.QuantiteStock,
    special_checkbox: product.special,
    desc_produit: product.Description
  });

  // Réinitialiser les images
  this.imagesProdUpdateFormArray.clear();
  this.previewUrls = [];

  // Afficher les images existantes si nécessaire
  // product.images.forEach(image => {
  //   this.previewUrls.push(image.url);
  // });

  this.modalService.open(content, { size: 'lg', centered: true });
}

getProductsPagination(){
  this.paginateProduits=this.produits.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
}


get imagesProdFormArray(): FormArray {
  return this.AddProductForm.get('images') as FormArray;
}

get imagesProdUpdateFormArray(): FormArray {
  return this.UpdateProductForm.get('images') as FormArray;
}

get imagesCategoryFormArray(): FormArray {
  return this.AddCategoryForm.get('images') as FormArray;
}

get imagesCategoryUpdateFormArray(): FormArray {
  return this.UpdateCategoryForm.get('images') as FormArray;
}


droppedProd(files: NgxFileDropEntry[]) {
  this.files = files;
  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imagesProdFormArray.push(this.formBuilder.control(file));
        this.previewFile(file);
      });
    }
  }
}

droppedCat(files: NgxFileDropEntry[]) {
  this.files = files;
  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imagesCategoryFormArray.push(this.formBuilder.control(file));
        this.previewFile(file);
      });
    }
  }
}

droppedCatUpdate(files: NgxFileDropEntry[]) {
  this.files = files;
  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imagesCategoryUpdateFormArray.push(this.formBuilder.control(file));
        this.previewFile(file);
      });
    }
  }
}
droppedProdUpdate(files: NgxFileDropEntry[]) {
  this.files = files;
  for (const droppedFile of files) {
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imagesProdUpdateFormArray.push(this.formBuilder.control(file));
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
}

removeImageProd(index: number) {
  this.imagesProdFormArray.removeAt(index);
  this.previewUrls.splice(index, 1);
}

removeImageCat(index: number) {
  this.imagesCategoryFormArray.removeAt(index);
  this.previewUrls.splice(index, 1);
}
removeImageCatUpdate(index: number) {
  this.imagesCategoryFormArray.removeAt(index);
  this.previewUrls.splice(index, 1);
}
removeImageProdUpdate(index: number) {
  this.imagesProdUpdateFormArray.removeAt(index);
  this.previewUrls.splice(index, 1);
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

    this.imagesProdFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.produitsService.CreateProduct(formData).subscribe({
      next: (data) => { 
        console.log('Enregistrement réussi !!! :', data);
        this.resetFormProd();
        this.loadProducts()
      },
      error: (error) => { console.log('Erreur lors de l\'enregistrement : ', error); }
    });
  } else {
    this.AddProductForm.markAllAsTouched();
  }
}

UpdateProduct(id:number) {
  if (this.UpdateProductForm.valid) {
    const formData = new FormData();
    
    formData.append('prix', this.UpdateProductForm.get('prix_produit')?.value);
    formData.append('categorie', this.UpdateProductForm.get('categorySelect')?.value);

    const nom = this.UpdateProductForm.get('nom_produit')?.value;
    const taille = this.UpdateProductForm.get('taille')?.value;
    const couleur = this.UpdateProductForm.get('couleur')?.value;
    const composition = this.UpdateProductForm.get('composition')?.value;
    const desc = this.UpdateProductForm.get('desc_produit')?.value;
    const stock = this.UpdateProductForm.get('stock_produit')?.value;
    const special = this.UpdateProductForm.get('special_checkbox')?.value ? 'true' : 'false';

    if (nom) formData.append('nom', nom);
    if (taille) formData.append('taille', taille);
    if (couleur) formData.append('couleur', couleur);
    if (composition) formData.append('composition', composition);
    if (desc) formData.append('description', desc);
    if (stock) formData.append('QuantiteStock', stock);
    formData.append('special', special);

    this.imagesProdUpdateFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.produitsService.updateProduct(id,formData).subscribe({
      next: (data) => { 
        console.log('MAJ réussie !!! :', data);
        this.loadProducts()
        this.resetFormProdUpdate();
        
      },
      error: (error) => { console.log('Erreur lors de l\'enregistrement : ', error); }
    });
  } else {
    this.UpdateProductForm.markAllAsTouched();
  }
}

createCategory() {
  if (this.AddCategoryForm.valid) {
    const formData = new FormData();
    
    formData.append('nom', this.AddCategoryForm.get('nom_categorie')?.value);
    formData.append('slug', this.AddCategoryForm.get('nom_categorie')?.value)

    const desc = this.AddCategoryForm.get('desc_categorie')?.value;

    if (desc) formData.append('description', desc);

    this.imagesCategoryFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.categoryService.createCategory(formData).subscribe({
      next: (data) => { 
        console.log('Enregistrement réussi !!! :', data);
        this.loadCategories();
        this.resetFormCat();
      },
      error: (error) => { console.log('Erreur lors de l\'enregistrement : ', error); }
    });
  } else {
    this.AddCategoryForm.markAllAsTouched();
  }
}


resetFormProd() {
  this.AddProductForm.reset();
  this.files = [];
  this.imagesProdFormArray.clear();
  this.previewUrls=[];
}
resetFormProdUpdate() {
  this.AddProductForm.reset();
  this.files = [];
  this.imagesProdFormArray.clear();
  this.previewUrls=[];
}

resetFormCat() {
  this.AddCategoryForm.reset();
  this.files = [];
  this.imagesCategoryFormArray.clear();
  this.previewUrls=[];
}

resetFormUpdateCat() {
  this.UpdateCategoryForm.reset();
  this.files = [];
  this.imagesCategoryUpdateFormArray.clear();
  this.previewUrls=[];
}

deleteProd(id:number){
  this.produitsService.deleteProduct(id).subscribe({
    next:(data)=>{console.log('Delete product done : ', data);
      this.loadProducts();
    },
    error:(error)=>{console.log('erreur lors de la suppression : ', error)}
  })
}

deleteCat(id:number){
  this.categoryService.deleteCategory(id).subscribe({
    next:(data)=>{console.log('Delete category done : ', data);
      this.loadCategories();
    },
    error:(error)=>{console.log('erreur lors de la suppression : ', error)}
  })
}

UpdateCat(id:number){
  if (this.UpdateCategoryForm.valid) {
    const formData = new FormData();
    
    formData.append('nom', this.UpdateCategoryForm.get('nom_categorie')?.value);
    formData.append('slug', this.UpdateCategoryForm.get('nom_categorie')?.value)

    const desc = this.UpdateCategoryForm.get('desc_categorie')?.value;

    if (desc) formData.append('description', desc);

    this.imagesCategoryUpdateFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.categoryService.updateCategory(id,formData).subscribe({
      next: (data) => { 
        console.log('Mise a jour réussie !!! :', data);
        this.loadCategories()
        this.resetFormUpdateCat();
      },
      error: (error) => { console.log('Erreur lors de la mise a jour : ', error); }
    });
  } else {
    this.UpdateCategoryForm.markAllAsTouched();
  }
}

}


