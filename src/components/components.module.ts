import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { BusinessPartnerModule } from './business-partner/business-partner.module';

@Module({ imports: [UserModule, AuthModule, WarehouseModule, BusinessPartnerModule] })
export class ComponentsModule {}
