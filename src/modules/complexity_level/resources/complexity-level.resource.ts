
import { ComplexityLevel } from '../../../entities/complexity-levels.entity';

export class ComplexityLevelResource {
  static toResponse(modal: ComplexityLevel | null) {
    if (!modal) {
      return null;
    }
    return {
      name: modal.name,
      id: modal.id,
      created_at: modal.created_at,
    };
  }

  static toCollection(data: ComplexityLevel[]) {
    return data.map((modal) => this.toResponse(modal));
  }
}
