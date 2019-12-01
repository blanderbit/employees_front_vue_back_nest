import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EmployeesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
