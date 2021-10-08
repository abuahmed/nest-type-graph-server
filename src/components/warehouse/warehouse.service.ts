import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { Client } from 'src/db/models/client.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { displaySchema, parentRequiredSchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { ClientInput, OrganizationInput, WarehouseInput } from './dto/create-update.input';
import { ClientArgs, OrganizationArgs, WarehouseArgs } from './dto/list.args';

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

  // async findAll(): Promise<Warehouse[]> {
  //   return this.warehouseRepository.find();
  // }

  async findAllClients(clientArgs: ClientArgs): Promise<Client[]> {
    return this.clientRepository.find();
  }
  async findOneClient(id: number): Promise<Client> {
    return await this.clientRepository.findOne({ id }, { relations: ['address'] });
  }
  async createUpdateClient(clientInput: ClientInput): Promise<Client> {
    const { displayName, address } = clientInput;
    try {
      await validate(displaySchema, { displayName });

      const client = clientInput.id
        ? await this.clientRepository.preload(clientInput)
        : this.clientRepository.create(clientInput);

      const addr = address.id
        ? await this.addressRepository.preload(address)
        : this.addressRepository.create(address);

      client.address = addr;

      const response = await this.clientRepository.save(client);
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

  async findAllOrganizations(organizationArgs: OrganizationArgs): Promise<Organization[]> {
    const { clientId } = organizationArgs;
    return this.organizationRepository.find({
      relations: ['address', 'client', 'client.address'],
      where: { clientId },
    });
  }
  async findOneOrganization(id: number): Promise<Organization> {
    return await this.organizationRepository.findOne(
      { id },
      { relations: ['address', 'client', 'client.address'] },
    );
  }
  async createUpdateOrganization(organizationInput: OrganizationInput): Promise<Organization> {
    const { displayName, address, clientId } = organizationInput;
    try {
      await validate(displaySchema, { displayName });
      await validate(parentRequiredSchema, { id: clientId });

      const organization = organizationInput.id
        ? await this.organizationRepository.preload(organizationInput)
        : this.organizationRepository.create(organizationInput);

      const addr = address.id
        ? await this.addressRepository.preload(address)
        : this.addressRepository.create(address);

      organization.address = addr;
      organization.clientId = clientId;
      const response = await this.organizationRepository.save(organization);
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
  async findAllWarehouses(warehouseArgs: WarehouseArgs): Promise<Warehouse[]> {
    const { organizationId } = warehouseArgs;
    return this.warehouseRepository.find({
      relations: ['address', 'organization', 'organization.address'],
      where: { organizationId },
    });
  }
  async findOneWarehouse(id: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOne(
      { id },
      { relations: ['address', 'organization', 'organization.address'] },
    );
  }
  async createUpdateWarehouse(warehouseInput: WarehouseInput): Promise<Warehouse> {
    const { displayName, address, organizationId } = warehouseInput;
    try {
      await validate(displaySchema, { displayName });
      await validate(parentRequiredSchema, { id: organizationId });

      const warehouse = warehouseInput.id
        ? await this.warehouseRepository.preload(warehouseInput)
        : this.warehouseRepository.create(warehouseInput);

      const addr = address.id
        ? await this.addressRepository.preload(address)
        : this.addressRepository.create(address);

      warehouse.address = addr;
      warehouse.organizationId = organizationId;
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

  // async create(createItemDto: DisplayInput): Promise<Warehouse> {
  //   const { displayName } = createItemDto;
  //   try {
  //     await validate(displaySchema, { displayName: createItemDto.displayName });

  //     const found = await this.warehouseRepository.findOne({ displayName });
  //     if (found) {
  //       throw new HttpException(
  //         {
  //           status: HttpStatus.BAD_REQUEST,
  //           error: 'Warehouse already exists',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const client = this.clientRepository.create({ displayName });
  //     client.address = this.addressRepository.create({ country: 'Ethiopia', city: 'Addis Ababa' });

  //     const organization = this.organizationRepository.create({ displayName });
  //     organization.client = client;
  //     organization.address = this.addressRepository.create({
  //       country: 'Ethiopia',
  //       city: 'Addis Ababa',
  //     });

  //     const warehouse = this.warehouseRepository.create({ displayName });
  //     warehouse.organization = organization;
  //     warehouse.address = this.addressRepository.create({
  //       country: 'Ethiopia',
  //       city: 'Addis Ababa',
  //     });
  //     const response = await this.warehouseRepository.save(warehouse);
  //     return response;
  //   } catch (err) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.FORBIDDEN,
  //         error: err,
  //         message: err.message,
  //       },
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }
}
