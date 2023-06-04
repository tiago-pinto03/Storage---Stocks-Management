import { Supplier } from "./supplier";

export class Product {
  id?: string;
  name?: string;
  unitPrice?: number;
  quantity?: number;
  available?: boolean;
  supplier?: Supplier;
}
