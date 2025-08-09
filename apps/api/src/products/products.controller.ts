import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  async create(
    @Body()
    body: { title: string; priceCents: number; sku?: string; inventory?: number; status?: string }
  ) {
    if (!body?.title || typeof body.priceCents !== 'number') {
      return { error: 'title and priceCents are required' };
    }
    const created = await this.svc.create(body);
    return { ok: true, created };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.svc.delete(id);
    return { ok: true };
  }
}
