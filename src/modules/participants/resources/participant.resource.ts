import { Participant } from '../../../entities/participants.entity';

export class ParticipantResource {
  static toResponse(entity: Participant | null) {
    if (!entity) {
      return null;
    }

    const sections =
      entity.participantStandardSections &&
      Array.isArray(entity.participantStandardSections)
        ? entity.participantStandardSections
            .map((m: any) => {
              if (m?.standardSection) {
                const section = m.standardSection;
                return {
                  id: Number(section.id),
                  name: section.name || null,
                  is_active: section.isActive ?? null,
                  standard: section.standard
                    ? {
                        id: Number(section.standard.id),
                        name: section.standard.name || null,
                      }
                    : null,
                };
              }
              return null;
            })
            .filter((section): section is any => section !== null)
        : [];

    return {
      id: Number(entity.id),
      institution_id: entity.institution?.id ?? null,
      institution: entity.institution
        ? {
            id: entity.institution.id,
            name: entity.institution.name || null,
          }
        : null,
      name: entity.name,
      roll_number: entity.rollNumber ?? null,
      password_hash: entity.passwordHash,
      email: entity.email ?? null,
      phone_number: entity.phoneNumber ?? null,
      standard_id: entity.standardId,
      sections: sections,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt ?? null,
    };
  }

  static toCollection(entities: Participant[]) {
    return entities.map((entity) => this.toResponse(entity));
  }
}

