import { Category } from '../../../entities/category.entity';

type SerializeOpts = {
  includeChildren?: boolean;
  includeParent?: boolean;
  visited?: Set<number | string>;
};

export class CategoryResource {
  static toResponse(
    category: Category | null,
    opts: SerializeOpts = {
      includeChildren: true,
    },
  ): Record<string, any> | null {
    if (!category) return null;

    const {
      includeChildren = true,
      includeParent = true,
      visited = new Set(),
    } = opts;

    // Prevent circular loops
    if (visited.has(category.id)) {
      return null;
    }
    visited.add(category.id);

    const base = {
      id: category.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };

    const children = includeChildren
      ? category.children
        ? category.children
            .map((child) =>
              CategoryResource.toResponse(child, {
                includeChildren: true,
                includeParent: false, // avoid parent loop in children
                visited: new Set(visited),
              }),
            )
            .filter(Boolean)
        : []
      : undefined;

    const parent = includeParent
      ? category.parent
        ? CategoryResource.toResponse(category.parent, {
            includeChildren: false, // avoid pulling siblings recursively
            includeParent: false, // stop upward chain
            visited: new Set(visited),
          })
        : null
      : undefined;

    return {
      ...base,
      ...(children !== undefined ? { children } : {}),
      // ...(parent !== undefined ? { parent } : {}),
    };
  }

  static toCollection(categories: Category[]) {
    return categories
      .map((c) => this.toResponse(c))
      .filter((r): r is Record<string, any> => r !== null);
  }
}
