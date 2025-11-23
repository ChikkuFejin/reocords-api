# Authentication & User Context

## Overview

This module provides authentication and user context management similar to Laravel's `Auth::user()` or `$request->user()`.

## Features

1. **JWT-based Authentication** - Bearer token authentication via `AuthGuard`
2. **CurrentUser Decorator** - Easy access to authenticated user in controllers
3. **Type-Safe Request** - TypeScript types for request with user

## Usage

### 1. Using `@CurrentUser()` Decorator (Recommended)

The easiest way to get the current authenticated user in your controllers:

```typescript
import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../modules/users/user.entity';

@Controller('example')
export class ExampleController {
  @Post('something')
  async doSomething(@CurrentUser() user: User) {
    // user is automatically typed as User
    console.log(user.id);
    console.log(user.email);
    console.log(user.institution_id);
    
    // Use user data
    const institutionId = user.institution_id || null;
    // ... your logic
  }
}
```

### 2. Using `@Request()` (Alternative)

If you need access to the full request object:

```typescript
import { Controller, Post, Request } from '@nestjs/common';
import { RequestWithUser } from '../auth/types/request-with-user.types';

@Controller('example')
export class ExampleController {
  @Post('something')
  async doSomething(@Request() req: RequestWithUser) {
    const user = req.user; // Type-safe access
    // ... your logic
  }
}
```

### 3. In Services (Inject Request)

If you need user context in services, you can inject the request:

```typescript
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestWithUser } from '../auth/types/request-with-user.types';

@Injectable({ scope: Scope.REQUEST })
export class ExampleService {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
  ) {}

  doSomething() {
    const user = this.request.user;
    // ... your logic
  }
}
```

## How It Works

1. **AuthGuard** (Global Guard):
   - Intercepts all requests (except public routes)
   - Extracts Bearer token from `Authorization` header
   - Verifies JWT token
   - Fetches user from database
   - Sets `request.user` with the user object

2. **CurrentUser Decorator**:
   - Extracts `user` from the request object
   - Provides type-safe access to the authenticated user
   - Similar to Laravel's `Auth::user()`

3. **Type Safety**:
   - `RequestWithUser` interface extends Express `Request` with `user: User`
   - Ensures TypeScript knows about `req.user` property

## Public Routes

To make a route public (skip authentication), use the `@Public()` decorator:

```typescript
import { Public } from '../auth/public.decorator';

@Controller('public')
export class PublicController {
  @Public()
  @Get('info')
  getInfo() {
    return { message: 'This is public' };
  }
}
```

## Example: Complete Controller

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public.decorator';
import { User } from '../modules/users/user.entity';

@Controller('standards')
export class StandardsController {
  constructor(private readonly service: StandardsService) {}

  // Public route - no authentication required
  @Public()
  @Get('public-list')
  async getPublicList() {
    return this.service.findAll();
  }

  // Protected route - requires authentication
  @Get('my-standards')
  async getMyStandards(@CurrentUser() user: User) {
    // user is automatically available and typed
    return this.service.findByInstitution(user.institution_id);
  }

  @Post('create')
  async create(
    @Body() dto: CreateStandardDto,
    @CurrentUser() user: User,
  ) {
    // Access user properties directly
    const institutionId = user.institution_id;
    return this.service.create(dto, institutionId);
  }
}
```

## Migration from Old Code

**Before:**
```typescript
@Post('add-standard-section')
async addStandardSection(
  @Body() dto: standardSectionDto,
  @Request() req: ExpressRequest & { user?: CreateUserDto },
) {
  const user = req.user as CreateUserDto;
  const institution_id: number | null = user.institution_id || null;
  // ...
}
```

**After:**
```typescript
@Post('add-standard-section')
async addStandardSection(
  @Body() dto: standardSectionDto,
  @CurrentUser() user: User,
) {
  const institution_id: number | null = user.institution_id || null;
  // ...
}
```

## Benefits

1. **Cleaner Code** - No need to manually extract and cast user from request
2. **Type Safety** - TypeScript knows the user type
3. **Laravel-like** - Similar to `Auth::user()` or `$request->user()`
4. **Less Boilerplate** - No need for `@Request()` and manual extraction
5. **Consistent** - Same pattern across all controllers

