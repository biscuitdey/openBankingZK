import { Injectable } from '@nestjs/common';

interface IConstructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class PrismaMapper {
  constructor() {}

  public map<T extends object>(source: any, targetType: IConstructor<T>): T {
    const target = this.activator(targetType);

    Object.assign(target, source);

    return target;
  }

  private activator<T>(type: IConstructor<T>): T {
    return new type();
  }
}
