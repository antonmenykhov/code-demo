import {
  DataSource,
  DeepPartial,
  EntityTarget,
  Repository,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';

export default class DefaultCrud<
  Entity extends { id: number },
  CreateDto extends DeepPartial<Entity>,
  UpdateDto extends DeepPartial<Entity>,
> {
  constructor(entity: EntityTarget<Entity>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }
  repository: Repository<Entity>;

  async create(createDto: CreateDto) {
    return this.repository.save(createDto);
  }

  async update(id: number, updateDto: UpdateDto) {
    return this.repository.save({ ...updateDto, id });
  }

  async remove(id: number) {
    return this.repository.softDelete(id);
  }

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
    });
  }
}
