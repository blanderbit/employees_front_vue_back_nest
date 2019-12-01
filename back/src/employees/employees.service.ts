import {
    Injectable,
    HttpStatus,
    HttpException,
    NotFoundException,
} from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm';
import {Employee} from './entity/employee.entity';
import {Repository, Like} from 'typeorm';
import {CreateEmployeelDto} from './dto/employee.dto';

@Injectable()
export class EmployeesService {

    @InjectRepository(Employee)
    private readonly employeeModel: Repository<Employee>;

    public async store(employee: CreateEmployeelDto): Promise<Employee> {
        try {
            return await this.employeeModel.save(employee);
        } catch (error) {
            throw new HttpException({
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    public async index(page: number, take: number, find: string): Promise<object> {
        try {

            const start = page > 1 ? (page - 1) * take : 0;
            find = Buffer.from(find, 'base64').toString('ascii');

            const [result, total]: any = await this.employeeModel.findAndCount({
                where: this.find(find),
                skip: start,
                take: take,
            });

            const totalPages = Math.ceil(total / take);
            const lastPage = totalPages < 1 ? 1 : totalPages;

            return {
                data: result,
                total: total,
                totalCount: total ? total.length : 0,
                currentPage: Number(page) > lastPage ? lastPage : Number(page),
                lastPage: totalPages ? totalPages : 0,
            };
        } catch (error) {
            throw new HttpException({
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    public async show(id: number): Promise<Employee> {
        try {
            const found = await this.employeeModel.findOne({id});
            if (!found) {
                throw new NotFoundException();
            }
            return found;
        } catch (error) {
            throw new HttpException({
                error: error.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    public async update(id, employee): Promise<object> {
        try {
            const toUpdate = await this.employeeModel.findOne({id});
            if (!toUpdate) {
                throw new NotFoundException();
            }
            await this.employeeModel.update(id, employee);
            return {
                status: 200,
                message: 'Updated successfully',
            };
        } catch (error) {
            throw new HttpException({
                error: error.message,
            }, HttpStatus.NOT_FOUND);
        }
    }

    public async destroy(id: number): Promise<object> {
        try {
            const toRemove = await this.employeeModel.findOne({id});
            if (!toRemove) {
                throw new NotFoundException();
            }
            await this.employeeModel.delete(id);
            return {
                status: 200,
                message: 'Deleted successfully',
            };
        } catch (error) {
            throw new HttpException({
                error: error.message,
            }, HttpStatus.NOT_FOUND);
        }
    }

    private find(data: string) {
        try {
            const obj = JSON.parse(data);
            const object = {};
            Object
                .keys(obj)
                .forEach(item => object[item] = Like(`%${obj[item]}%`));
            return object;
        } catch (e) {
            return {};
        }
    }
}
