/**
 * Contrato del almacén de productos.
 * El comportamiento lo definen los tests de tests/practica-productos.
 * Implementen los métodos. No cambien las firmas ni los códigos de ProductError.
 */

import { randomUUID } from "crypto";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  name: string;
  sku: string;
  price: number;
  stock?: number;
  category?: string | null;
};

export type UpdateProductInput = {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  category?: string | null;
  active?: boolean;
};

export type ListProductsQuery = {
  search?: string;
  category?: string;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductErrorCode = "VALIDATION" | "NOT_FOUND" | "DUPLICATE_SKU" | "INSUFFICIENT_STOCK";

export class ProductError extends Error {
  readonly code: ProductErrorCode;

  constructor(code: ProductErrorCode, message: string) {
    super(message);
    this.name = "ProductError";
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function pending(method: string): never {
  throw new Error(`ProductStore.${method} no está implementado`);
}

const SKU_REGEX = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

function cloneProduct(product: Product): Product {
  return {
    ...product,
    createdAt: new Date(product.createdAt),
    updatedAt: new Date(product.updatedAt),
  };
}

function normalizeName(name: string): string {
  if (typeof name !== "string") {
    throw new ProductError("VALIDATION", "Nombre inválido");
  }

  const value = name.trim();

  if (value.length < 1 || value.length > 80) {
    throw new ProductError("VALIDATION", "Nombre inválido");
  }

  return value;
}

function normalizeSku(sku: string): string {
  if (typeof sku !== "string") {
    throw new ProductError("VALIDATION", "Sku inválido");
  }

  const value = sku.trim().toUpperCase();

  if (
    value.length < 2 ||
    value.length > 32 ||
    !SKU_REGEX.test(value)
  ) {
    throw new ProductError("VALIDATION", "Sku inválido");
  }

  return value;
}

function validatePrice(price: number): number {
  if (
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    throw new ProductError("VALIDATION", "Precio inválido");
  }

  return price;
}

function validateStock(stock: number): number {
  if (
    typeof stock !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    throw new ProductError("VALIDATION", "Stock inválido");
  }

  return stock;
}

function normalizeCategory(
  category?: string | null,
): string | null {
  if (category == null) {
    return null;
  }

  if (typeof category !== "string") {
    throw new ProductError("VALIDATION", "Categoría inválida");
  }

  const value = category.trim();

  return value === "" ? null : value;
}

export class ProductStore {
  private products = new Map<string, Product>();

  create(input: CreateProductInput): Product {
  const name = normalizeName(input.name);
  const sku = normalizeSku(input.sku);
  const price = validatePrice(input.price);
  const stock = validateStock(input.stock ?? 0);
  const category = normalizeCategory(input.category);

  for (const product of this.products.values()) {
    if (product.sku === sku) {
      throw new ProductError(
        "DUPLICATE_SKU",
        "SKU duplicado",
      );
    }
  }

  const now = new Date();

  const product: Product = {
    id: randomUUID(),
    name,
    sku,
    price,
    stock,
    category,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  this.products.set(product.id, product);

  return cloneProduct(product);
}

  getById(id: string): Product | null {
  const product = this.products.get(id);

  if (!product) {
    return null;
  }

  return cloneProduct(product);
}

  getBySku(sku: string): Product | null {
  if (typeof sku !== "string") {
    return null;
  }

  const normalized = sku.trim().toUpperCase();

  if (!normalized) {
    return null;
  }

  for (const product of this.products.values()) {
    if (product.sku === normalized) {
      return cloneProduct(product);
    }
  }

  return null;
}

  list(query?: ListProductsQuery): Product[] {
  let products = [...this.products.values()];

  if (query) {
    const { search, category, active, minPrice, maxPrice } = query;

    if (minPrice !== undefined) {
      if (
        typeof minPrice !== "number" ||
        !Number.isFinite(minPrice) ||
        minPrice < 0
      ) {
        throw new ProductError(
          "VALIDATION",
          "Rango inválido",
        );
      }
    }

    if (maxPrice !== undefined) {
      if (
        typeof maxPrice !== "number" ||
        !Number.isFinite(maxPrice) ||
        maxPrice < 0
      ) {
        throw new ProductError(
          "VALIDATION",
          "Rango inválido",
        );
      }
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new ProductError(
        "VALIDATION",
        "Rango inválido",
      );
    }

    if (search?.trim()) {
  const text = search.trim().toLowerCase();

  products = products.filter((p) =>
    p.name.toLowerCase().includes(text),
  );
}


    if (category?.trim()) {
  const cat = category.trim().toLowerCase();

  products = products.filter(
    (p) => p.category?.trim().toLowerCase() === cat,
  );
}

    if (active !== undefined) {
      products = products.filter(
        (p) => p.active === active,
      );
    }

    if (minPrice !== undefined) {
      products = products.filter(
        (p) => p.price >= minPrice,
      );
    }

    if (maxPrice !== undefined) {
      products = products.filter(
        (p) => p.price <= maxPrice,
      );
    }
  }

  products.sort((a, b) => {
    const byName = a.name.localeCompare(
      b.name,
      "es",
      { sensitivity: "base" },
    );

    if (byName !== 0) {
      return byName;
    }

    return a.sku.localeCompare(b.sku);
  });

  return products.map(cloneProduct);
}

  update(id: string, patch: UpdateProductInput): Product {
  const current = this.products.get(id);

  if (!current) {
    throw new ProductError(
      "NOT_FOUND",
      "Producto no encontrado",
    );
  }

  if (Object.keys(patch).length === 0) {
    return cloneProduct(current);
  }

  const updated: Product = {
    ...current,
  };

  if (patch.name !== undefined) {
    updated.name = normalizeName(patch.name);
  }

  if (patch.sku !== undefined) {
    const sku = normalizeSku(patch.sku);

    for (const product of this.products.values()) {
      if (
        product.id !== id &&
        product.sku === sku
      ) {
        throw new ProductError(
          "DUPLICATE_SKU",
          "SKU duplicado",
        );
      }
    }

    updated.sku = sku;
  }

  if (patch.price !== undefined) {
    updated.price = validatePrice(patch.price);
  }

  if (patch.stock !== undefined) {
    updated.stock = validateStock(patch.stock);
  }

  if (patch.category !== undefined) {
    updated.category = normalizeCategory(
      patch.category,
    );
  }

  if (patch.active !== undefined) {
    if (typeof patch.active !== "boolean") {
      throw new ProductError(
        "VALIDATION",
        "Activo inválido",
      );
    }

    updated.active = patch.active;
  }

  updated.updatedAt = new Date();

  this.products.set(id, updated);

  return cloneProduct(updated);
}

  remove(id: string): boolean {
  return this.products.delete(id);
}

  adjustStock(id: string, delta: number): Product {
  const product = this.products.get(id);

  if (!product) {
    throw new ProductError(
      "NOT_FOUND",
      "Producto no encontrado",
    );
  }

  if (
    typeof delta !== "number" ||
    !Number.isInteger(delta) ||
    delta === 0
  ) {
    throw new ProductError(
      "VALIDATION",
      "Delta inválido",
    );
  }

  const nextStock = product.stock + delta;

  if (nextStock < 0) {
    throw new ProductError(
      "INSUFFICIENT_STOCK",
      "Stock insuficiente",
    );
  }

  const updated: Product = {
    ...product,
    stock: nextStock,
    updatedAt: new Date(),
  };

  this.products.set(id, updated);

  return cloneProduct(updated);
}
}
