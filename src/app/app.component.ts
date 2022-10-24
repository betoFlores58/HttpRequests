import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Product } from './model/products';
import { ProductService } from './Service/product.sevice';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularHttpRequest';

  allProducts: Product[] = [];
  isFetching: boolean = false;
  @ViewChild('productsForm') form: NgForm;
  editMode: boolean = false;
  currentProd: string;
  errorMsg: string = null;
  errorSub: Subscription;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchMethod();
    this.errorSub = this.productService.error.subscribe((message)=>{
      this.errorMsg = message;
    })
  }

  onProductsFetch() {
    this.fetchMethod();
  }

  onProductCreate(products: { pName: string; desc: string; price: string }) {
    if (!this.editMode) {
      this.productService.createProduct(products);
    }else
      this.productService.updateProduct(this.currentProd,products);
  }

  private fetchMethod() {
    this.isFetching = true;
    this.productService.fetctProduct().subscribe((products) => {
      this.allProducts = products;
      this.isFetching = false;
    },(err) =>{
      this.errorMsg = err.message;  
    });
  }
  onEditProduct(id: string){
    this.currentProd = id;
    let currentProduct = this.allProducts.find((p) => {return p.id === id})
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price,
    });
    this.editMode = true;
  }
  deleteProduct(id: string) {
    this.productService.deleteProd(id);
  }
  deleteAllProduct() {
    this.productService.deleteALlProds();
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}

