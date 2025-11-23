import { User } from '../user.entity';

export class UserResource {
  static toResponse(entity: User) {
    if (!entity) return null;
    return {
      id: Number(entity.id),
      institution_id: entity.institution_id,
      username: entity.username,
      email: entity.email,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at ?? null,
    };
  }

  static toCollection(entities: User[]) {
    return Array.isArray(entities) ? entities.map((e) => this.toResponse(e)) : [];
  }
}
