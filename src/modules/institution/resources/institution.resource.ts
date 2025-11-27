import { Institution } from '../../../entities/institution.entity';

export class InstitutionResource {
  static toResponse(entity: Institution) {
    if (!entity) return null;
    return {
      id: Number(entity.id),
      name: entity.name,
      gst: entity.gst,
      email: entity.email,
      mobile: entity.mobile,
      type: entity.type,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at ?? null,
    };
  }

  static toCollection(entities: Institution[]) {
    return Array.isArray(entities)
      ? entities.map((e) => this.toResponse(e))
      : [];
  }
}
