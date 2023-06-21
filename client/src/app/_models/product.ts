import { Category } from "./category";
import { Supplier } from "./supplier";

export class Product {
  id?: string;
  name?: string;
  unitPrice?: number;
  quantity?: number;
  category?: Category;
  available?: boolean;
  supplier?: Supplier;
}
