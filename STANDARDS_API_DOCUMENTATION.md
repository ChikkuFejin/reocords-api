# Standards API Documentation

## Base URL
```
/standards
```

## Overview
The Standards API manages educational standards, their sections, and associated categories. **Categories are now directly connected to standards** (not through sections). A standard can have multiple categories.

---

## Endpoints

### 1. Create Standard
Create a new standard.

**Endpoint:** `POST /standards`

**Request Body:**
```json
{
  "name": "Grade 10",
  "description": "Tenth standard curriculum",
  "is_active": true
}
```

**Validation Rules:**
- `name`: Required, string, min 1 character, max 255 characters
- `description`: Optional, string
- `is_active`: Optional, boolean, defaults to `true`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "institution": null,
    "sections": null,
    "categories": null
  },
  "message": "Created"
}
```

---

### 2. Get All Standards
Retrieve all standards (only those without institution_id, i.e., global standards).

**Endpoint:** `GET /standards`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grade 10",
      "description": "Tenth standard curriculum",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "institution": null,
      "sections": [
        {
          "id": 1,
          "name": "Section A",
          "is_active": true
        }
      ],
      "categories": [
        {
          "id": 5,
          "name": "Mathematics"
        },
        {
          "id": 6,
          "name": "Science"
        }
      ]
    }
  ]
}
```

---

### 3. Get Standard by ID
Retrieve a specific standard with its sections and categories.

**Endpoint:** `GET /standards/:id`

**Path Parameters:**
- `id` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "institution": {
      "id": 1,
      "name": "Green Valley High School"
    },
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "is_active": true
      },
      {
        "id": 2,
        "name": "Section B",
        "is_active": true
      }
    ],
    "categories": [
      {
        "id": 5,
        "name": "Mathematics"
      },
      {
        "id": 6,
        "name": "Science"
      },
      {
        "id": 7,
        "name": "English"
      }
    ]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

### 4. Get Categories by Standard
Retrieve all categories associated with a specific standard.

**Endpoint:** `GET /standards/:id/categories`

**Path Parameters:**
- `id` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "institution": null,
    "sections": null,
    "categories": [
      {
        "id": 5,
        "name": "Mathematics"
      },
      {
        "id": 6,
        "name": "Science"
      }
    ]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

### 5. Get Sections by Standard
Retrieve all sections associated with a specific standard.

**Endpoint:** `GET /standards/:id/sections`

**Path Parameters:**
- `id` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "institution": null,
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "is_active": true
      },
      {
        "id": 2,
        "name": "Section B",
        "is_active": true
      }
    ],
    "categories": [
      {
        "id": 5,
        "name": "Mathematics"
      }
    ]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

### 6. Update Standard
Update an existing standard.

**Endpoint:** `PATCH /standards/:id`

**Path Parameters:**
- `id` (number): Standard ID

**Request Body:**
```json
{
  "name": "Grade 10 Updated",
  "description": "Updated description",
  "is_active": false
}
```

**Validation Rules:**
- `name`: Required, string, min 1 character, max 255 characters
- `description`: Optional, string
- `is_active`: Optional, boolean

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Updated"
}
```

**Response (200 OK - No changes):**
```json
{
  "success": true,
  "data": null,
  "message": "Resource not affected"
}
```

---

### 7. Delete Standard
Soft delete a standard.

**Endpoint:** `DELETE /standards/:id`

**Path Parameters:**
- `id` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Deleted"
}
```

**Response (200 OK - No changes):**
```json
{
  "success": true,
  "data": null,
  "message": "Resource not affected"
}
```

---

### 8. Get Standards by Institution
Retrieve all standards for a specific institution.

**Endpoint:** `POST /standards/institution/:id`

**Path Parameters:**
- `id` (number): Institution ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "X A",
      "description": "tenth standard",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "institution": {
        "id": 1,
        "name": "Green Valley High School"
      },
      "sections": [
        {
          "id": 1,
          "name": "A Section",
          "is_active": true
        }
      ],
      "categories": [
        {
          "id": 5,
          "name": "Mathematics"
        }
      ]
    }
  ]
}
```

---

### 9. Add/Update Standard with Sections and Categories
Create or update a standard along with its sections and categories. **Categories are now associated directly with the standard, not with sections.**

**Endpoint:** `POST /standards/add-standard-section`

**Authentication:** Requires user authentication (institution_id is taken from the authenticated user)

**Request Body:**
```json
{
  "standard": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "categories": [5, 6, 7]
  },
  "sections": [
    {
      "id": 1,
      "name": "Section A",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Section B",
      "is_active": true
    },
    {
      "name": "Section C",
      "is_active": true
    }
  ]
}
```

**Validation Rules:**

**Standard Object:**
- `id`: Optional, number (if provided, updates existing; if not, creates new)
- `name`: Required, string, min 1 character, max 255 characters
- `description`: Optional, string
- `is_active`: Optional, boolean, defaults to `true`
- `categories`: Optional, array of positive numbers (category IDs) - **Categories are associated with the standard, not sections**

**Section Object:**
- `id`: Optional, number (if provided, updates existing; if not, creates new)
- `name`: Required, string, min 1 character
- `is_active`: Optional, boolean, defaults to `true`
- **Note:** Sections no longer have categories

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grade 10",
    "description": "Tenth standard curriculum",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "institution": {
      "id": 1,
      "name": "Green Valley High School"
    },
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "is_active": true
      },
      {
        "id": 2,
        "name": "Section B",
        "is_active": true
      },
      {
        "id": 3,
        "name": "Section C",
        "is_active": true
      }
    ],
    "categories": [
      {
        "id": 5,
        "name": "Mathematics"
      },
      {
        "id": 6,
        "name": "Science"
      },
      {
        "id": 7,
        "name": "English"
      }
    ]
  }
}
```

**Behavior:**
- If `standard.id` is provided, it updates the existing standard; otherwise, creates a new one
- If `standard.categories` is provided:
  - Categories not in the new list are removed from the standard
  - New categories are added to the standard
- If `section.id` is provided, it updates the existing section; otherwise, creates a new one
- Sections that exist but are not in the request are not deleted (only updated/created)

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```
(When trying to update a standard that doesn't exist)

---

## Data Models

### Standard
```typescript
{
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  institution?: Institution;
  categories?: Category[];  // One-to-Many relationship
  standardSections?: StandardSection[];  // One-to-Many relationship
}
```

### Category
```typescript
{
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  parent_id: number | null;
  standard_id: number | null;  // Direct relationship to Standard
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
```

### StandardSection
```typescript
{
  id: number;
  standard_id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

---

## Important Notes

1. **Category Relationship Change:**
   - **Before:** Categories were connected to sections via `standard_section_categories` table
   - **After:** Categories are now directly connected to standards via `categories.standard_id`
   - A standard can have multiple categories
   - Categories are no longer associated with sections

2. **Migration:**
   - The database migration script (`records_v2.sql`) includes ALTER queries to migrate existing data
   - Existing category-section relationships are migrated to category-standard relationships

3. **Route Ordering:**
   - More specific routes (`/standards/:id/categories`, `/standards/:id/sections`) must come before the generic route (`/standards/:id`)
   - This is already handled in the controller

4. **Soft Delete:**
   - Standards use soft delete (deleted_at timestamp)
   - Deleted standards are not returned in queries unless explicitly requested

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Example Usage

### Create a Standard with Categories and Sections

```bash
curl -X POST http://localhost:3000/standards/add-standard-section \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "standard": {
      "name": "Grade 11",
      "description": "Eleventh standard",
      "is_active": true,
      "categories": [5, 6, 7]
    },
    "sections": [
      {
        "name": "Section A",
        "is_active": true
      },
      {
        "name": "Section B",
        "is_active": true
      }
    ]
  }'
```

### Get Categories for a Standard

```bash
curl -X GET http://localhost:3000/standards/1/categories
```

### Update Standard Categories

```bash
curl -X POST http://localhost:3000/standards/add-standard-section \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "standard": {
      "id": 1,
      "name": "Grade 10",
      "categories": [5, 6, 8, 9]
    },
    "sections": [
      {
        "id": 1,
        "name": "Section A",
        "is_active": true
      }
    ]
  }'
```

---

## Version History

- **v2.0** - Categories moved from sections to standards (direct relationship)
- **v1.0** - Initial implementation with categories linked to sections

