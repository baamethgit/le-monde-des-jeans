import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { detailProduitResolver } from './detail-produit.resolver';

describe('detailProduitResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => detailProduitResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
