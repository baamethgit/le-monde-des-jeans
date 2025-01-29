import {Component, inject,OnInit, TemplateRef} from '@angular/core';

import { ProduitService } from '../../../services/produits/produit.service';
import { Produit } from '../../../models/produit';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { categorie } from '../../../models/categorie';
import { CategorieService } from '../../../services/categories/categorie.service';
import { RouterLink } from '@angular/router';
import {finalize} from "rxjs";

export const TAILLES = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
  { value: '48L', label: '48L' },
  { value: '48M', label: '48M' },
];

// compositions.ts
export const COMPO = [
  { value: 'coton', label: 'Coton' },
  { value: 'nilon', label: 'Nilon' },
  { value: 'jean', label: 'Jean' },
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


export class AdminProduitsComponent implements OnInit{
private readonly produitsService=inject(ProduitService)
private readonly categoryService=inject(CategorieService)
private readonly modalService=inject(NgbModal)
produits:Produit[]=[];
category:categorie[]=[];
tailles=TAILLES
compo=COMPO
couleur=COULEUR
page:number=1;
pageSize:number=10;
collectionSize:number=0;
sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

AddProductForm!:FormGroup;
AddProductButtonLoading:boolean=false
UpdateProductForm!:FormGroup;
UpdateProductButtonLoading:boolean=false
AddCategoryForm!:FormGroup;
AddCategoryButtonLoading:boolean=false
UpdateCategoryForm!:FormGroup;
UpdateCategoryButtonLoading:boolean=false
DeleteProductButtonLoading:boolean=false
DeleteCatButtonLoadding:boolean=false

formBuilder=inject(FormBuilder)
files: NgxFileDropEntry[] = [];
acceptedFilesType: string = '.png,.jpg,.jpeg';
previewUrlsProd: string[] = [];
previewUrlsCat: string[] = [];
isPLoading:boolean = false;
isCLoading:boolean = false;
ngOnInit():void{
  this.loadProducts()
  this.loadCategories()

  this.AddProductForm=this.formBuilder.group(
    {
      prix_produit:['',[Validators.required,Validators.pattern("^[0-9]*$"),]],
      pointure_produit: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      stock_produit:['1',[Validators.pattern("^[0-9]*$"),]],
      categorySelect:['',[Validators.required]],
      nom_produit:[''],
      taille:[''],
      couleur:[''],
      composition:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
      special_checkbox:[],
      neuf_checkbox:[],
      desc_produit:[],
    }
  );

  this.UpdateProductForm=this.formBuilder.group(
    {
      prix_produit: ['', [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      pointure_produit: ['', [Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      stock_produit:['1',[Validators.pattern("^[0-9]*$"),]],
      categorySelect:['',[Validators.required]],
      nom_produit:[''],
      taille:[''],
      couleur:[''],
      composition:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
      special_checkbox:[],
      neuf_checkbox:[],
      desc_produit:[],
    }
  );

  this.AddCategoryForm=this.formBuilder.group(
    {
      nom_categorie: ['', [Validators.required, Validators.pattern("^[a-zA-Z_-]+$")]],
      desc_categorie:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    }
  )
  this.UpdateCategoryForm=this.formBuilder.group(
    {
      nom_categorie:['', [Validators.required, Validators.pattern("^[a-zA-Z_-]+$"),]],
      desc_categorie:[''],
      images: this.formBuilder.array([], [Validators.required, Validators.minLength(1)]),
    }
  )

}
loadProducts() {
  this.isPLoading = true;
  const ordering = this.sortColumn ? 
    (this.sortDirection === 'desc' ? '-' : '') + this.sortColumn : '';
    
  this.produitsService.getProductsAdmin(this.page, this.pageSize, ordering).pipe(
    finalize(() => this.isPLoading = false)
  ).subscribe({
    next: (data) => {
      this.produits = data.results;
      this.collectionSize = data.count;
    }
  });
}

sort(column: string) {
  if (this.sortColumn === column) {
    // Si on clique sur la même colonne, on inverse la direction
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // Nouvelle colonne, on met par défaut en ascendant
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
  this.loadProducts();
}

OnPageChange(page: number) {
  this.page = page;
  this.loadProducts();
}
loadCategories(){
  this.isCLoading = true;
  this.categoryService.getAllCategories().pipe(
    finalize(() => this.isCLoading = false)
  ).subscribe({
    next:(data)=>{
      this.category=data;
    }
  })
}
openSm(content: TemplateRef<any>) {
  this.modalService.open(content, { size: 'sm',centered: true });
}
openWindowCustomClass(content: TemplateRef<any>, categorie:categorie) {
  this.UpdateCategoryForm.patchValue({
    nom_categorie: categorie.nom,
    desc_categorie: categorie.description,
    image: categorie.image
  });
  // Réinitialiser les images
  this.imagesProdUpdateFormArray.clear();
  this.previewUrlsProd = [];
  this.files = [];

  // Charger les images existantes
  if (categorie.image) {
      // Convertir l'URL de l'image en File via fetch
      fetch(categorie.image)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          this.imagesProdUpdateFormArray.push(this.formBuilder.control(file));
          this.previewUrlsProd.push(categorie.image);
        }).catch();
  }
  this.modalService.open(content, { windowClass: 'dark-modal', centered:true });
}

openUpdateProductModal(content: TemplateRef<any>, product: Produit) {
  // Patcher les valeurs du formulaire
  this.UpdateProductForm.patchValue({
    nom_produit: product.nom,
    prix_produit: product.prix,
    pointure_produit: product.pointure,
    categorySelect: product.categorie_detail.id,
    taille: product.taille,
    couleur: product.couleur,
    composition: product.composition,
    stock_produit: product.QuantiteStock,
    special_checkbox: product.special,
    neuf_checkbox: product.neuf,
    desc_produit: product.description
  });

  // Réinitialiser les images
  this.imagesProdUpdateFormArray.clear();
  this.previewUrlsProd = [];
  this.files = [];

  // Charger les images existantes
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      // Convertir l'URL de l'image en File via fetch
      fetch(img.image)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
          this.imagesProdUpdateFormArray.push(this.formBuilder.control(file));
          this.previewUrlsProd.push(img.image);
        });
    });
  }

  this.modalService.open(content, { windowClass : "myCustomModalClass"});
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
        this.previewFileProd(file);
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
        this.previewFileCat(file);
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
        this.previewFileCat(file);
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
        this.previewFileProd(file);
      });
    }
  }
}

previewFileProd(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrlsProd.push(reader.result as string);
  };
  reader.readAsDataURL(file);
}

previewFileCat(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrlsCat.push(reader.result as string);
  };
  reader.readAsDataURL(file);
}


removeImageProd(index: number) {
  this.imagesProdFormArray.removeAt(index);
  this.previewUrlsProd.splice(index, 1);
}

removeImageCat(index: number) {
  this.imagesCategoryFormArray.removeAt(index);
  this.previewUrlsCat.splice(index, 1);
}
removeImageCatUpdate(index: number) {
  this.imagesCategoryFormArray.removeAt(index);
  this.previewUrlsCat.splice(index, 1);
}
removeImageProdUpdate(index: number) {
  this.imagesProdUpdateFormArray.removeAt(index);
  this.previewUrlsProd.splice(index, 1);
}

createProduct() {
  
  if (this.AddProductForm.valid) {
    this.AddProductButtonLoading = true;
    const formData = new FormData();

    formData.append('prix', this.AddProductForm.get('prix_produit')?.value);
    formData.append('categorie', this.AddProductForm.get('categorySelect')?.value);

    const nom = this.AddProductForm.get('nom_produit')?.value;
    const pointure = this.UpdateProductForm.get('pointure_produit')?.value;
    const taille = this.AddProductForm.get('taille')?.value;
    const couleur = this.AddProductForm.get('couleur')?.value;
    const composition = this.AddProductForm.get('composition')?.value;
    const desc = this.AddProductForm.get('desc_produit')?.value;
    const stock = this.AddProductForm.get('stock_produit')?.value;
    const special = this.AddProductForm.get('special_checkbox')?.value ? 'true' : 'false';
    const neuf = this.AddProductForm.get('neuf_checkbox')?.value ? 'true' : 'false';

    if (nom) formData.append('nom', nom);
    if (pointure) formData.append('pointure', pointure)
    if (taille) formData.append('taille', taille);
    if (couleur) formData.append('couleur', couleur);
    if (composition) formData.append('composition', composition);
    if (desc) formData.append('description', desc);
    if (stock) formData.append('QuantiteStock', stock);
    formData.append('special', special);
    formData.append('neuf', neuf);

    this.imagesProdFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.produitsService.CreateProduct(formData).subscribe({
      next: (data) => {
        this.resetFormProd();
        this.loadProducts()
        this.AddProductButtonLoading=false

      },
      error: (error) => {  }
    });
  } else {
    this.AddProductForm.markAllAsTouched();
  }
}

UpdateProduct(id:number) {
  
  if (this.UpdateProductForm.valid) {
    this.UpdateProductButtonLoading = true;
    const formData = new FormData();

    formData.append('prix', this.UpdateProductForm.get('prix_produit')?.value);
    formData.append('categorie', this.UpdateProductForm.get('categorySelect')?.value);

    const nom = this.UpdateProductForm.get('nom_produit')?.value;
    const pointure = this.UpdateProductForm.get('pointure_produit')?.value;
    const taille = this.UpdateProductForm.get('taille')?.value;
    const couleur = this.UpdateProductForm.get('couleur')?.value;
    const composition = this.UpdateProductForm.get('composition')?.value;
    const desc = this.UpdateProductForm.get('desc_produit')?.value;
    const stock = this.UpdateProductForm.get('stock_produit')?.value;
    const special = this.UpdateProductForm.get('special_checkbox')?.value ? 'true' : 'false';
    const neuf = this.UpdateProductForm.get('neuf_checkbox')?.value ? 'true' : 'false';

    if (nom) formData.append('nom', nom);
    if (pointure) formData.append('pointure', pointure)
    if (taille) formData.append('taille', taille);
    if (couleur) formData.append('couleur', couleur);
    if (composition) formData.append('composition', composition);
    if (desc) formData.append('description', desc);
    if (stock) formData.append('QuantiteStock', stock);
    formData.append('special', special);
    formData.append('neuf', neuf);

    this.imagesProdUpdateFormArray.controls.forEach((control) => {
      formData.append('image', control.value);
    });

    this.produitsService.updateProduct(id,formData).subscribe({
      next: (data) => {
        this.loadProducts()
        this.resetFormProdUpdate();
        this.UpdateProductButtonLoading = false
      }
    });
  } else {
    this.UpdateProductForm.markAllAsTouched();
  }
}

createCategory() {
  
  if (this.AddCategoryForm.valid) {
    this.AddCategoryButtonLoading = true;
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
        this.loadCategories();
        this.resetFormCat();
        this.AddCategoryButtonLoading = false
      }
    });
  } else {
    this.AddCategoryForm.markAllAsTouched();
  }
}


resetFormProd() {
  // Reset form while preserving defaults
  this.AddProductForm.reset({
    prix_produit: '',
    pointure_produit: '',
    stock_produit: '1',
    categorySelect: '',
    nom_produit: '',
    taille: '',
    couleur: '',
    composition: '',
    special_checkbox: false,
    desc_produit: ''
  });
  this.files = [];
  this.imagesProdFormArray.clear();
  this.previewUrlsProd = [];
  this.AddProductForm.markAsUntouched();
}

resetFormProdUpdate() {
  this.UpdateProductForm.reset({
    prix_produit: '',
    pointure_produit: '',
    stock_produit: '1',
    categorySelect: '',
    nom_produit: '',
    taille: '',
    couleur: '',
    composition: '',
    special_checkbox: false,
    desc_produit: ''
  });
  this.files = [];
  this.imagesProdUpdateFormArray.clear();
  this.previewUrlsProd = [];
  this.UpdateProductForm.markAsUntouched();
}

resetFormCat() {
  this.AddCategoryForm.reset({
    nom_categorie: '',
    desc_categorie: ''
  });
  this.files = [];
  this.imagesCategoryFormArray.clear();
  this.previewUrlsCat = [];
  this.AddCategoryForm.markAsUntouched();
}

resetFormUpdateCat() {
  this.UpdateCategoryForm.reset({
    nom_categorie: '',
    desc_categorie: ''
  });
  this.files = [];
  this.imagesCategoryUpdateFormArray.clear();
  this.previewUrlsCat = [];
  this.UpdateCategoryForm.markAsUntouched();
}

deleteProd(id:number){
  this.DeleteProductButtonLoading=true
  this.produitsService.deleteProduct(id).subscribe({
    next:(data)=>{
      this.loadProducts();
      this.DeleteProductButtonLoading=false
    }
  })
}

deleteCat(id:number){
  this.DeleteCatButtonLoadding=true
  this.categoryService.deleteCategory(id).subscribe({
    next:(data)=>{
      this.loadCategories();
      this.DeleteCatButtonLoadding=false;
    }
  })
}

UpdateCat(id:number){
  
  if (this.UpdateCategoryForm.valid) {
    this.UpdateCategoryButtonLoading = true
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
        this.loadCategories()
        this.resetFormUpdateCat();
        this.UpdateCategoryButtonLoading = false;
      }
    });
  } else {
    this.UpdateCategoryForm.markAllAsTouched();
  }
}

}


