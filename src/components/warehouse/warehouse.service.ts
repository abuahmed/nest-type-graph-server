import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { Client } from 'src/db/models/client.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { displaySchema, parentRequiredSchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { DelResult } from '../user/dto/user.dto';
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

  async findAllClients(clientArgs: ClientArgs): Promise<Client[]> {
    const { searchText, take, skip } = clientArgs;
    let clientsQB = this.clientRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.address', 'address');
    if (searchText && searchText.length > 0) {
      clientsQB = clientsQB.andWhere(`c.displayName Like("%${searchText}%")`);
    }
    if (take === -1) return await clientsQB.getMany();
    return await clientsQB.take(take).skip(skip).getMany();
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
  async removeClient(id: number): Promise<DelResult> {
    const del = await this.clientRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }

  async findAllOrganizations(organizationArgs: OrganizationArgs): Promise<Organization[]> {
    const { clientId, searchText, take, skip } = organizationArgs;
    let organizationsQB = this.organizationRepository
      .createQueryBuilder('o')
      .innerJoinAndSelect('o.client', 'client')
      .innerJoinAndSelect('client.address', 'clientAddress')
      .innerJoinAndSelect('o.address', 'address')
      .where('o.clientId = :clientId', {
        clientId: clientId,
      });
    if (searchText && searchText.length > 0) {
      organizationsQB = organizationsQB.andWhere(`o.displayName Like("%${searchText}%")`);
    }
    if (take === -1) return await organizationsQB.getMany();
    return await organizationsQB.take(take).skip(skip).getMany();
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
      await this.organizationRepository.save(organization);

      return await this.organizationRepository.findOne(
        { displayName: organization.displayName },
        { relations: ['address', 'client', 'client.address'] },
      );
      //return response;
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
  async removeOrganization(id: number): Promise<DelResult> {
    const del = await this.organizationRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }

  async findAllWarehouses(warehouseArgs: WarehouseArgs): Promise<Warehouse[]> {
    const { parent, parentId, searchText, take, skip } = warehouseArgs;
    let warehousesQB = this.warehouseRepository
      .createQueryBuilder('w')
      .innerJoinAndSelect('w.address', 'address')
      .innerJoinAndSelect('w.organization', 'org')
      .innerJoinAndSelect('org.address', 'orgAddress')
      .innerJoinAndSelect('org.client', 'client')
      .innerJoinAndSelect('client.address', 'clientAddress');
    if (parent === 'Organization') {
      warehousesQB = warehousesQB.andWhere('org.id = :orgId', {
        orgId: parentId,
      });
    } else {
      warehousesQB = warehousesQB.andWhere('client.id = :clientId', {
        clientId: parentId,
      });
    }

    if (searchText && searchText.length > 0) {
      warehousesQB = warehousesQB.andWhere(`w.displayName Like("%${searchText}%")`);
    }
    if (take === -1) return await warehousesQB.getMany();
    return await warehousesQB.take(take).skip(skip).getMany();
  }
  async findOneWarehouse(id: number): Promise<Warehouse> {
    return await this.warehouseRepository.findOne(
      { id },
      {
        relations: [
          'address',
          'organization',
          'organization.address',
          'organization.client',
          'organization.client.address',
        ],
      },
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
      await this.warehouseRepository.save(warehouse);
      return await this.warehouseRepository.findOne(
        { displayName: warehouse.displayName },
        {
          relations: [
            'address',
            'organization',
            'organization.address',
            'organization.client',
            'organization.client.address',
          ],
        },
      );
      //return response;
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
  async removeWarehouse(id: number): Promise<DelResult> {
    const del = await this.warehouseRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
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
