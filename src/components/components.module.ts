import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WarehouseModule } from './warehouse/warehouse.module';

@Module({ imports: [UserModule, AuthModule, WarehouseModule] })
export class ComponentsModule {}
