import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { OrderedEntity } from 'src/interfaces/ordered-entity';
import { Connection, EntityTarget } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection('default')
    public connection: Connection,
  ) {}

  async upsertItems(
    items: Array<any>,
    model: any,
    args: Array<string>,
    chunkSize = 5000,
  ) {
    const result = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const endIndex =
        i + chunkSize < items.length ? i + chunkSize : items.length;
      result.push(
        await this.connection
          .getRepository(model)
          .upsert(items.slice(i, endIndex), args),
      );
    }
    return result;
  }

  async reoder(
    target: EntityTarget<OrderedEntity>,
    oldOrder: number,
    newOrder: number,
  ) {
    await this.connection
      .createQueryBuilder()
      .update(target)
      .set({ order: () => '"order" + 1' })
      .where('order >= :newOrder', { newOrder })
      .execute();
    return await this.connection
      .createQueryBuilder()
      .update(target)
      .set({ order: newOrder })
      .where('order = :oldOrder', {
        oldOrder: oldOrder > newOrder ? oldOrder + 1 : oldOrder,
      })
      .execute();
  }
}
