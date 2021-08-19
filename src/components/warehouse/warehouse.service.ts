import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/db/models/client.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { DisplayInput } from '../user/dto/user.dto';

@Injectable()
export class WarehouseService {
  constructor(
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

  async create(createWarehouseDto: DisplayInput): Promise<Warehouse> {
    const { displayName } = createWarehouseDto;
    try {
      await validate(displaySchema, createWarehouseDto);
      const found = await this.warehouseRepository.findOne({ displayName });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const client = this.clientRepository.create({ displayName });
      const organization = this.organizationRepository.create({ displayName });
      organization.client = client;

      const warehouse = this.warehouseRepository.create({ displayName });
      warehouse.organization = organization;

      const response = await this.warehouseRepository.save(warehouse);
      //console.log(user);
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
