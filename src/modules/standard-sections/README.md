# Standard Sections API Documentation

## Base URL
```
/standard-sections
```

## Overview
The Standard Sections API provides CRUD operations for managing sections within standards. Each section belongs to a specific standard.

---

## Endpoints

### 1. Create Section
Create a new section for a standard.

**Endpoint:** `POST /standard-sections`

**Request Body:**
```json
{
  "name": "Section A",
  "standard_id": 1,
  "is_active": true
}
```

**Validation Rules:**
- `name`: Required, string, min 1 character, max 150 characters
- `standard_id`: Required, positive number (must exist)
- `is_active`: Optional, boolean, defaults to `true`

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Section A",
    "is_active": true,
    "standard_id": 1,
    "standard": {
      "id": 1,
      "name": "Grade 10",
      "description": "Tenth standard curriculum"
    },
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
  "message": "Standard not found"
}
```

---

### 2. Get All Sections
Retrieve all sections (excluding soft-deleted).

**Endpoint:** `GET 



`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Section A",
      "is_active": true,
      "standard_id": 1,
      "standard": {
        "id": 1,
        "name": "Grade 10",
        "description": "Tenth standard curriculum"
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Section B",
      "is_active": true,
      "standard_id": 1,
      "standard": {
        "id": 1,
        "name": "Grade 10",
        "description": "Tenth standard curriculum"
      },
      "created_at": "2025-01-15T10:31:00.000Z",
      "updated_at": "2025-01-15T10:31:00.000Z"
    }
  ]
}
```

---

### 3. Get Sections by Standard ID
Retrieve all sections for a specific standard.

**Endpoint:** `GET /standard-sections/standard/:standardId`

**Path Parameters:**
- `standardId` (number): Standard ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Section A",
      "is_active": true,
      "standard_id": 1,
      "standard": {
        "id": 1,
        "name": "Grade 10",
        "description": "Tenth standard curriculum"
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Section B",
      "is_active": true,
      "standard_id": 1,
      "standard": {
        "id": 1,
        "name": "Grade 10",
        "description": "Tenth standard curriculum"
      },
      "created_at": "2025-01-15T10:31:00.000Z",
      "updated_at": "2025-01-15T10:31:00.000Z"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Standard not found"
}
```

---

### 4. Get Section by ID
Retrieve a specific section.

**Endpoint:** `GET /standard-sections/:id`

**Path Parameters:**
- `id` (number): Section ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Section A",
    "is_active": true,
    "standard_id": 1,
    "standard": {
      "id": 1,
      "name": "Grade 10",
      "description": "Tenth standard curriculum"
    },
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

### 5. Update Section
Update an existing section.

**Endpoint:** `PATCH /standard-sections/:id`

**Path Parameters:**
- `id` (number): Section ID

**Request Body:**
```json
{
  "name": "Section A Updated",
  "is_active": false
}
```

**Validation Rules:**
- `name`: Optional, string, min 1 character, max 150 characters
- `standard_id`: Optional, positive number (must exist if provided)
- `is_active`: Optional, boolean

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Section A Updated",
    "is_active": false,
    "standard_id": 1,
    "standard": {
      "id": 1,
      "name": "Grade 10",
      "description": "Tenth standard curriculum"
    },
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
  "message": "Section not found"
}
```

---

### 6. Delete Section
Soft delete a section.

**Endpoint:** `DELETE /standard-sections/:id`

**Path Parameters:**
- `id` (number): Section ID

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
  "message": "Section not found"
}
```

---

## Example Usage

### Create a Section
```bash
curl -X POST http://localhost:3000/standard-sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Section A",
    "standard_id": 1,
    "is_active": true
  }'
```

### Get All Sections for a Standard
```bash
curl -X GET http://localhost:3000/standard-sections/standard/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update a Section
```bash
curl -X PATCH http://localhost:3000/standard-sections/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Section A Updated",
    "is_active": false
  }'
```

### Delete a Section
```bash
curl -X DELETE http://localhost:3000/standard-sections/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes

- All endpoints require authentication (Bearer token)
- Sections are soft-deleted (deleted_at timestamp)
- When creating/updating, the standard_id must reference an existing standard
- Sections are ordered by creation date (newest first)

