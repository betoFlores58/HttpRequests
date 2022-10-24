import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Subject, throwError } from 'rxjs';
import { Product } from '../model/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  isFetching: boolean = false;

  createProduct(products: { pName: string; desc: string; price: string }) {
    this.http
      .post(
        'https://angular-requests-2e88c-default-rtdb.firebaseio.com/products.json123',
        products
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          this.error.next(err.message);
        }
      );
  }

  fetctProduct() {
    return this.http
      .get<Product>(
        'https://angular-requests-2e88c-default-rtdb.firebaseio.com/products.json'
      )
      .pipe(
        map((res) => {
          const products = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              products.push({ ...res[key], id: key });
            }
          }
          return products;
        }), catchError((err) => {
            return throwError(err);
        })
      );
  }
  deleteProd(id: string) {
    this.http
      .delete(
        'https://angular-requests-2e88c-default-rtdb.firebaseio.com/products/' +
          id +
          '.json'
      )
      .subscribe();
  }

  deleteALlProds() {
    this.http
      .delete(
        'https://angular-requests-2e88c-default-rtdb.firebaseio.com/products.json'
      )
      .subscribe();
  }
  updateProduct(id: string, value: Product) {
    this.http
      .put(
        'https://angular-requests-2e88c-default-rtdb.firebaseio.com/products/' +
          id +
          '.json',
        value
      )
      .subscribe();
  }
}