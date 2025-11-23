# Mentors API Documentation

## Base URL
```
/mentors
```

## Overview
The Mentors API provides CRUD operations for managing mentors. Mentors can be associated with institutions and linked to standard sections through the `mentor_standard_sections` junction table.

---

## Endpoints

### 1. Create Mentor
Create a new mentor.

**Endpoint:** `POST /mentors`

**Request Body:**
```json
{
  "institution_id": 1,
  "name": "John Doe",
  "phone_number": "9876543210",
  "username": "johndoe",
  "password": "password123",
  "is_active": true,
  "sections": [
    {
      "standard_section_id": 1,
      "categories": [1, 2]
    }
  ]
}
```

**Validation Rules:**
- `institution_id`: Optional, positive number (must exist if provided)
- `name`: Required, string, min 1 character, max 255 characters
- `phone_number`: Optional, string, max 20 characters
- `username`: Required, string, min 1 character, max 255 characters
- `password`: Required, string, min 1 character (will be hashed with bcrypt)
- `is_active`: Optional, boolean, defaults to `true`
- `sections`: Optional, array of objects
  - `standard_section_id`: Required when sections provided, positive number
  - `categories`: Optional array of category IDs (numbers or numeric strings)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "institution": {
      "id": 1,
      "name": "Green Valley High School"
    },
    "name": "John Doe",
    "phone_number": "9876543210",
    "username": "johndoe",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  },
  "message": "Created"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Institution not found"
}
```

---

### 2. Get All Mentors
Retrieve all mentors (excluding soft-deleted).

**Endpoint:** `GET /mentors`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution_id": 1,
      "institution": {
        "id": 1,
        "name": "Green Valley High School"
      },
      "name": "John Doe",
      "phone_number": "9876543210",
      "username": "johndoe",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "institution_id": null,
      "institution": null,
      "name": "Jane Smith",
      "phone_number": "9876543211",
      "username": "janesmith",
      "is_active": true,
      "created_at": "2025-01-15T10:31:00.000Z",
      "updated_at": "2025-01-15T10:31:00.000Z"
    }
  ]
}
```

---

### 3. Get Mentors by Institution ID
Retrieve all mentors for a specific institution.

**Endpoint:** `GET /mentors/institution/:institutionId`

**Path Parameters:**
- `institutionId` (number): Institution ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution_id": 1,
      "institution": {
        "id": 1,
        "name": "Green Valley High School"
      },
      "name": "John Doe",
      "phone_number": "9876543210",
      "username": "johndoe",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Institution not found"
}
```

---

### 4. Get Mentors by Standard ID
Retrieve all mentors associated with a specific standard (through standard sections).

**Endpoint:** `GET /mentors/standard/:standardId`

**Path Parameters:**
- `standardId` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution_id": 1,
      "institution": {
        "id": 1,
        "name": "Green Valley High School"
      },
      "name": "John Doe",
      "phone_number": "9876543210",
      "username": "johndoe",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** Returns mentors who are linked to any section of the specified standard through the `mentor_standard_sections` table.

---

### 5. Get Mentor by ID
Retrieve a specific mentor.

**Endpoint:** `GET /mentors/:id`

**Path Parameters:**
- `id` (number): Mentor ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "institution": {
      "id": 1,
      "name": "Green Valley High School"
    },
    "name": "John Doe",
    "phone_number": "9876543210",
    "username": "johndoe",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
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

### 6. Update Mentor
Update an existing mentor.

**Endpoint:** `PATCH /mentors/:id`

**Path Parameters:**
- `id` (number): Mentor ID

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone_number": "9876543212",
  "is_active": false,
  "sections": [
    {
      "standard_section_id": 2,
      "categories": [3, 4, 5]
    }
  ]
}
```

**Validation Rules:**
- `institution_id`: Optional, positive number (must exist if provided)
- `name`: Optional, string, min 1 character, max 255 characters
- `phone_number`: Optional, string, max 20 characters
- `username`: Optional, string, min 1 character, max 255 characters
- `password`: Optional, string, min 1 character (will be hashed if provided)
- `is_active`: Optional, boolean

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "institution": {
      "id": 1,
      "name": "Green Valley High School"
    },
    "name": "John Doe Updated",
    "phone_number": "9876543212",
    "username": "johndoe",
    "is_active": false,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T11:00:00.000Z"
  },
  "message": "Updated"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Mentor not found"
}
```

---

### 7. Delete Mentor
Soft delete a mentor.

**Endpoint:** `DELETE /mentors/:id`

**Path Parameters:**
- `id` (number): Mentor ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Deleted"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Mentor not found"
}
```

---

## Data Models

### Mentor
```typescript
{
  id: number;
  institution_id: number | null;
  name: string;
  phone_number: string | null;
  username: string;
  password: string; // Hashed with bcrypt
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  institution?: Institution;
  mentorStandardSections?: MentorStandardSection[];
}
```

### MentorStandardSection
```typescript
{
  id: number;
  mentor_id: number;
  standard_section_id: number;
  created_at: Date;
  updated_at: Date;
  mentor: Mentor;
  standardSection: StandardSection;
  mentorStandardSectionCategories?: MentorStandardSectionCategory[];
}
```

### MentorStandardSectionCategory
```typescript
{
  id: number;
  mentor_standard_section_id: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  mentorStandardSection: MentorStandardSection;
  category: Category;
}
```

---

## Important Notes

1. **Password Security:**
   - Passwords are automatically hashed using bcrypt before storage
   - Never return password in API responses
   - Password field is excluded from all responses

2. **Institution Relationship:**
   - Mentors can optionally belong to an institution
   - If `institution_id` is provided, the institution must exist
   - Setting `institution_id` to `null` removes the association

3. **Standard Sections:**
   - Mentors are linked to standard sections through `mentor_standard_sections` table
   - Use the `GET /mentors/standard/:standardId` endpoint to find mentors for a specific standard
   - The query joins through `mentor_standard_sections` → `standard_sections` → `standards`

4. **Soft Delete:**
   - Mentors use soft delete (deleted_at timestamp)
   - Deleted mentors are not returned in queries
   - Soft delete cascades to related records

5. **Route Ordering:**
   - More specific routes (`/mentors/institution/:id`, `/mentors/standard/:id`) come before the generic route (`/mentors/:id`)
   - This is already handled in the controller

6. **Sections & Categories:**
   - Include the `sections` array in create/update payloads to link mentors to standard sections
   - Each entry requires `standard_section_id` and accepts optional `categories`
   - Categories accept numeric IDs or numeric strings; invalid entries are ignored
   - Sending an empty `sections` array removes all existing section/category assignments

---

## Example Usage

### Create a Mentor
```bash
curl -X POST http://localhost:3000/api/v1/mentors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "institution_id": 1,
    "name": "John Doe",
    "phone_number": "9876543210",
    "username": "johndoe",
    "password": "securepassword123",
    "is_active": true,
    "sections": [
      {
        "standard_section_id": 1,
        "categories": [1, 2]
      }
    ]
  }'
```

### Get Mentors by Institution
```bash
curl -X GET http://localhost:3000/api/v1/mentors/institution/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Mentors by Standard
```bash
curl -X GET http://localhost:3000/api/v1/mentors/standard/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Mentor
```bash
curl -X PATCH http://localhost:3000/api/v1/mentors/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "phone_number": "9876543212",
    "is_active": false,
    "sections": [
      {
        "standard_section_id": 3,
        "categories": [5, 6]
      }
    ]
  }'
```

### Update Mentor Password
```bash
curl -X PATCH http://localhost:3000/api/v1/mentors/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "password": "newsecurepassword123"
  }'
```

### Delete Mentor
```bash
curl -X DELETE http://localhost:3000/api/v1/mentors/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

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

**400 Bad Request (Not Found):**
```json
{
  "success": false,
  "message": "Mentor not found"
}
```

**400 Bad Request (Institution Not Found):**
```json
{
  "success": false,
  "message": "Institution not found"
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

## Database Schema

### mentors Table
- `id` - BIGINT, Primary Key
- `institution_id` - BIGINT, Foreign Key to institutions
- `name` - VARCHAR(255)
- `phone_number` - VARCHAR(20), Nullable
- `username` - VARCHAR(255)
- `password` - TEXT (hashed)
- `is_active` - BOOLEAN, Default TRUE
- `deleted_at` - TIMESTAMP, Nullable (soft delete)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### mentor_standard_sections Table
- `id` - BIGINT, Primary Key
- `mentor_id` - BIGINT, Foreign Key to mentors
- `standard_section_id` - BIGINT, Foreign Key to standard_sections
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP
- Unique constraint on (mentor_id, standard_section_id)

### mentor_standard_section_category Table
- `id` - BIGINT, Primary Key
- `mentor_standard_section_id` - BIGINT, Foreign Key to mentor_standard_sections
- `category_id` - BIGINT, Foreign Key to categories
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP
- Unique constraint on (mentor_standard_section_id, category_id)

---

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Endpoints are protected by the global `AuthGuard`.

