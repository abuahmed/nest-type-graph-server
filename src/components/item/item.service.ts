import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from 'src/db/enums/categoryType';
import { Category } from 'src/db/models/category.entity';
import { Item } from 'src/db/models/item.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { CategoryInput } from '../dto/category.input';
import { DelResult } from '../user/dto/user.dto';
import { CreateItemInput } from './dto/create-item.input';
import { CategoryArgs, ItemArgs } from './dto/item.args';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(itemArgs: ItemArgs): Promise<Item[]> {
    const { searchText, skip, take, categoryId, uomId } = itemArgs;

    let itemsQB = this.itemRepository
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.itemCategory', 'ItemCategory')
      .innerJoinAndSelect('i.unitOfMeasure', 'UOM');
    if (searchText && searchText.length > 0) {
      itemsQB = itemsQB.andWhere(`i.displayName Like("%${searchText}%")`);
    }
    if (categoryId) {
      itemsQB = itemsQB.andWhere('ItemCategory.id = :categoryId', { categoryId });
    }
    if (uomId) {
      itemsQB = itemsQB.andWhere('UOM.id = :uomId', { uomId });
    }
    return await itemsQB.take(take).skip(skip).getMany();
  }

  async findOne(id: number): Promise<Item> {
    return await this.itemRepository.findOne(
      { id },
      { relations: ['itemCategory', 'unitOfMeasure'] },
    );
  }

  async createUpdate(createItemInput: CreateItemInput): Promise<Item> {
    let { itemCategory, unitOfMeasure } = createItemInput;
    try {
      await validate(displaySchema, { displayName: createItemInput.displayName });

      const item = createItemInput.id
        ? await this.itemRepository.preload(createItemInput)
        : this.itemRepository.create(createItemInput);

      if (!itemCategory.id)
        itemCategory = await this.categoryRepository.findOne({
          displayName: 'Default',
        });
      if (!unitOfMeasure.id)
        unitOfMeasure = await this.categoryRepository.findOne({
          displayName: 'Pcs',
        });

      itemCategory.type = CategoryType.ItemCategory;
      unitOfMeasure.type = CategoryType.UnitOfMeasure;
      const cat = itemCategory.id
        ? await this.categoryRepository.preload(itemCategory)
        : this.categoryRepository.create(itemCategory);

      const uom = unitOfMeasure.id
        ? await this.categoryRepository.preload(unitOfMeasure)
        : this.categoryRepository.create(unitOfMeasure);

      item.itemCategory = cat;
      item.unitOfMeasure = uom;

      const response = await this.itemRepository.save(item);

      return response;
    } catch (err) {
      //console.log(err);
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
  async remove(id: number): Promise<DelResult> {
    const del = await this.itemRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }

  async getCategories(categoryArgs: CategoryArgs): Promise<Array<Category>> {
    const { searchText, skip, take, type } = categoryArgs;
    let categoriesQB = this.categoryRepository
      .createQueryBuilder('c')
      .where('c.type = :type', { type });
    if (searchText && searchText.length > 0) {
      categoriesQB = categoriesQB.andWhere(`c.displayName Like("%${searchText}%")`);
    }
    if (take === -1) return await categoriesQB.getMany();
    return await categoriesQB.take(take).skip(skip).getMany();
  }

  async createItemCategory(input: CategoryInput): Promise<Category> {
    try {
      await validate(displaySchema, { displayName: input.displayName });

      const item = input.id
        ? await this.categoryRepository.preload(input)
        : this.categoryRepository.create(input);

      const response = await this.categoryRepository.save(item);

      return response;
    } catch (err) {
      //console.log(err);
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

  async removeCategory(id: number): Promise<DelResult> {
    const del = await this.categoryRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }
}
