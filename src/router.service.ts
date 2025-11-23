import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { BodyDto } from './utils/dto/body.dto';
import { ModuleRef } from '@nestjs/core';
import { Response } from 'express';
import { serviceResponse } from './helpers/response';
import { DropdownMasterService } from './modules/dropdown-master/dropdown-master.service';

@Injectable()
export class RouterService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async routes(bodyData: BodyDto, res: Response) {
    const { module, action, data } = bodyData;

    if (!module || !action) {
      throw new BadRequestException('Missing moidule or action');
    }

    const serviceName = this.resolveServiceName(module);
    try {
      const service = await this.moduleRef.get(serviceName, { strict: false });

      if (typeof service[action] !== 'function') {
        throw new BadRequestException(
          serviceResponse.failure(
            `Action "${action}" not found in module "${module}"`,
          ),
        );
      }
      console.log(bodyData);

      return await service[action](bodyData, res);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(
        serviceResponse.failure(
          `Module "${module}" not found or error: ${err.message}`,
        ),
      );
    }
  }

  private resolveServiceName(module: string): any {
    const map = {
      auth: AuthService,
      master: AuthService,
      'C-Drop': DropdownMasterService,

      // Add other modules/services here
    };

    if (!(module in map)) {
      throw new BadRequestException(
        serviceResponse.failure(`Module "${module}" is not mapped`),
      );
      throw new BadRequestException(`Module "${module}" is not mapped`);
    }

    return map[module];
  }
}
