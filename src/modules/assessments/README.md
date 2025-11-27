# Assessments API Documentation

## Overview

The Assessments API provides endpoints for managing assessments (examinations/tests) in the system. Assessments can have multiple sections, be associated with standards, and include questions mapped to sections. Assessments support both prebuild and scheduled types, with various configuration options for timing, question selection, and result display.

**Base Path:** `/api/v1/assessments`

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Create Assessment](#1-create-assessment)
   - [Get All Assessments](#2-get-all-assessments)
   - [Get Assessment by ID](#3-get-assessment-by-id)
   - [Update Assessment](#4-update-assessment)
   - [Delete Assessment](#5-delete-assessment)
   - [Add Questions to Sections](#6-add-questions-to-sections)
   - [Get Section Questions by Assessment](#7-get-section-questions-by-assessment)
3. [Data Models](#data-models)
4. [Request/Response Examples](#requestresponse-examples)
5. [Error Handling](#error-handling)
6. [Important Notes](#important-notes)

---

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## API Endpoints

### 1. Create Assessment

Creates a new assessment with sections and optional standard associations.

**Endpoint:** `POST /api/v1/assessments`

**Request Body:**

```json
{
  "name": "Mathematics Final Exam",
  "category_id": 1,
  "topic_id": 1,
  "total_marks": 100,
  "examination_duration_minutes": "120",
  "examination_code": "MATH-FINAL-2024",
  "type": "prebuild",
  "schedule_date": null,
  "is_question_timed": false,
  "question_time_seconds": null,
  "question_pick": "manual",
  "is_homework": false,
  "is_question_shuffle": true,
  "is_display_result": true,
  "reminder_time_to_end_seconds": 300,
  "created_by": "teacher001",
  "reviewed_by": "admin001",
  "board_id": 1,
  "sections": [
    {
      "name": "Section A - Multiple Choice",
      "total_question_count": 20,
      "positive_mark": 1,
      "negative_mark": 0.25,
      "total_duration_minutes": 60,
      "status": "draft"
    },
    {
      "name": "Section B - Short Answer",
      "total_question_count": 10,
      "positive_mark": 2,
      "negative_mark": 0,
      "total_duration_minutes": 60,
      "status": "draft"
    }
  ],
  "standards": [1, 2, 3]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Assessment name |
| `category_id` | number | Yes | ID of the category |
| `topic_id` | number | Yes | ID of the topic |
| `total_marks` | number | Yes | Total marks for the assessment |
| `examination_duration_minutes` | string | Yes | Total duration in minutes (as string, e.g., "120") |
| `examination_code` | string | Yes | Unique examination code |
| `type` | enum | Yes | Assessment type: `"prebuild"` or `"schedule"` |
| `schedule_date` | string | No | ISO datetime string for scheduled assessments (required if type is "schedule") |
| `is_question_timed` | boolean | Yes | Whether individual questions are timed |
| `question_time_seconds` | string | No | Time per question in seconds (required if `is_question_timed` is true) |
| `question_pick` | enum | Yes | Question selection method: `"auto"` or `"manual"` |
| `is_homework` | boolean | Yes | Whether this is a homework assignment |
| `is_question_shuffle` | boolean | Yes | Whether to shuffle questions |
| `is_display_result` | boolean | Yes | Whether to display results after completion |
| `reminder_time_to_end_seconds` | number | No | Reminder time before end (in seconds) |
| `created_by` | string | Yes | User ID who created the assessment |
| `reviewed_by` | string | No | User ID who reviewed the assessment |
| `board_id` | number | Yes | ID of the board |
| `sections` | array | Yes | Array of assessment sections (minimum 1 required) |
| `standards` | array | No | Array of standard IDs to associate with the assessment |

**Section Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | No | Section ID (for updates, omit for new sections) |
| `name` | string | Yes | Section name |
| `total_question_count` | number | Yes | Total number of questions in this section |
| `positive_mark` | number | Yes | Marks awarded for correct answer (default: 0) |
| `negative_mark` | number | Yes | Marks deducted for incorrect answer (default: 0) |
| `total_duration_minutes` | number | No | Duration for this section in minutes |
| `status` | enum | Yes | Section status: `"draft"` or `"publish"` |

**Response:**

```json
{
  "status": true,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Mathematics Final Exam",
    "total_marks": 100,
    "examination_duration_minutes": "120",
    "examination_code": "MATH-FINAL-2024",
    "type": "prebuild",
    "schedule_date": null,
    "is_question_timed": false,
    "question_time_seconds": null,
    "question_pick": "manual",
    "is_homework": false,
    "is_question_shuffle": true,
    "is_display_result": true,
    "reminder_time_to_end_seconds": 300,
    "created_by": "teacher001",
    "reviewed_by": "admin001",
    "category": {
      "id": 1,
      "name": "Mathematics"
    },
    "topic": {
      "id": 1,
      "name": "Algebra"
    },
    "board": {
      "id": 1,
      "name": "CBSE"
    },
    "sections": [
      {
        "id": 1,
        "name": "Section A - Multiple Choice",
        "total_question_count": 20,
        "positive_mark": 1,
        "negative_mark": 0.25,
        "total_duration_minutes": 60,
        "status": "draft"
      }
    ],
    "assessmentStandards": [],
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  "error": null
}
```

---

### 2. Get All Assessments

Retrieves all assessments from the system.

**Endpoint:** `GET /api/v1/assessments`

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Mathematics Final Exam",
      "total_marks": 100,
      "examination_duration_minutes": "120",
      "examination_code": "MATH-FINAL-2024",
      "type": "prebuild",
      "schedule_date": null,
      "is_question_timed": false,
      "question_time_seconds": null,
      "question_pick": "manual",
      "is_homework": false,
      "is_question_shuffle": true,
      "is_display_result": true,
      "reminder_time_to_end_seconds": 300,
      "created_by": "teacher001",
      "reviewed_by": "admin001",
      "category": {
        "id": 1,
        "name": "Mathematics"
      },
      "topic": {
        "id": 1,
        "name": "Algebra"
      },
      "board": {
        "id": 1,
        "name": "CBSE"
      },
      "assessmentStandards": [
        {
          "id": 1,
          "standard": {
            "id": 1,
            "name": "Class 10"
          }
        }
      ],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "error": null
}
```

---

### 3. Get Assessment by ID

Retrieves a specific assessment by its ID with all related data including sections and questions.

**Endpoint:** `GET /api/v1/assessments/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The assessment ID |

**Example Request:**

```
GET /api/v1/assessments/1
```

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Mathematics Final Exam",
    "total_marks": 100,
    "examination_duration_minutes": "120",
    "examination_code": "MATH-FINAL-2024",
    "type": "prebuild",
    "schedule_date": null,
    "is_question_timed": false,
    "question_time_seconds": null,
    "question_pick": "manual",
    "is_homework": false,
    "is_question_shuffle": true,
    "is_display_result": true,
    "reminder_time_to_end_seconds": 300,
    "created_by": "teacher001",
    "reviewed_by": "admin001",
    "category": {
      "id": 1,
      "name": "Mathematics"
    },
    "topic": {
      "id": 1,
      "name": "Algebra"
    },
    "board": {
      "id": 1,
      "name": "CBSE"
    },
    "sections": [
      {
        "id": 1,
        "name": "Section A - Multiple Choice",
        "total_question_count": 20,
        "positive_mark": 1,
        "negative_mark": 0.25,
        "total_duration_minutes": 60,
        "status": "draft",
        "sectionQuestions": [
          {
            "id": 1,
            "question": {
              "id": 1,
              "question_text": "What is 2 + 2?",
              "mark": 1
            }
          }
        ]
      }
    ],
    "assessmentStandards": [
      {
        "id": 1,
        "standard": {
          "id": 1,
          "name": "Class 10"
        }
      }
    ],
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  "error": null
}
```

**Error Response (Assessment Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Assessment not found"
    }
  ]
}
```

---

### 4. Update Assessment

Updates an existing assessment. Supports updating sections (create, update, delete) and standards.

**Endpoint:** `PATCH /api/v1/assessments/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The assessment ID |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "name": "Mathematics Final Exam - Updated",
  "category_id": 2,
  "topic_id": 2,
  "total_marks": 120,
  "examination_duration_minutes": "150",
  "examination_code": "MATH-FINAL-2024-UPDATED",
  "type": "schedule",
  "schedule_date": "2024-02-15T10:00:00.000Z",
  "is_question_timed": true,
  "question_time_seconds": "60",
  "question_pick": "auto",
  "is_homework": true,
  "is_question_shuffle": false,
  "is_display_result": false,
  "reminder_time_to_end_seconds": 600,
  "created_by": "teacher001",
  "reviewed_by": "admin002",
  "board_id": 2,
  "sections": [
    {
      "id": 1,
      "name": "Section A - Updated",
      "total_question_count": 25,
      "positive_mark": 1.5,
      "negative_mark": 0.5,
      "total_duration_minutes": 70,
      "status": "publish"
    },
    {
      "name": "Section C - New Section",
      "total_question_count": 15,
      "positive_mark": 2,
      "negative_mark": 0,
      "total_duration_minutes": 45,
      "status": "draft"
    }
  ],
  "clear_existing_sections": [2],
  "standards": [1, 4, 5]
}
```

**Field Descriptions for Update:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clear_existing_sections` | array | No | Array of section IDs to soft delete |

**Section Update Logic:**

- **Sections with `id`**: Will be updated if they exist, or created as new if the ID doesn't exist
- **Sections without `id`**: Will be created as new sections
- **Sections not in the payload**: Will be soft deleted if they exist in the database
- **Sections in `clear_existing_sections`**: Will be explicitly soft deleted

**Standards Update Logic:**

- Existing standards are deleted and replaced with the new array
- If `standards` array is empty or not provided, existing standards are removed

**Response:**

```json
{
  "status": true,
  "message": "Resource updated successfully",
  "data": null,
  "error": null
}
```

**Error Response (Assessment Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Assessment not found"
    }
  ]
}
```

---

### 5. Delete Assessment

Soft deletes an assessment (marks it as deleted but doesn't remove from database).

**Endpoint:** `DELETE /api/v1/assessments/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The assessment ID |

**Example Request:**

```
DELETE /api/v1/assessments/1
```

**Response:**

```json
{
  "status": true,
  "message": "Resource deleted successfully",
  "data": null,
  "error": null
}
```

**Error Response (Assessment Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Assessment not found"
    }
  ]
}
```

---

### 6. Add Questions to Sections

Maps questions to assessment sections. Can add new questions and remove existing ones in a single operation.

**Endpoint:** `POST /api/v1/assessments/add-questions`

**Request Body:**

```json
{
  "question_mapping": [
    {
      "section_id": 1,
      "question_ids": [1, 2, 3, 4, 5],
      "remove_questions_id": [10, 11]
    },
    {
      "section_id": 2,
      "question_ids": [6, 7, 8],
      "remove_questions_id": []
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question_mapping` | array | Yes | Array of question mapping objects (minimum 1 required) |

**Question Mapping Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section_id` | number | Yes | ID of the assessment section |
| `question_ids` | array | Yes | Array of question IDs to add to this section |
| `remove_questions_id` | array | Yes | Array of section question mapping IDs to remove (IDs from `section_questions` table) |

**Note:** `remove_questions_id` refers to the IDs in the `section_questions` junction table, not the question IDs themselves.

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "assessmentSection": {
        "id": 1
      },
      "question": {
        "id": 1
      },
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "assessmentSection": {
        "id": 1
      },
      "question": {
        "id": 2
      },
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "error": null
}
```

---

### 7. Get Section Questions by Assessment

Retrieves all sections for an assessment with their mapped questions.

**Endpoint:** `POST /api/v1/assessments/section-questions/:assessmentId`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assessmentId` | number | Yes | The assessment ID |

**Example Request:**

```
POST /api/v1/assessments/section-questions/1
```

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Section A - Multiple Choice",
      "total_question_count": 20,
      "positive_mark": 1,
      "negative_mark": 0.25,
      "total_duration_minutes": 60,
      "status": "draft",
      "sectionQuestions": [
        {
          "id": 1,
          "question": {
            "id": 1,
            "question_text": "What is 2 + 2?",
            "mark": 1,
            "question_media": [],
            "mcq_options": [
              {
                "id": 1,
                "option_text": "3",
                "is_correct_answer": false,
                "is_active": true
              },
              {
                "id": 2,
                "option_text": "4",
                "is_correct_answer": true,
                "is_active": true
              }
            ],
            "explanation": {
              "id": 1,
              "explanation": "2 + 2 equals 4"
            }
          },
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        },
        {
          "id": 2,
          "question": {
            "id": 2,
            "question_text": "What is the capital of France?",
            "mark": 1,
            "question_media": [],
            "mcq_options": [],
            "explanation": null
          },
          "created_at": "2024-01-15T10:30:00.000Z",
          "updated_at": "2024-01-15T10:30:00.000Z"
        }
      ],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Section B - Short Answer",
      "total_question_count": 10,
      "positive_mark": 2,
      "negative_mark": 0,
      "total_duration_minutes": 60,
      "status": "draft",
      "sectionQuestions": [],
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "error": null
}
```

---

## Data Models

### Assessment Object

```typescript
{
  id: number;
  name: string;
  total_marks: number;
  examination_duration_minutes: string;
  examination_code: string;
  type: "prebuild" | "schedule";
  schedule_date: Date | null;
  is_question_timed: boolean;
  question_time_seconds: string | null;
  question_pick: "auto" | "manual";
  is_homework: boolean;
  is_question_shuffle: boolean;
  is_display_result: boolean;
  reminder_time_to_end_seconds: number | null;
  created_by: string;
  reviewed_by: string | null;
  category: Category;
  topic: Topic;
  board: Board;
  sections: AssessmentSection[];
  assessmentStandards: AssessmentStandard[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
```

### AssessmentSection Object

```typescript
{
  id: number;
  name: string;
  total_question_count: number;
  positive_mark: number;
  negative_mark: number;
  total_duration_minutes: number | null;
  status: "draft" | "publish";
  assessment: Assessment;
  sectionQuestions: SectionQuestion[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
```

### AssessmentStandard Object

```typescript
{
  id: number;
  assessment: Assessment;
  standard: Standard;
  institution?: Institution;
  created_at: Date;
  updated_at: Date;
}
```

### SectionQuestion Object

```typescript
{
  id: number;
  assessmentSection: AssessmentSection;
  question: Question;
  created_at: Date;
  updated_at: Date;
}
```

---

## Request/Response Examples

### Complete Create Request Example

```json
{
  "name": "Science Quiz - Chapter 5",
  "category_id": 2,
  "topic_id": 3,
  "total_marks": 50,
  "examination_duration_minutes": "60",
  "examination_code": "SCI-QUIZ-CH5-2024",
  "type": "prebuild",
  "schedule_date": null,
  "is_question_timed": true,
  "question_time_seconds": "90",
  "question_pick": "auto",
  "is_homework": false,
  "is_question_shuffle": true,
  "is_display_result": true,
  "reminder_time_to_end_seconds": 180,
  "created_by": "teacher002",
  "reviewed_by": null,
  "board_id": 1,
  "sections": [
    {
      "name": "Multiple Choice Questions",
      "total_question_count": 15,
      "positive_mark": 2,
      "negative_mark": 0.5,
      "total_duration_minutes": 30,
      "status": "draft"
    },
    {
      "name": "True/False Questions",
      "total_question_count": 10,
      "positive_mark": 1,
      "negative_mark": 0.25,
      "total_duration_minutes": 15,
      "status": "draft"
    }
  ],
  "standards": [5, 6]
}
```

### Update Request with Section Management

```json
{
  "name": "Updated Assessment Name",
  "sections": [
    {
      "id": 1,
      "name": "Updated Section Name",
      "total_question_count": 25,
      "positive_mark": 1.5,
      "negative_mark": 0.5,
      "total_duration_minutes": 45,
      "status": "publish"
    },
    {
      "name": "New Section",
      "total_question_count": 10,
      "positive_mark": 2,
      "negative_mark": 0,
      "total_duration_minutes": 20,
      "status": "draft"
    }
  ],
  "clear_existing_sections": [3, 4],
  "standards": [1, 2]
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": false,
  "message": "Error message",
  "data": null,
  "error": [
    {
      "field": "field_name",
      "message": "Detailed error message"
    }
  ]
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid authentication |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

### Validation Errors

When validation fails, the response includes detailed field-level errors:

```json
{
  "status": false,
  "message": "Oops! It looks like some information is missing or incorrect. Please review and try again.",
  "data": null,
  "error": [
    {
      "field": "name",
      "message": "Required"
    },
    {
      "field": "sections",
      "message": "Expected array, received string"
    },
    {
      "field": "type",
      "message": "Invalid enum value. Expected 'prebuild' | 'schedule'"
    }
  ]
}
```

---

## Important Notes

1. **Transaction Safety**: Create and update operations are wrapped in database transactions to ensure data consistency.

2. **Soft Delete**: Delete operations perform soft deletes. Deleted assessments are not removed from the database but are marked with a `deleted_at` timestamp.

3. **Section Management**:
   - Sections are created, updated, or deleted based on the payload
   - Sections with `id` are updated if they exist, or created if they don't
   - Sections without `id` are always created as new
   - Sections not included in the update payload are soft deleted
   - Use `clear_existing_sections` to explicitly delete sections

4. **Standards Association**:
   - Standards are replaced entirely on update (not merged)
   - If `standards` array is empty or not provided, all existing standards are removed
   - Standards are stored in the `assessment_standards` junction table

5. **Question Mapping**:
   - Questions are mapped to sections via the `section_questions` junction table
   - `remove_questions_id` refers to the junction table IDs, not question IDs
   - You can add and remove questions in a single operation

6. **Assessment Types**:
   - `"prebuild"`: Pre-built assessment, can be used immediately
   - `"schedule"`: Scheduled assessment, requires `schedule_date`

7. **Question Pick Methods**:
   - `"auto"`: Questions are automatically selected based on criteria
   - `"manual"`: Questions are manually selected and mapped to sections

8. **Examination Code**: Must be unique across all assessments.

9. **Duration Fields**:
   - `examination_duration_minutes`: Total assessment duration (stored as string)
   - `total_duration_minutes`: Per-section duration (stored as number, nullable)
   - `question_time_seconds`: Per-question time (stored as string, nullable)

10. **Section Status**:
    - `"draft"`: Section is in draft mode
    - `"publish"`: Section is published and ready for use

11. **Relations**: All GET endpoints automatically load related data:
    - Assessment standards and their associated standards
    - Sections and their mapped questions (when using `findOne`)

12. **Required Fields for Create**:
    - `name`
    - `category_id`
    - `topic_id`
    - `total_marks`
    - `examination_duration_minutes`
    - `examination_code`
    - `type`
    - `is_question_timed`
    - `question_pick`
    - `is_homework`
    - `is_question_shuffle`
    - `is_display_result`
    - `created_by`
    - `board_id`
    - `sections` (array with at least one section)

---

## Usage Examples

### Creating a Scheduled Assessment

```bash
curl -X POST https://api.example.com/api/v1/assessments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Test",
    "category_id": 1,
    "topic_id": 1,
    "total_marks": 50,
    "examination_duration_minutes": "90",
    "examination_code": "MONTHLY-TEST-2024-01",
    "type": "schedule",
    "schedule_date": "2024-02-01T10:00:00.000Z",
    "is_question_timed": false,
    "question_time_seconds": null,
    "question_pick": "manual",
    "is_homework": false,
    "is_question_shuffle": true,
    "is_display_result": true,
    "reminder_time_to_end_seconds": 300,
    "created_by": "teacher001",
    "board_id": 1,
    "sections": [
      {
        "name": "Section A",
        "total_question_count": 20,
        "positive_mark": 1,
        "negative_mark": 0.25,
        "status": "draft"
      }
    ],
    "standards": [1, 2]
  }'
```

### Adding Questions to Sections

```bash
curl -X POST https://api.example.com/api/v1/assessments/add-questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_mapping": [
      {
        "section_id": 1,
        "question_ids": [1, 2, 3, 4, 5],
        "remove_questions_id": []
      },
      {
        "section_id": 2,
        "question_ids": [6, 7, 8, 9, 10],
        "remove_questions_id": []
      }
    ]
  }'
```

### Getting Section Questions

```bash
curl -X POST https://api.example.com/api/v1/assessments/section-questions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Updating Assessment Sections

```bash
curl -X PATCH https://api.example.com/api/v1/assessments/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Assessment Name",
    "sections": [
      {
        "id": 1,
        "name": "Updated Section",
        "total_question_count": 25,
        "positive_mark": 1.5,
        "negative_mark": 0.5,
        "status": "publish"
      }
    ],
    "standards": [1, 2, 3]
  }'
```

---

## Database Schema

The assessments module uses the following main tables:

- `assessments` - Main assessment table
- `assessment_sections` - Assessment sections
- `assessment_standards` - Junction table for assessment-standard associations
- `section_questions` - Junction table for section-question mappings

Relationships:
- Assessment → Category (ManyToOne)
- Assessment → Topic (ManyToOne)
- Assessment → Board (ManyToOne)
- Assessment → AssessmentSection (OneToMany)
- Assessment → AssessmentStandard (OneToMany)
- AssessmentSection → SectionQuestion (OneToMany)
- SectionQuestion → Question (ManyToOne)
- AssessmentStandard → Standard (ManyToOne)
- AssessmentStandard → Institution (ManyToOne, optional)

---

## Support

For issues or questions regarding the Assessments API, please contact the development team or refer to the main project documentation.

