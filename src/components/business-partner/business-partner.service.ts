import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { DisplayInput } from '../user/dto/user.dto';
import { Contact } from 'src/db/models/contact.entity';
import { SalesPerson } from 'src/db/models/salesPerson.entity';

@Injectable()
export class BusinessPartnerService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    @InjectRepository(SalesPerson)
    private readonly salesPersonRepository: Repository<SalesPerson>,
    @InjectRepository(BusinessPartner)
    private readonly BusinessPartnerRepository: Repository<BusinessPartner>,
  ) {}

  async findAll(): Promise<BusinessPartner[]> {
    return this.BusinessPartnerRepository.find();
  }

  async create(createBusinessPartnerDto: DisplayInput): Promise<BusinessPartner> {
    const { displayName } = createBusinessPartnerDto;
    try {
      await validate(displaySchema, createBusinessPartnerDto);
      const found = await this.BusinessPartnerRepository.findOne({ displayName });

      if (found) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'BusinessPartner already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const contact = this.contactRepository.create({ fullName: displayName });
      contact.address = this.addressRepository.create({
        country: 'Ethiopia',
        city: 'Addis Ababa',
      });

      const BusinessPartner = this.BusinessPartnerRepository.create({ displayName });
      BusinessPartner.contact = contact;
      BusinessPartner.address = this.addressRepository.create({
        country: 'Ethiopia',
        city: 'Addis Ababa',
      });
      const response = await this.BusinessPartnerRepository.save(BusinessPartner);
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