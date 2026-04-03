# Online Document Hub API Documentation

## Overview
This document outlines the RESTful API design for the Online Document Hub application. The API follows REST principles and implements role-based access control for secure document management and sharing.

## Architecture Overview

### Layers
- **Entities**: JPA entities representing database models (User, Document, Role, DocumentShare)
- **Repositories**: Data access layer extending JpaRepository
- **Services**: Business logic layer with transaction management
- **Controllers**: REST API endpoints with security annotations

### Security Model
- **Role-based access control** with USER and ADMIN roles
- **Method-level security** using @PreAuthorize annotations
- **Authentication** based on Spring Security with JWT support

## API Endpoints

### User Management (`/api/users`)

#### Create User
- **POST** `/api/users`
- **Roles Required**: ADMIN
- **Request Body**: UserCreationRequest
- **Response**: User (201 Created)

#### Get User by ID
- **GET** `/api/users/{id}`
- **Roles Required**: ADMIN or owner
- **Response**: User (200 OK) or 404 Not Found

#### Get User by Username
- **GET** `/api/users/username/{username}`
- **Roles Required**: ADMIN or owner
- **Response**: User (200 OK) or 404 Not Found

#### Get User by Email
- **GET** `/api/users/email/{email}`
- **Roles Required**: ADMIN
- **Response**: User (200 OK) or 404 Not Found

#### Get All Users
- **GET** `/api/users`
- **Roles Required**: ADMIN
- **Response**: List<User> (200 OK)

#### Update User
- **PUT** `/api/users/{id}`
- **Roles Required**: ADMIN or owner
- **Request Body**: UserUpdateRequest
- **Response**: User (200 OK) or 404 Not Found

#### Delete User
- **DELETE** `/api/users/{id}`
- **Roles Required**: ADMIN
- **Response**: 204 No Content or 404 Not Found

#### Enable/Disable User
- **PUT** `/api/users/{id}/enable`
- **PUT** `/api/users/{id}/disable`
- **Roles Required**: ADMIN
- **Response**: User (200 OK) or 404 Not Found

### Document Management (`/api/documents`)

#### Create Document
- **POST** `/api/documents`
- **Roles Required**: USER, ADMIN
- **Request Body**: DocumentCreationRequest
- **Response**: Document (201 Created)

#### Get Document by ID
- **GET** `/api/documents/{id}`
- **Roles Required**: USER, ADMIN (owner or admin only)
- **Response**: Document (200 OK) or 404 Not Found

#### Get All Documents
- **GET** `/api/documents`
- **Roles Required**: USER, ADMIN
- **Response**: List<Document> (200 OK)
  - Admin: All documents
  - User: Only owned documents

#### Get My Documents
- **GET** `/api/documents/my`
- **Roles Required**: USER, ADMIN
- **Response**: List<Document> (200 OK) - User's documents only

#### Search Documents
- **GET** `/api/documents/search/title?title={title}`
- **GET** `/api/documents/search/description?description={description}`
- **Roles Required**: USER, ADMIN
- **Response**: List<Document> (200 OK)
  - Admin: Search all documents
  - User: Search only owned documents

#### Update Document
- **PUT** `/api/documents/{id}`
- **Roles Required**: USER, ADMIN (owner or admin only)
- **Request Body**: DocumentUpdateRequest
- **Response**: Document (200 OK) or 404 Not Found

#### Delete Document
- **DELETE** `/api/documents/{id}`
- **Roles Required**: USER, ADMIN (owner or admin only)
- **Response**: 204 No Content or 404 Not Found

### Document Sharing (`/api/document-shares`)

#### Share Document
- **POST** `/api/document-shares`
- **Roles Required**: USER, ADMIN
- **Request Body**: DocumentShareRequest
- **Response**: DocumentShare (201 Created)

#### Get Share by ID
- **GET** `/api/document-shares/{id}`
- **Roles Required**: USER, ADMIN (sharer, recipient, or admin)
- **Response**: DocumentShare (200 OK) or 404 Not Found

#### Get Shares by Document
- **GET** `/api/document-shares/document/{documentId}`
- **Roles Required**: USER, ADMIN
- **Response**: List<DocumentShare> (200 OK)
  - Admin: All shares for document
  - User: Only shares created by user

#### Get Shares Shared With Me
- **GET** `/api/document-shares/shared-with-me`
- **Roles Required**: USER, ADMIN
- **Response**: List<DocumentShare> (200 OK) - Active shares only

#### Get Shares Shared By Me
- **GET** `/api/document-shares/shared-by-me`
- **Roles Required**: USER, ADMIN
- **Response**: List<DocumentShare> (200 OK)

#### Update Share Permission
- **PUT** `/api/document-shares/{id}/permission`
- **Roles Required**: USER, ADMIN (sharer or admin)
- **Request Body**: PermissionUpdateRequest
- **Response**: DocumentShare (200 OK) or 404 Not Found

#### Extend Share Expiry
- **PUT** `/api/document-shares/{id}/extend`
- **Roles Required**: USER, ADMIN (sharer or admin)
- **Request Body**: ExpiryUpdateRequest
- **Response**: DocumentShare (200 OK) or 404 Not Found

#### Revoke Share
- **PUT** `/api/document-shares/{id}/revoke`
- **Roles Required**: USER, ADMIN (sharer or admin)
- **Response**: 200 OK or 404 Not Found

#### Delete Share
- **DELETE** `/api/document-shares/{id}`
- **Roles Required**: USER, ADMIN (sharer or admin)
- **Response**: 204 No Content or 404 Not Found

#### Check Access
- **GET** `/api/document-shares/check-access/{documentId}?requiredPermission={permission}`
- **Roles Required**: USER, ADMIN
- **Response**: Boolean (200 OK)

### Role Management (`/api/roles`)

#### Create Role
- **POST** `/api/roles`
- **Roles Required**: ADMIN
- **Request Body**: Role
- **Response**: Role (201 Created)

#### Get Role by ID
- **GET** `/api/roles/{id}`
- **Roles Required**: ADMIN
- **Response**: Role (200 OK) or 404 Not Found

#### Get Role by Name
- **GET** `/api/roles/name/{name}`
- **Roles Required**: ADMIN
- **Response**: Role (200 OK) or 404 Not Found

#### Get All Roles
- **GET** `/api/roles`
- **Roles Required**: ADMIN
- **Response**: List<Role> (200 OK)

#### Update Role
- **PUT** `/api/roles/{id}`
- **Roles Required**: ADMIN
- **Request Body**: Role
- **Response**: Role (200 OK) or 404 Not Found

#### Delete Role
- **DELETE** `/api/roles/{id}`
- **Roles Required**: ADMIN
- **Response**: 204 No Content or 404 Not Found

## Data Models

### User Entity
- **id**: Long (Primary Key)
- **username**: String (Unique, Required)
- **email**: String (Unique, Required)
- **passwordHash**: String (Required)
- **firstName**: String (Required)
- **lastName**: String (Required)
- **enabled**: Boolean (Default: true)
- **createdAt**: LocalDateTime
- **updatedAt**: LocalDateTime
- **roles**: Set<Role> (Many-to-Many)
- **ownedDocuments**: Set<Document> (One-to-Many)
- **sharedDocuments**: Set<DocumentShare> (One-to-Many)

### Document Entity
- **id**: Long (Primary Key)
- **title**: String (Required)
- **description**: String (Text)
- **fileName**: String (Unique, Required)
- **originalFileName**: String (Required)
- **filePath**: String (Required)
- **contentType**: String (Required)
- **fileSize**: Long (Required)
- **uploadedAt**: LocalDateTime
- **updatedAt**: LocalDateTime
- **owner**: User (Many-to-One)
- **shares**: Set<DocumentShare> (One-to-Many)

### Role Entity
- **id**: Long (Primary Key)
- **name**: String (Unique, Required)
- **description**: String (Required)
- **users**: Set<User> (Many-to-Many)

### DocumentShare Entity
- **id**: Long (Primary Key)
- **document**: Document (Many-to-One)
- **sharedWithUser**: User (Many-to-One)
- **sharedBy**: User (Many-to-One)
- **permission**: SharePermission (Enum: READ_ONLY, READ_WRITE, ADMIN)
- **sharedAt**: LocalDateTime
- **expiresAt**: LocalDateTime
- **active**: Boolean (Default: true)

## Permission Levels

### SharePermission Enum
- **READ_ONLY**: Can view and download documents
- **READ_WRITE**: Can view, download, and edit documents
- **ADMIN**: Full control including sharing and deletion

## Design Decisions

### Security
1. **Method-level security** using Spring Security's @PreAuthorize
2. **Role-based access** with USER and ADMIN roles
3. **Resource ownership** validation for document operations
4. **Cross-Origin Resource Sharing (CORS)** enabled for frontend integration

### Data Validation
1. **Jakarta Validation** annotations for request bodies
2. **Custom validation** in service layer for business rules
3. **Unique constraint checks** for usernames, emails, and filenames

### Error Handling
1. **RuntimeException** for business logic violations
2. **HTTP status codes** appropriately mapped
3. **Consistent error responses** across all endpoints

### Performance Considerations
1. **Lazy loading** for collections to prevent N+1 queries
2. **Transactional boundaries** at service layer
3. **Efficient queries** with Spring Data JPA methods

### Extensibility
1. **DTO pattern** ready for implementation
2. **Service layer abstraction** for business logic
3. **Repository pattern** for data access
4. **Enum-based permissions** for easy extension

## Response Format

### Success Responses
- **200 OK**: Successful GET, PUT operations
- **201 Created**: Successful POST operations
- **204 No Content**: Successful DELETE operations

### Error Responses
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists

## Future Enhancements

1. **DTO Implementation**: Separate request/response objects from entities
2. **Pagination**: For large datasets
3. **File Upload**: Direct file upload endpoints
4. **Audit Logging**: Track all document operations
5. **Versioning**: Document version control
6. **Notifications**: Email/in-app notifications for shares
7. **Search Enhancement**: Full-text search capabilities
8. **Caching**: Redis integration for performance
