import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { Contact } from 'src/db/models/contact.entity';
import { SalesPerson } from 'src/db/models/salesPerson.entity';
import { BusinessPartnerResolver } from './business-partner.resolver';
import { BusinessPartnerService } from './business-partner.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPartner, Contact, SalesPerson, Address])],
  providers: [BusinessPartnerResolver, BusinessPartnerService],
})
export class BusinessPartnerModule {}
