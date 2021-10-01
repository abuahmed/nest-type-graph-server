import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { displaySchema, validate } from 'src/validation';
import { Repository } from 'typeorm';
import { Contact } from 'src/db/models/contact.entity';
import { SalesPerson } from 'src/db/models/salesPerson.entity';
import { DisplayInput } from '../dto/display.input';
import { BusinessPartnerArgs } from './dto/business-partner.args';

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

  async findAll(bpArgs: BusinessPartnerArgs): Promise<BusinessPartner[]> {
    const { skip, take } = bpArgs;
    const bpsQB = this.BusinessPartnerRepository.createQueryBuilder('bp')
      .innerJoinAndSelect('bp.address', 'address')
      .innerJoinAndSelect('bp.contact', 'contact')
      .innerJoinAndSelect('contact.address', 'contactAddress');

    return await bpsQB.take(take).skip(skip).getMany();
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
