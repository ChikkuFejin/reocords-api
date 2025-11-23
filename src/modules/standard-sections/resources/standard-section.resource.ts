import { StandardSection } from '../../../entities/standard-sections';
import { Standard } from '../../../entities/standard.entity';

export class StandardSectionResource {
  static toResponse(modal: StandardSection | null) {
    if (!modal) {
      return null;
    }
    return {
      id: modal.id,
      name: modal.name,
      is_active: modal.isActive,
      standard_id: modal.standard?.id || null,
      standard: modal.standard
        ? this.getStandardResponse(modal.standard)
        : null,
      created_at: modal.createdAt,
      updated_at: modal.updatedAt,
    };
  }

  static toCollection(data: StandardSection[]) {
    return data.map((modal) => this.toResponse(modal));
  }

  static getStandardResponse(data: Standard) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
    };
  }
}

