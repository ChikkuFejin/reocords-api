import { QuestionType } from '../../../entities/question-type.entity';

export class QuestionTypeResource {
  static toResponse(questionType: QuestionType | null) {
    if (!questionType) {
      return null;
    }
    return {
      name: questionType.name,
      description: questionType.description,
      id: questionType.id,
      created_at: questionType.created_at,
    };
  }

  static toCollection(questionType: QuestionType[]) {
    return questionType.map((questionType) => this.toResponse(questionType));
  }
}
