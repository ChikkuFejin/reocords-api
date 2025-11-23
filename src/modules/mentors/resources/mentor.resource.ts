import { Mentor } from '../../../entities/mentor.entity';
import { Institution } from '../../../entities/institution.entity';
import { MentorStandardSection } from '../../../entities/mentor-standard-section.entity';
import { MentorStandardSectionCategory } from '../../../entities/mentor-standard-section-category.entity';

export class MentorResource {
  static toResponse(modal: Mentor | null) {
    if (!modal) {
      return null;
    }
    return {
      id: modal.id,
      institution_id: modal.institution?.id || null,
      institution: modal.institution
        ? this.getInstitutionResponse(modal.institution)
        : null,
      name: modal.name,
      phone_number: modal.phone_number,
      username: modal.username,
      is_active: modal.is_active,
      standards: modal.mentorStandardSections
        ? this.toStandardsCollection(modal.mentorStandardSections)
        : [],
      created_at: modal.created_at,
      updated_at: modal.updated_at,
    };
  }

  static toResponseForStandard(modal: Mentor | null) {
    if (!modal) {
      return null;
    }
    return {
      id: modal.id,
      institution_id: modal.institution?.id || null,
      institution: modal.institution
        ? this.getInstitutionResponse(modal.institution)
        : null,
      name: modal.name,
      phone_number: modal.phone_number,
      username: modal.username,
      is_active: modal.is_active,
      sections: modal.mentorStandardSections
        ? modal.mentorStandardSections.map((section) =>
            this.toSectionResponse(section),
          )
        : [],
      created_at: modal.created_at,
      updated_at: modal.updated_at,
    };
  }

  static toCollection(data: Mentor[]) {
    return data.map((modal) => this.toResponse(modal));
  }

  static toCollectionWithSections(data: Mentor[]) {
    return data.map((modal) => this.toResponseForStandard(modal));
  }

  static getInstitutionResponse(data: Institution) {
    return {
      id: data.id,
      name: data.name,
    };
  }

  static toStandardsCollection(sections: MentorStandardSection[]) {
    const standardsMap = new Map<
      number,
      {
        id: number;
        name: string | null;
        status: string;
        sections: ReturnType<typeof this.toSectionResponse>[];
      }
    >();

    sections.forEach((section) => {
      const standard = section.standardSection?.standard;
      if (!standard) {
        return;
      }

      if (!standardsMap.has(standard.id)) {
        standardsMap.set(standard.id, {
          id: standard.id,
          name: standard.name ?? null,
          status: standard.is_active ? 'active' : 'inactive',
          sections: [],
        });
      }

      const standardEntry = standardsMap.get(standard.id);
      if (standardEntry) {
        standardEntry.sections.push(this.toSectionResponse(section));
      }
    });

    return Array.from(standardsMap.values());
  }

  static toSectionResponse(section: MentorStandardSection) {
    return {
      id: section.id,
      standard_section: section.standardSection
        ? {
            id: section.standardSection.id,
            name: section.standardSection.name,
            standard: section.standardSection.standard
              ? {
                  id: section.standardSection.standard.id,
                  name: section.standardSection.standard.name,
                }
              : null,
          }
        : null,
      categories: section.mentorStandardSectionCategories
        ? section.mentorStandardSectionCategories.map(
            (item: MentorStandardSectionCategory) => ({
              id: item.category?.id || null,
              name: item.category?.name || null,
            }),
          )
        : [],
    };
  }
}

