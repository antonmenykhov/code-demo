import { DataSource, DeepPartial, EntityTarget, Repository } from 'typeorm';

export class DefaultCrud<
  Entity extends {
    id: number;
  },
  CreateDto extends DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity>,
> {
  constructor(target: EntityTarget<Entity>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(target);
  }

  readonly repository: Repository<Entity>;

  create(createDto: CreateDto) {
    return this.repository.save(createDto);
  }

  update(id: number, createDto: UpdateDto) {
    return this.repository.save({ ...createDto, id });
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    // @ts-ignore
    return this.repository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.repository.softDelete(id);
  }
}
