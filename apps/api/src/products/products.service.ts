import { Injectable } from '@nestjs/common';
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  list(): Promise<Product[]> {
    return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(input: { title: string; priceCents: number; sku?: string | null; inventory?: number; status?: string }) {
    return prisma.product.create({
      data: {
        title: input.title,
        priceCents: input.priceCents,
        sku: input.sku ?? null,
        inventory: input.inventory ?? 0,
        status: input.status ?? 'ACTIVE',
      },
    });
  }

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}
