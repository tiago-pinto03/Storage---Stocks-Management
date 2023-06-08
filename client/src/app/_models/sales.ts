import { Employee } from "./employee";
import { Client } from "./client";
import { Product } from "./product";

export class Sales {
  id?: string;
  price?: number;
  quantity?: number;
  product?: Product;
  client?: Client;
  employee?: Employee;
}
