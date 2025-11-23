# Participants API Documentation

## Base URL
```
/participants
```

## Overview
The Participants API provides CRUD operations for managing participants (students). Participants can be associated with institutions, standard sections, and multiple standard sections through the `participants_standard_sections` junction table.

---

## Endpoints

### 1. Create Participant
Create a new participant.

**Endpoint:** `POST /participants`

**Request Body:**
```json
{
  "institution_id": 1,
  "name": "John Doe",
  "roll_number": "R001",
  "password_hash": "$2b$10$hashedpasswordhere",
  "email": "john.doe@example.com",
  "phone_number": "9876543210",
  "standard_id": 1,
  "standard_section_ids": [1, 2, 3]
}
```

**Validation Rules:**
- `institution_id`: Optional, positive number (must exist if provided)
- `name`: Required, string, min 1 character, max 255 characters
- `roll_number`: Optional, string, max 100 characters, nullable
- `password_hash`: Required, string, min 1 character (should be hashed)
- `email`: Optional, valid email format, max 255 characters, nullable
- `phone_number`: Optional, string, max 20 characters, nullable
- `standard_id`: Required, positive number (must exist, references standard_sections table)
- `standard_section_ids`: Optional, array of positive numbers, defaults to empty array

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "name": "John Doe",
    "roll_number": "R001",
    "password_hash": "$2b$10$hashedpasswordhere",
    "email": "john.doe@example.com",
    "phone_number": "9876543210",
    "standard_id": 1,
    "standard_section_ids": [1, 2, 3],
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z",
    "deleted_at": null
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

### 2. Get All Participants
Retrieve all participants (excluding soft-deleted).

**Endpoint:** `GET /participants`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "institution_id": 1,
      "name": "John Doe",
      "roll_number": "R001",
      "password_hash": "$2b$10$hashedpasswordhere",
      "email": "john.doe@example.com",
      "phone_number": "9876543210",
      "standard_id": 1,
      "standard_section_ids": [1, 2, 3],
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z",
      "deleted_at": null
    },
    {
      "id": 2,
      "institution_id": 1,
      "name": "Jane Smith",
      "roll_number": "R002",
      "password_hash": "$2b$10$hashedpasswordhere",
      "email": "jane.smith@example.com",
      "phone_number": "9876543211",
      "standard_id": 2,
      "standard_section_ids": [4, 5],
      "created_at": "2025-01-15T10:31:00.000Z",
      "updated_at": "2025-01-15T10:31:00.000Z",
      "deleted_at": null
    }
  ]
}
```

---

### 3. Get Participant by ID
Retrieve a specific participant.

**Endpoint:** `GET /participants/:id`

**Path Parameters:**
- `id` (number): Participant ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "name": "John Doe",
    "roll_number": "R001",
    "password_hash": "$2b$10$hashedpasswordhere",
    "email": "john.doe@example.com",
    "phone_number": "9876543210",
    "standard_id": 1,
    "standard_section_ids": [1, 2, 3],
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z",
    "deleted_at": null
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

### 4. Update Participant
Update an existing participant.

**Endpoint:** `PATCH /participants/:id`

**Path Parameters:**
- `id` (number): Participant ID

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "roll_number": "R001-UPDATED",
  "email": "john.updated@example.com",
  "phone_number": "9876543212",
  "standard_id": 2,
  "standard_section_ids": [4, 5, 6]
}
```

**Validation Rules:**
- `institution_id`: Optional, positive number (must exist if provided)
- `name`: Optional, string, min 1 character, max 255 characters
- `roll_number`: Optional, string, max 100 characters, nullable
- `password_hash`: Optional, string (will be stored as provided)
- `email`: Optional, valid email format, max 255 characters, nullable
- `phone_number`: Optional, string, max 20 characters, nullable
- `standard_id`: Optional, positive number (must exist if provided)
- `standard_section_ids`: Optional, array of positive numbers (replaces existing mappings)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "institution_id": 1,
    "name": "John Doe Updated",
    "roll_number": "R001-UPDATED",
    "password_hash": "$2b$10$hashedpasswordhere",
    "email": "john.updated@example.com",
    "phone_number": "9876543212",
    "standard_id": 2,
    "standard_section_ids": [4, 5, 6],
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T11:00:00.000Z",
    "deleted_at": null
  },
  "message": "Updated"
}
```

**Note:** When `standard_section_ids` is provided in the update, it completely replaces the existing section mappings. To clear all sections, pass an empty array `[]`.

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Participant not found"
}
```

---

### 5. Delete Participant
Soft delete a participant.

**Endpoint:** `DELETE /participants/:id`

**Path Parameters:**
- `id` (number): Participant ID

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
  "message": "Participant not found"
}
```

**Note:** Deleting a participant also removes all associated `participants_standard_sections` mappings.

---

## Data Models

### Participant
```typescript
{
  id: number;
  institution_id: number | null;
  name: string;
  roll_number: string | null;
  password_hash: string;
  email: string | null;
  phone_number: string | null;
  standard_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  institution?: Institution;
  participantStandardSections?: ParticipantStandardSection[];
}
```

### ParticipantStandardSection (Junction Table)
```typescript
{
  id: number;
  participant_id: number;
  standard_section_id: number;
  participant: Participant;
  standardSection: StandardSection;
}
```

---

## Important Notes

1. **Password Security:**
   - Passwords should be hashed before sending to the API
   - The API stores the password hash directly
   - Never return password hash in API responses (currently returned for reference, but should be excluded in production)

2. **Institution Relationship:**
   - Participants can optionally belong to an institution
   - If `institution_id` is provided, the institution must exist
   - Setting `institution_id` to `null` removes the association

3. **Standard ID:**
   - `standard_id` references the `standard_sections` table (as per SQL schema)
   - This is required and must exist when creating a participant
   - This is different from the `standards` table

4. **Standard Sections:**
   - Participants can be linked to multiple standard sections
   - `standard_section_ids` is an array of standard section IDs
   - On update, providing `standard_section_ids` completely replaces existing mappings
   - To clear all section mappings, pass an empty array `[]`

5. **Soft Delete:**
   - Participants use soft delete (deleted_at timestamp)
   - Deleted participants are not returned in queries
   - Deleting a participant also removes all `participants_standard_sections` mappings

6. **Update Behavior:**
   - Only provided fields are updated
   - `standard_section_ids` completely replaces existing mappings when provided
   - If `standard_section_ids` is not provided in update, existing mappings remain unchanged

---

## Example Usage

### Create a Participant
```bash
curl -X POST http://localhost:3000/api/v1/participants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "institution_id": 1,
    "name": "John Doe",
    "roll_number": "R001",
    "password_hash": "$2b$10$hashedpasswordhere",
    "email": "john.doe@example.com",
    "phone_number": "9876543210",
    "standard_id": 1,
    "standard_section_ids": [1, 2, 3]
  }'
```

### Get All Participants
```bash
curl -X GET http://localhost:3000/api/v1/participants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Participant by ID
```bash
curl -X GET http://localhost:3000/api/v1/participants/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Participant
```bash
curl -X PATCH http://localhost:3000/api/v1/participants/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "standard_section_ids": [4, 5, 6]
  }'
```

### Update Participant Password
```bash
curl -X PATCH http://localhost:3000/api/v1/participants/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "password_hash": "$2b$10$newhashedpasswordhere"
  }'
```

### Update Participant Sections (Replace All)
```bash
curl -X PATCH http://localhost:3000/api/v1/participants/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "standard_section_ids": [7, 8, 9]
  }'
```

### Clear All Sections
```bash
curl -X PATCH http://localhost:3000/api/v1/participants/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "standard_section_ids": []
  }'
```

### Delete Participant
```bash
curl -X DELETE http://localhost:3000/api/v1/participants/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "message": "Validation error message",
  "error": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**400 Bad Request (Not Found):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**400 Bad Request (Institution Not Found):**
```json
{
  "success": false,
  "message": "Institution not found"
}
```

**400 Bad Request (Standard Section Not Found):**
```json
{
  "success": false,
  "message": "Standard section not found"
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

### participants Table
- `id` - BIGINT, Primary Key
- `institution_id` - BIGINT, Foreign Key to institutions (nullable)
- `name` - VARCHAR(255)
- `roll_number` - VARCHAR(100), Nullable
- `password_hash` - TEXT
- `email` - VARCHAR(255), Nullable
- `phone_number` - VARCHAR(20), Nullable
- `standard_id` - BIGINT, Foreign Key to standard_sections
- `deleted_at` - TIMESTAMP, Nullable (soft delete)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### participants_standard_sections Table (Junction Table)
- `id` - BIGINT, Primary Key
- `participant_id` - BIGINT, Foreign Key to participants
- `standard_section_id` - BIGINT, Foreign Key to standard_sections
- No timestamps (as per SQL schema)

---

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Endpoints are protected by the global `AuthGuard`.

---

## Field Descriptions

### standard_id
- **Type:** Number (BIGINT)
- **Required:** Yes (on create)
- **Description:** References a record in the `standard_sections` table. This is the primary standard section assignment for the participant.

### standard_section_ids
- **Type:** Array of Numbers
- **Required:** No
- **Description:** Array of standard section IDs that the participant is associated with. This allows a participant to be linked to multiple standard sections through the `participants_standard_sections` junction table.

### institution_id
- **Type:** Number (BIGINT)
- **Required:** No
- **Description:** References a record in the `institutions` table. Links the participant to an institution.

### password_hash
- **Type:** String (TEXT)
- **Required:** Yes (on create)
- **Description:** Hashed password. Should be hashed using a secure hashing algorithm (e.g., bcrypt) before sending to the API.

---

## Common Use Cases

### 1. Create Participant with Multiple Sections
```json
{
  "institution_id": 1,
  "name": "John Doe",
  "roll_number": "R001",
  "password_hash": "$2b$10$hashedpassword",
  "email": "john@example.com",
  "phone_number": "9876543210",
  "standard_id": 1,
  "standard_section_ids": [1, 2, 3, 4]
}
```

### 2. Update Only Name
```json
{
  "name": "John Doe Updated"
}
```

### 3. Update Only Sections
```json
{
  "standard_section_ids": [5, 6, 7]
}
```

### 4. Remove All Sections
```json
{
  "standard_section_ids": []
}
```

### 5. Update Multiple Fields
```json
{
  "name": "John Doe Updated",
  "email": "newemail@example.com",
  "phone_number": "9876543211",
  "standard_id": 2,
  "standard_section_ids": [8, 9]
}
```

---

## Notes on Standard Sections

- The `standard_id` field is a direct foreign key to `standard_sections` table
- The `standard_section_ids` array creates multiple associations through the junction table
- When updating `standard_section_ids`, the entire set is replaced (not merged)
- Sections are loaded using direct SQL queries for reliability
- All section mappings are deleted when a participant is soft-deleted

