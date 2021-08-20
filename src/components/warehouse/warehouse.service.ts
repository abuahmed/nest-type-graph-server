import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryType } from 'src/db/enums/categoryType';
import { Address } from 'src/db/models/address.entity';
import { Category } from 'src/db/models/category.entity';
import { Client } from 'src/db/models/client.entity';
import { Inventory } from 'src/db/models/inventory.entity';
import { Item } from 'src/db/models/item.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { DisplayInput } from '../user/dto/user.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find();
  }

  async create(createItemDto: DisplayInput): Promise<Warehouse> {
    const { displayName } = createItemDto;
    try {
      await validate(displaySchema, createItemDto);
      const found = await this.warehouseRepository.findOne({ displayName });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Warehouse already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const client = this.clientRepository.create({ displayName });
      client.address = this.addressRepository.create({ country: 'Ethiopia', city: 'Addis Ababa' });
      const organization = this.organizationRepository.create({ displayName });
      organization.client = client;
      organization.address = this.addressRepository.create({
        country: 'Ethiopia',
        city: 'Addis Ababa',
      });

      const warehouse = this.warehouseRepository.create({ displayName });
      warehouse.organization = organization;
      warehouse.address = this.addressRepository.create({
        country: 'Ethiopia',
        city: 'Addis Ababa',
      });
      const response = await this.warehouseRepository.save(warehouse);
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

  async createItem(createItemDto: Item): Promise<Item> {
    let { category, unitOfMeasure } = createItemDto;
    try {
      await validate(displaySchema, createItemDto);
      const found = await this.itemRepository.findOne({ displayName: createItemDto.displayName });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Item already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!category) {
        category = await this.categoryRepository.findOne({
          type: CategoryType.ItemCategory,
          displayName: 'Default',
        });
      }
      if (!unitOfMeasure) {
        unitOfMeasure = await this.categoryRepository.findOne({
          type: CategoryType.UnitOfMeasure,
          displayName: 'Pcs',
        });
      }

      const item = this.itemRepository.create({ displayName: createItemDto.displayName });
      item.category = category;
      item.unitOfMeasure = unitOfMeasure;
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
}
