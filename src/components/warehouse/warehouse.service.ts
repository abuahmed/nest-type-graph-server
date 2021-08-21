import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { Client } from 'src/db/models/client.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { DisplayInput } from '../dto/display.input';

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
}
