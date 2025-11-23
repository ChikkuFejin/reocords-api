# Records Backend (NestJS)

A modular NestJS REST API for managing academic records such as question banks, standards, assessments, topics, categories, and boards. The service uses MySQL via TypeORM, DTO validation via Zod, and a pluggable dynamic router for specific service-style endpoints.

This README explains what the project does, its features, how to run it locally, how requests are validated and handled, and how to extend it.


## Overview

- Purpose: Provide backend APIs to manage educational content and metadata used to build assessments (exams/tests) from a question bank organized by standards, topics, categories, etc.
- Architecture: NestJS modular structure with TypeORM (MySQL), DTOs + Zod validation, and conventional REST controllers. Some modules expose a single dynamic "services" endpoint that dispatches actions through a RouterService.
- Included API collections: Postman collection and local environment are provided at the repository root.
  - Records-Backend-API.postman_collection.json
  - Records-Backend-Local.postman_environment.json


## Tech Stack

- Runtime: Node.js (NestJS)
- Language: TypeScript
- Framework: NestJS
- Database: MySQL (TypeORM)
- Validation: Zod (custom Nest pipe)
- Auth/Context: UserContextMiddleware (JWT-ready, currently stubbed)


## High-level Features

- Authentication and service-style routing
  - Auth controller with dynamic service routing via RouterService
  - Support for pluggable module/action routing patterns
- Question Bank management (CRUD)
- Standards management (CRUD + institution-specific queries + add sections)
- Assessments management (CRUD + add questions to sections + list section questions)
- Topics management (CRUD)
- Categories management (CRUD with parent-child relationships)
- Boards management (CRUD)
- Question Sources management (CRUD)
- Question Types management (CRUD)
- Dropdown/Product master service-style endpoints (via RouterService)
- Consistent response format and message enums
- DTO validation using ZodValidationPipe


## Modules and Endpoints

Base paths are inferred from controllers. Parameters and payloads are validated using DTOs and Zod schemas.

- Auth
  - Base: /auth-master
  - POST /services → dynamic service action via RouterService (see Dynamic Router section)

- Question Bank
  - Base: /question-bank
  - POST / → Create question
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete
  - POST /institution → List by the requester’s institution (user context required)

- Standards
  - Base: /standards
  - POST / → Create standard (with sections payload support via DTO)
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete
  - POST /institution/:id → List by institution id
  - POST /add-standard-section → Add standard section (requires user context)

- Assessments
  - Base: /assessments
  - POST / → Create assessment
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete
  - POST /add-questions → Map questions to assessment sections
  - POST /section-questions/:assessmentId → Get questions grouped by sections for an assessment

- Topics
  - Base: /topic-service
  - POST / → Create topic
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete

- Categories
  - Base: /category
  - POST / → Create category (optional parent_id for hierarchy)
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update (supports parent changes)
  - DELETE /:id → Delete

- Boards
  - Base: /board
  - POST / → Create board
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete

- Question Sources
  - Base: /question-source
  - POST / → Create
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete

- Question Types
  - Base: /question-type
  - POST / → Create
  - GET / → List all
  - GET /:id → Get one
  - PATCH /:id → Update
  - DELETE /:id → Delete

- Dropdown Master (service-style)
  - Base: /dropdown-master
  - POST / → Dynamic service action via RouterService

- Product Master (service-style)
  - Base: /product-master
  - POST /services → Dynamic service action via RouterService


## Response Format and Validation

- Responses use a helper wrapper: serviceResponse.success(...)/failure(...)
  - Common messages come from HttpResponseMessages (e.g., CREATED, UPDATED, DELETED, RESOURCE_NOT_AFFECTED)
  - Expect a shape such as { success: boolean, data?: any, message?: string, error?: any }
- Validation uses Zod via a custom Nest pipe (ZodValidationPipe)
  - DTOs define schemas such as createQuestionTypeDtoScheme, assessmentDtoSchema, etc.
  - Controllers apply @UsePipes(new ZodValidationPipe(schema)) or parameter-level pipes


## Authentication and User Context

- The project includes a UserContextMiddleware added globally in AppModule, attaching req.user for downstream use. Currently, it stubs a user:
  - id: 1, institution_id: 1, username: 'dummmy name'
- JWT verification is scaffolded but commented in the middleware; in production, enable verification and use a secret via environment variables.


## Dynamic Router Service

Some endpoints accept a single POST body and route to service methods dynamically:

- RouterService expects a body: { module: string, action: string, data?: any }
- It maps module to a Service class, then invokes service[action](body, res)
- Current module map (router.service.ts):
  - auth → AuthService
  - master → AuthService
  - C-Drop → DropdownMasterService
- To add new modules/actions, extend the map in resolveServiceName and implement the corresponding service methods.


## Database and Entities

- Database: MySQL, configured in src/app.module.ts via TypeOrmModule.forRoot
  - host: localhost, port: 3306, username: root, password: '', database: records
  - autoLoadEntities: true, synchronize: false (recommended for production)
- SQL references are provided at repo root:
  - records_reference.sql
  - records_v2.sql
- Entities are located under src/entities and module-specific folders; TypeORM repositories are used in services.


## Environment Variables

The app uses @nestjs/config (global). Create a .env at the project root as needed. Example:

- APP_PORT=3000
- NODE_ENV=development
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASS=
- DB_NAME=records
- JWT_SECRET=change_me

Note: The current TypeORM configuration in app.module.ts uses static values. You can refactor it to read from process.env to align with the above keys.


## Getting Started (Local)

1) Prerequisites
- Node.js 18+
- MySQL 8+

2) Install dependencies
- npm install

3) Configure database
- Create a MySQL database named records (or update app.module.ts / env to match)
- Optionally import provided SQL dumps (records_reference.sql or records_v2.sql)

4) Run the app
- Development: npm run start:dev
- Plain dev: npm run start
- Production build: npm run build && npm run start:prod

5) Test the API
- Import Records-Backend-API.postman_collection.json and Records-Backend-Local.postman_environment.json into Postman
- Adjust base URL and tokens as needed


## Project Structure (Highlights)

- src/app.module.ts: Root module, registers modules and TypeORM, applies UserContextMiddleware globally
- src/main.ts: Nest bootstrap (global pipes/filters can be added here)
- src/middleware/user-context.middleware.ts: Injects req.user (stub); enable JWT verification for production
- src/router.service.ts: Dynamic routing engine for service-style endpoints
- src/utils/pipes/zodValidation.pipe.ts: Zod validation pipe used by controllers
- src/modules/**: Feature modules with controllers, services, DTOs, resources


## Development Notes

- Validation: Prefer Zod schemas kept alongside DTOs; enforce via ZodValidationPipe
- Error handling: Use Nest exceptions (e.g., BadRequestException) and serviceResponse.failure for consistent payloads
- Messages: Use HttpResponseMessages enum for standardized messages
- Resources (transformers): Each module has Resource mappers to shape entities into response DTOs
- Extensibility: To add a new feature, generate a Nest module/controller/service and follow the same DTO + Zod + Resource pattern


## Contributing

- Follow the existing code style and lint rules
- Validate inputs with Zod and return consistent serviceResponse envelopes
- Update this README and the Postman collection when adding/removing endpoints


## License

This project is released under the MIT License.
