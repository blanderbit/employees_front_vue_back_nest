import { Controller, HttpCode, Post, Body, Delete, Param, Get, Put, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeelDto } from './dto/employee.dto';
import { Employee } from './entity/employee.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
export class EmployeesController {
    constructor(
        private readonly employeeService: EmployeesService,
    ) {}

    @Post('')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(201)
    public store(
        @Body() createEmployeeDto: CreateEmployeelDto,
    ): Promise<Employee> {
        return this.employeeService.store(createEmployeeDto);
    }

    @Get('')
    @HttpCode(200)
    public index(
        @Query('page') page: number = 1,
        @Query('take') take: number = 10,
        @Query('find') find: string = '',
    ): Promise<object> {
        return this.employeeService.index(page, take, find);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    public show(
        @Param('id') id: number,
    ): Promise<Employee> {
        return this.employeeService.show(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    public update(
        @Param('id') id: number,
        @Body() employee: CreateEmployeelDto,
    ): Promise<object> {
        return this.employeeService.update(id, employee);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    public destroy(
        @Param('id') id: number,
    ): Promise <object> {
        return this.employeeService.destroy(id);
    }
}
