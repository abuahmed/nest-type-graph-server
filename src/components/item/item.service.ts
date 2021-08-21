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

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const { itemCategory, unitOfMeasure } = createItemInput;
    try {
      //await validate(displaySchema, createItemInput);
      const found = await this.itemRepository.findOne({ displayName: createItemInput.displayName });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Item already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const item = this.itemRepository.create({ displayName: createItemInput.displayName });
      if (!itemCategory.id) {
        const cat = itemCategory
          ? this.categoryRepository.create(itemCategory)
          : await this.categoryRepository.findOne({
              type: CategoryType.ItemCategory,
              displayName: 'Default',
            });
        item.itemCategory = cat;
      } else {
        item.itemCategory = await this.categoryRepository.findOne({
          id: itemCategory.id,
        });
      }
      if (!unitOfMeasure.id) {
        const uom = unitOfMeasure
          ? this.categoryRepository.create(unitOfMeasure)
          : await this.categoryRepository.findOne({
              type: CategoryType.UnitOfMeasure,
              displayName: 'Pcs',
            });
        item.unitOfMeasure = uom;
      } else {
        item.unitOfMeasure = await this.categoryRepository.findOne({
          id: unitOfMeasure.id,
        });
      }
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
