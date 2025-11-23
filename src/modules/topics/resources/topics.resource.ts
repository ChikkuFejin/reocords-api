import { Topic } from '../../../entities/topic.entity';

export class TopicsResource {
  static toResponse(modal: Topic | null) {
    if (!modal) {
      return null;
    }
    return {
      name: modal.name,
      id: modal.id,
      description: modal.description,
      created_at: modal.created_at,
    };
  }

  static toCollection(data: Topic[]) {
    return data.map((modal) => this.toResponse(modal));
  }
}
