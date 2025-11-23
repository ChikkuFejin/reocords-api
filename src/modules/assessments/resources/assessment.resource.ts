import { Assessment } from '../../../entities/assessment.entity';

export class AssessmentResource {
  static toResponse(modal: Assessment | null) {
    if (!modal) {
      return null;
    }
    return modal;
  }

  static toCollection(data: Assessment[]) {
    return data.map((modal) => this.toResponse(modal));
  }
}
