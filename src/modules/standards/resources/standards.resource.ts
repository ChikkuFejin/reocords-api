import { Standard } from '../../../entities/standard.entity';
import { Institution } from '../../../entities/institution.entity';
import { StandardSection } from '../../../entities/standard-sections';
import { Category } from '../../../entities/category.entity';

export class StandardsResource {
  static toResponse(modal: Standard | null) {
    if (!modal) {
      return null;
    }
    return {
      name: modal.name,
      id: modal.id,
      description: modal.description,
      is_active: modal.is_active,
      created_at: modal.created_at,
      institution: modal.institution
        ? this.getInstitutionResponse(modal.institution)
        : null,
      sections: modal.standardSections
        ? this.toCollectionSections(modal.standardSections)
        : null,
      categories: modal.categories
        ? this.toCollectionCategory(modal.categories)
        : null,
    };
  }

  static toCollection(data: Standard[]) {
    return data.map((modal) => this.toResponse(modal));
  }

  static getInstitutionResponse(data: Institution) {
    return {
      id: data.id,
      name: data.name,
    };
  }

  static toResponseSections(data: StandardSection) {
    return {
      id: data.id,
      name: data.name,
      is_active: data.isActive,
    };
  }
  static toCollectionSections(data: StandardSection[]) {
    return data.map((modal) => this.toResponseSections(modal));
  }

  static roResponseCategory(data: Category) {
    return {
      name: data.name || '',
      id: data.id || '',
    };
  }

  static toCollectionCategory(data: Category[]) {
    return data.map((modal) => this.roResponseCategory(modal));
  }
}
