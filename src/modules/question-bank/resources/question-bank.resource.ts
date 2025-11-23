import { Question } from '../../../entities/question.entity';

export class QuestionBankResource {
  static toResponse(modal: Question | null) {
    if (!modal) {
      return null;
    }
    return modal;
  }

  static toCollection(data: Question[]) {
    return data.map((modal) => this.toResponse(modal));
  }
}
