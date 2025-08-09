import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Controller('___seed')
export class SeedController {
  @Get()
  async run() {
    const p = await prisma.product.create({
      data: {
        title: 'Heavyweight Oatmeal Hoodie',
        priceCents: 12000,
        sku: 'HD-OAT-001',
        status: 'ACTIVE',
        inventory: 42,
      },
    });
    return { ok: true, created: p };
  }
}
