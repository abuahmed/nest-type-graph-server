import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from 'src/db/enums/categoryType';
import { Category } from 'src/db/models/category.entity';
import { Item } from 'src/db/models/item.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createUpdate(createItemInput: CreateItemInput): Promise<Item> {
    let { itemCategory, unitOfMeasure } = createItemInput;
    try {
      await validate(displaySchema, { displayName: createItemInput.displayName });

      const item = createItemInput.id
        ? await this.itemRepository.preload(createItemInput)
        : this.itemRepository.create(createItemInput);

      if (!itemCategory)
        itemCategory = await this.categoryRepository.findOne({
          type: CategoryType.ItemCategory,
          displayName: 'Default',
        });
      if (!unitOfMeasure)
        unitOfMeasure = await this.categoryRepository.findOne({
          type: CategoryType.UnitOfMeasure,
          displayName: 'Pcs',
        });

      const cat = itemCategory.id
        ? await this.categoryRepository.preload(itemCategory)
        : this.categoryRepository.create(itemCategory);

      const uom = unitOfMeasure.id
        ? await this.categoryRepository.preload(unitOfMeasure)
        : this.categoryRepository.create(unitOfMeasure);

      item.itemCategory = cat;
      item.unitOfMeasure = uom;
      //console.log(item);

      const response = await this.itemRepository.save(item);

      return response;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
