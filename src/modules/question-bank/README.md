# Question Bank API Documentation

## Overview

The Question Bank API provides endpoints for managing questions in the system. Questions can include multiple choice options, media attachments, explanations, and are associated with categories, question types, sources, complexity levels, and boards.

**Base Path:** `/api/v1/question-bank`

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
   - [Create Question](#1-create-question)
   - [Get All Questions](#2-get-all-questions)
   - [Get Question by ID](#3-get-question-by-id)
   - [Update Question](#4-update-question)
   - [Delete Question](#5-delete-question)
   - [Get Questions by Institution](#6-get-questions-by-institution)
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

**Note:** The `/institution` endpoint specifically requires user context with `institution_id`.

---

## API Endpoints

### 1. Create Question

Creates a new question in the question bank with all associated data (options, media, explanations).

**Endpoint:** `POST /api/v1/question-bank`

**Request Body:**

```json
{
  "question_text": "What is the capital of France?",
  "question_type_id": 1,
  "category_id": 1,
  "source_id": 1,
  "mark": 1,
  "answerable_time_seconds": 60,
  "complexity_level_id": 1,
  "mcq_selection": "single",
  "created_by": "user123",
  "verified_by": "admin456",
  "status": "draft",
  "evaluation_method": "MANUAL",
  "board_id": 1,
  "question_media": [
    {
      "type": "image",
      "path": "/uploads/question1.jpg",
      "is_active": true
    }
  ],
  "mcq_options": [
    {
      "option_text": "Paris",
      "is_correct_answer": true,
      "is_active": true,
      "option_media": [
        {
          "type": "image",
          "path": "/uploads/paris.jpg",
          "is_active": true
        }
      ]
    },
    {
      "option_text": "London",
      "is_correct_answer": false,
      "is_active": true
    },
    {
      "option_text": "Berlin",
      "is_correct_answer": false,
      "is_active": true
    },
    {
      "option_text": "Madrid",
      "is_correct_answer": false,
      "is_active": true
    }
  ],
  "explanation": {
    "explanation": "Paris is the capital and largest city of France.",
    "answer_keywords": "Paris, capital, France",
    "explanation_media": [
      {
        "type": "image",
        "path": "/uploads/explanation1.jpg",
        "is_active": true
      }
    ]
  }
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question_text` | string | Yes | The question text |
| `question_type_id` | number | Yes | ID of the question type |
| `category_id` | number | Yes | ID of the category |
| `source_id` | number | Yes | ID of the question source |
| `mark` | number | Yes | Marks allocated for this question |
| `answerable_time_seconds` | number | Yes | Time in seconds to answer the question |
| `complexity_level_id` | number | Yes | ID of the complexity level |
| `mcq_selection` | string | No | MCQ selection type (e.g., "single", "multiple") |
| `created_by` | string | No | User ID who created the question |
| `verified_by` | string | No | User ID who verified the question |
| `status` | enum | Yes | Question status: `"draft"` or `"publish"` |
| `evaluation_method` | enum | No | Evaluation method: `"AI"` or `"MANUAL"` |
| `board_id` | number | Yes | ID of the board |
| `question_media` | array | No | Array of media attachments for the question |
| `mcq_options` | array | Yes | Array of MCQ options (minimum 2 required) |
| `explanation` | object | Yes | Explanation object with answer details |

**MCQ Option Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `option_text` | string | Yes | The option text |
| `is_correct_answer` | boolean | Yes | Whether this option is correct |
| `is_active` | boolean | Yes | Whether this option is active |
| `option_media` | array | No | Array of media attachments for the option |

**Media Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Media type (e.g., "image", "video", "audio") |
| `path` | string | Yes | Path to the media file |
| `is_active` | boolean | Yes | Whether the media is active |

**Explanation Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `explanation` | string | Yes | Explanation text |
| `answer_keywords` | string | No | Keywords for the answer |
| `explanation_media` | array | No | Array of media attachments for the explanation |

**Response:**

```json
{
  "status": true,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "question_text": "What is the capital of France?",
    "mark": 1,
    "answerable_time_seconds": 60,
    "mcq_selection": "single",
    "created_by": "user123",
    "verified_by": "admin456",
    "status": "draft",
    "evaluation_method": "MANUAL",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  "error": null
}
```

---

### 2. Get All Questions

Retrieves all questions from the question bank with optional search functionality.

**Endpoint:** `GET /api/v1/question-bank`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search term to filter questions by question text |

**Example Request:**

```
GET /api/v1/question-bank?search=capital
```

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "question_text": "What is the capital of France?",
      "mark": 1,
      "answerable_time_seconds": 60,
      "mcq_selection": "single",
      "created_by": "user123",
      "verified_by": "admin456",
      "status": "draft",
      "evaluation_method": "MANUAL",
      "question_media": [
        {
          "id": 1,
          "type": "image",
          "path": "/uploads/question1.jpg",
          "is_active": true
        }
      ],
      "mcq_options": [
        {
          "id": 1,
          "option_text": "Paris",
          "is_correct_answer": true,
          "is_active": true,
          "option_media": [
            {
              "id": 1,
              "type": "image",
              "path": "/uploads/paris.jpg",
              "is_active": true
            }
          ]
        },
        {
          "id": 2,
          "option_text": "London",
          "is_correct_answer": false,
          "is_active": true,
          "option_media": []
        }
      ],
      "explanation": {
        "id": 1,
        "explanation": "Paris is the capital and largest city of France.",
        "answer_keywords": "Paris, capital, France",
        "explanation_media": [
          {
            "id": 1,
            "type": "image",
            "path": "/uploads/explanation1.jpg",
            "is_active": true
          }
        ]
      },
      "questionType": {
        "id": 1,
        "name": "Multiple Choice"
      },
      "category": {
        "id": 1,
        "name": "Geography"
      },
      "source": {
        "id": 1,
        "name": "Textbook"
      },
      "complexityLevel": {
        "id": 1,
        "name": "Easy"
      },
      "board": {
        "id": 1,
        "name": "CBSE"
      },
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "error": null
}
```

---

### 3. Get Question by ID

Retrieves a specific question by its ID with all related data.

**Endpoint:** `GET /api/v1/question-bank/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The question ID |

**Example Request:**

```
GET /api/v1/question-bank/1
```

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "id": 1,
    "question_text": "What is the capital of France?",
    "mark": 1,
    "answerable_time_seconds": 60,
    "mcq_selection": "single",
    "created_by": "user123",
    "verified_by": "admin456",
    "status": "draft",
    "evaluation_method": "MANUAL",
    "question_media": [
      {
        "id": 1,
        "type": "image",
        "path": "/uploads/question1.jpg",
        "is_active": true
      }
    ],
    "mcq_options": [
      {
        "id": 1,
        "option_text": "Paris",
        "is_correct_answer": true,
        "is_active": true,
        "option_media": [
          {
            "id": 1,
            "type": "image",
            "path": "/uploads/paris.jpg",
            "is_active": true
          }
        ]
      }
    ],
    "explanation": {
      "id": 1,
      "explanation": "Paris is the capital and largest city of France.",
      "answer_keywords": "Paris, capital, France",
      "explanation_media": []
    },
    "questionType": {
      "id": 1,
      "name": "Multiple Choice"
    },
    "category": {
      "id": 1,
      "name": "Geography"
    },
    "source": {
      "id": 1,
      "name": "Textbook"
    },
    "complexityLevel": {
      "id": 1,
      "name": "Easy"
    },
    "board": {
      "id": 1,
      "name": "CBSE"
    },
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  "error": null
}
```

**Error Response (Question Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Question not found"
    }
  ]
}
```

---

### 4. Update Question

Updates an existing question. Supports partial updates and allows clearing existing media/options.

**Endpoint:** `PATCH /api/v1/question-bank/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The question ID |

**Request Body:**

All fields are optional. Only include fields you want to update.

```json
{
  "question_text": "What is the capital of France? (Updated)",
  "question_type_id": 1,
  "category_id": 2,
  "source_id": 1,
  "mark": 2,
  "answerable_time_seconds": 90,
  "complexity_level_id": 2,
  "mcq_selection": "multiple",
  "created_by": "user123",
  "verified_by": "admin789",
  "status": "publish",
  "evaluation_method": "AI",
  "board_id": 1,
  "question_media": [
    {
      "type": "image",
      "path": "/uploads/question1_updated.jpg",
      "is_active": true
    }
  ],
  "mcq_options": [
    {
      "option_text": "Paris",
      "is_correct_answer": true,
      "is_active": true
    },
    {
      "option_text": "Lyon",
      "is_correct_answer": false,
      "is_active": true
    }
  ],
  "explanation": {
    "explanation": "Updated explanation text.",
    "answer_keywords": "Paris, France"
  },
  "clear_existing_media": [1, 2],
  "clear_existing_options": [3, 4],
  "clear_options_media": [5, 6]
}
```

**Field Descriptions for Update:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `clear_existing_media` | array | No | Array of question media IDs to delete |
| `clear_existing_options` | array | No | Array of MCQ option IDs to soft delete |
| `clear_options_media` | array | No | Array of option media IDs to delete |

**Note:** When updating MCQ options, you can:
- Add new options by including them in `mcq_options`
- Remove existing options by including their IDs in `clear_existing_options`
- Remove option media by including their IDs in `clear_options_media`

**Response:**

```json
{
  "status": true,
  "message": "Resource updated successfully",
  "data": null,
  "error": null
}
```

**Error Response (Question Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Question not found"
    }
  ]
}
```

---

### 5. Delete Question

Soft deletes a question (marks it as deleted but doesn't remove from database).

**Endpoint:** `DELETE /api/v1/question-bank/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | The question ID |

**Example Request:**

```
DELETE /api/v1/question-bank/1
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

**Error Response (Question Not Found):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "id",
      "message": "Question not found"
    }
  ]
}
```

---

### 6. Get Questions by Institution

Retrieves all questions associated with the authenticated user's institution. Requires user context with `institution_id`.

**Endpoint:** `POST /api/v1/question-bank/institution`

**Request Body:**

```json
{
  "search": "capital"
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search term to filter questions by question text |

**Response:**

Same format as [Get All Questions](#2-get-all-questions) response, but filtered by institution.

**Error Response (Unauthorized):**

```json
{
  "status": false,
  "message": "Unauthorized",
  "data": null,
  "error": [
    {
      "field": "authorization",
      "message": "User not authenticated"
    }
  ]
}
```

**Error Response (No Institution):**

```json
{
  "status": false,
  "message": "Resource not found",
  "data": null,
  "error": [
    {
      "field": "institution_id",
      "message": "Institution ID not found"
    }
  ]
}
```

---

## Data Models

### Question Object

```typescript
{
  id: number;
  question_text: string;
  mark: number;
  answerable_time_seconds: number;
  mcq_selection: string | null;
  created_by: string | null;
  verified_by: string | null;
  status: "draft" | "publish";
  evaluation_method: "AI" | "MANUAL" | null;
  question_media: QuestionMedia[];
  mcq_options: McqOption[];
  explanation: QuestionExplanation | null;
  questionType: QuestionType;
  category: Category;
  source: QuestionSource;
  complexityLevel: ComplexityLevel;
  board: Board;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
```

### QuestionMedia Object

```typescript
{
  id: number;
  type: string;
  path: string;
  is_active: boolean;
  question_id: number;
}
```

### McqOption Object

```typescript
{
  id: number;
  option_text: string;
  is_correct_answer: boolean;
  is_active: boolean;
  question_id: number;
  option_media: McqOptionMedia[];
}
```

### McqOptionMedia Object

```typescript
{
  id: number;
  type: string;
  path: string;
  is_active: boolean;
  option_id: number;
}
```

### QuestionExplanation Object

```typescript
{
  id: number;
  explanation: string;
  answer_keywords: string | null;
  question_id: number;
  explanation_media: ExplanationMedia[];
}
```

### ExplanationMedia Object

```typescript
{
  id: number;
  type: string;
  path: string;
  is_active: boolean;
  explanation_id: number;
}
```

---

## Request/Response Examples

### Complete Create Request Example

```json
{
  "question_text": "Which of the following are programming languages?",
  "question_type_id": 1,
  "category_id": 5,
  "source_id": 2,
  "mark": 2,
  "answerable_time_seconds": 120,
  "complexity_level_id": 2,
  "mcq_selection": "multiple",
  "created_by": "teacher001",
  "verified_by": "admin001",
  "status": "publish",
  "evaluation_method": "MANUAL",
  "board_id": 1,
  "question_media": [
    {
      "type": "image",
      "path": "/uploads/programming.jpg",
      "is_active": true
    }
  ],
  "mcq_options": [
    {
      "option_text": "JavaScript",
      "is_correct_answer": true,
      "is_active": true,
      "option_media": []
    },
    {
      "option_text": "HTML",
      "is_correct_answer": false,
      "is_active": true,
      "option_media": []
    },
    {
      "option_text": "Python",
      "is_correct_answer": true,
      "is_active": true,
      "option_media": []
    },
    {
      "option_text": "CSS",
      "is_correct_answer": false,
      "is_active": true,
      "option_media": []
    }
  ],
  "explanation": {
    "explanation": "JavaScript and Python are programming languages, while HTML and CSS are markup and styling languages respectively.",
    "answer_keywords": "JavaScript, Python, programming languages",
    "explanation_media": []
  }
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
      "field": "question_text",
      "message": "Required"
    },
    {
      "field": "mcq_options",
      "message": "Expected array, received string"
    }
  ]
}
```

---

## Important Notes

1. **Transaction Safety**: Create and update operations are wrapped in database transactions to ensure data consistency.

2. **Soft Delete**: Delete operations perform soft deletes. Deleted questions are not removed from the database but are marked with a `deleted_at` timestamp.

3. **Media Management**: 
   - Media files must be uploaded separately and paths provided in the request
   - When updating, use `clear_existing_media`, `clear_existing_options`, and `clear_options_media` to remove old media/options

4. **MCQ Options**: 
   - At least one option must be marked as `is_correct_answer: true`
   - Options can have associated media (images, videos, etc.)
   - When updating, existing options can be soft-deleted using `clear_existing_options`

5. **Status Values**: 
   - `"draft"`: Question is in draft mode, not yet published
   - `"publish"`: Question is published and available for use

6. **Evaluation Method**: 
   - `"AI"`: Question will be evaluated automatically
   - `"MANUAL"`: Question requires manual evaluation

7. **Institution Endpoint**: The `/institution` endpoint requires:
   - Valid authentication token
   - User context with `institution_id`
   - POST method (not GET) to receive search parameters in body

8. **Search Functionality**: The search parameter filters questions by `question_text` using a LIKE query (case-insensitive partial match).

9. **Relations**: All GET endpoints automatically load related data:
   - Question media
   - MCQ options and their media
   - Explanation and explanation media
   - Question type, category, source, complexity level, and board

10. **Required Fields for Create**:
    - `question_text`
    - `question_type_id`
    - `category_id`
    - `source_id`
    - `mark`
    - `answerable_time_seconds`
    - `complexity_level_id`
    - `status`
    - `board_id`
    - `mcq_options` (array with at least one option)
    - `explanation`

---

## Usage Examples

### Creating a Simple Question

```bash
curl -X POST https://api.example.com/api/v1/question-bank \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "What is 2 + 2?",
    "question_type_id": 1,
    "category_id": 1,
    "source_id": 1,
    "mark": 1,
    "answerable_time_seconds": 30,
    "complexity_level_id": 1,
    "status": "draft",
    "board_id": 1,
    "mcq_options": [
      {
        "option_text": "3",
        "is_correct_answer": false,
        "is_active": true
      },
      {
        "option_text": "4",
        "is_correct_answer": true,
        "is_active": true
      }
    ],
    "explanation": {
      "explanation": "2 + 2 equals 4"
    }
  }'
```

### Searching Questions

```bash
curl -X GET "https://api.example.com/api/v1/question-bank?search=capital" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Updating a Question

```bash
curl -X PATCH https://api.example.com/api/v1/question-bank/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "Updated question text",
    "status": "publish"
  }'
```

### Getting Questions by Institution

```bash
curl -X POST https://api.example.com/api/v1/question-bank/institution \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "search": "math"
  }'
```

---

## Database Schema

The question bank uses the following main tables:

- `questions` - Main question table
- `question_media` - Question media attachments
- `mcq_options` - Multiple choice options
- `mcq_option_media` - Option media attachments
- `question_explanations` - Question explanations
- `question_explanation_media` - Explanation media attachments

Relationships:
- Question → QuestionType (OneToOne)
- Question → Category (OneToOne)
- Question → QuestionSource (OneToOne)
- Question → ComplexityLevel (OneToOne)
- Question → Board (OneToOne)
- Question → QuestionMedia (OneToMany)
- Question → McqOption (OneToMany)
- Question → QuestionExplanation (OneToOne)
- McqOption → McqOptionMedia (OneToMany)
- QuestionExplanation → ExplanationMedia (OneToMany)

---

## Support

For issues or questions regarding the Question Bank API, please contact the development team or refer to the main project documentation.


