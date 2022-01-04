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
import { DelResult } from '../user/dto/user.dto';
import { BusinessPartnersWithCount, CreateBusinessPartnerInput } from './dto/create-bp.input';

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
    private readonly businessPartnerRepository: Repository<BusinessPartner>,
  ) {}

  async findAll(bpArgs: BusinessPartnerArgs): Promise<BusinessPartnersWithCount> {
    const { searchText, skip, take, type } = bpArgs;
    let bpsQB = this.businessPartnerRepository
      .createQueryBuilder('bp')
      .innerJoinAndSelect('bp.address', 'address')
      .innerJoinAndSelect('bp.contact', 'contact')
      .innerJoinAndSelect('contact.address', 'contactAddress')
      .where('bp.type = :type', { type });
    if (searchText && searchText.length > 0) {
      bpsQB = bpsQB.andWhere(`bp.displayName Like("%${searchText}%")`);
    }
    let rows: any[];
    if (take === -1) rows = await bpsQB.getManyAndCount();
    else rows = await bpsQB.take(take).skip(skip).getManyAndCount();
    return {
      businessPartners: rows[0],
      totalCount: rows[1],
    };
  }
  async findOne(id: number): Promise<BusinessPartner> {
    return await this.businessPartnerRepository.findOne(
      { id },
      { relations: ['address', 'contact', 'contact.address'] },
    );
  }
  async createUpdate(creatBPInput: CreateBusinessPartnerInput): Promise<BusinessPartner> {
    const { displayName, contact, address } = creatBPInput;
    try {
      await validate(displaySchema, { displayName });

      const bp = creatBPInput.id
        ? await this.businessPartnerRepository.preload(creatBPInput)
        : this.businessPartnerRepository.create(creatBPInput);

      // const found = await this.businessPartnerRepository.findOne({ displayName });
      // if (found) {
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.BAD_REQUEST,
      //       error: 'BusinessPartner already exists',
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      const addr = address.id
        ? await this.addressRepository.preload(address)
        : this.addressRepository.create(address);

      const ctct = contact.id
        ? await this.contactRepository.preload(contact)
        : this.contactRepository.create(contact);

      const ctctaddr =
        contact.address && contact.address.id
          ? await this.addressRepository.preload(contact.address)
          : this.addressRepository.create(contact.address);

      ctct.address = ctctaddr;

      // const contact = this.contactRepository.create({ fullName: displayName });
      // contact.address = this.addressRepository.create({
      //   country: 'Ethiopia',
      //   city: 'Addis Ababa',
      // });

      bp.contact = ctct;
      bp.address = addr;

      // const BusinessPartner = this.businessPartnerRepository.create({ displayName });
      // BusinessPartner.contact = contact;
      // BusinessPartner.address = this.addressRepository.create({
      //   country: 'Ethiopia',
      //   city: 'Addis Ababa',
      // });
      const response = await this.businessPartnerRepository.save(bp);
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

  async remove(id: number): Promise<DelResult> {
    const del = await this.businessPartnerRepository.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }
}
