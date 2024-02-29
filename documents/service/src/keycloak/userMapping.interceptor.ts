import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakService } from 'src/keycloak/keycloak.service';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UserMapperInterceptor<T, P>
  implements NestInterceptor<T, Response<T>>
{
  constructor(
    private keycloakService: KeycloakService,
    private reflector: Reflector,
  ) {}
  isP(item: any, field: keyof P): item is P {
    return field in item;
  }
  isT(item: any, field: keyof T): item is T {
    return field in item;
  }
  mapObject(
    obj: T | P,
    mappedFields: (keyof T)[],
    users: UserRepresentation[],
    nestedField?: keyof P,
  ) {
    mappedFields.forEach((key) => {
      if (obj && nestedField && this.isP(obj, nestedField)) {
        const nestedItems = obj[nestedField];
        if (Array.isArray(nestedItems) && nestedItems.length) {
          nestedItems.map((item) => {
            if (this.isT(item, key)) {
              return this.mapObject(item, [key], users, nestedField);
            }
          });
        }
      }
      if (
        obj &&
        this.isT(obj, key) &&
        obj[key] &&
        typeof obj[key] === 'string'
      ) {
        obj[String(key).split('Id')[0]] = users.find(
          (user) => user.id === obj[key],
        );
      }
    });
    return obj;
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const users = this.keycloakService.users;
    const mappedFields = this.reflector.getAll('fields', [
      context.getHandler(),
    ])[0] as (keyof T)[];
    const nestedField = this.reflector.getAll('nested', [
      context.getHandler(),
    ])[0] as keyof P | undefined;
    // @ts-ignore
    return next
      .handle()
      .pipe(
        map((data: T | P | T[] | P[]) =>
          Array.isArray(data)
            ? data.map((item: T | P) =>
                this.mapObject(item, mappedFields, users, nestedField),
              )
            : this.mapObject(data, mappedFields, users, nestedField),
        ),
      );
  }
}
