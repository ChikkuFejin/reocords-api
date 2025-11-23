import { Board } from '../../../entities/boards.entity';

export class BoardResource {
  static toResponse(modal: Board | null) {
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

  static toCollection(data: Board[]) {
    return data.map((modal) => this.toResponse(modal));
  }
}
