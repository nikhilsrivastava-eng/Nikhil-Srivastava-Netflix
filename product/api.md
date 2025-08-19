# Netflix Clone - API Documentation

## Overview
This document provides comprehensive API documentation for the Netflix clone streaming platform built with FastAPI. All endpoints use JSON for request/response bodies and JWT tokens for authentication.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "user_id": 1
}
```

#### Login User
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  }
}
```

#### Reset Password
```
POST /auth/reset-password
```
**Request Body:**
```json
{
  "email": "user@example.com"
}
```
**Response:**
```json
{
  "message": "Password reset email sent"
}
```

### Movie Endpoints

#### Get All Movies
```
GET /movies
```
**Query Parameters:**
- `genre` (optional): Filter by genre
- `release_year` (optional): Filter by release year
- `rating` (optional): Minimum rating filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "movies": [
    {
      "id": 1,
      "title": "Movie Title",
      "description": "Movie description",
      "genre": "Action",
      "release_year": 2023,
      "duration": 120,
      "rating": 4.5,
      "thumbnail_url": "https://example.com/thumbnail.jpg",
      "is_premium": false
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 5
}
```

#### Get Movie Details
```
GET /movies/{movie_id}
```
**Response:**
```json
{
  "id": 1,
  "title": "Movie Title",
  "description": "Movie description",
  "genre": "Action",
  "release_year": 2023,
  "duration": 120,
  "rating": 4.5,
  "video_url": "https://example.com/video.mp4",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "trailer_url": "https://example.com/trailer.mp4",
  "is_premium": false
}
```

#### Search Movies
```
GET /movies/search
```
**Query Parameters:**
- `q`: Search query (title or description)
- `genre` (optional): Filter by genre
- `sort` (optional): Sort by 'popularity', 'rating', 'release_date'

**Response:**
```json
{
  "movies": [...],
  "total": 25
}
```

### User Profile Endpoints

#### Get User Profile
```
GET /users/profile
```
**Headers:** Authorization required
**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "https://example.com/profile.jpg",
  "role": "user",
  "created_at": "2023-01-01T00:00:00Z"
}
```

#### Update User Profile
```
PUT /users/profile
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "profile_picture": "https://example.com/new-profile.jpg"
}
```
**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

#### Change Password
```
PUT /users/change-password
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```
**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### Delete Account
```
DELETE /users/account
```
**Headers:** Authorization required
**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

### Watchlist Endpoints

#### Get User Watchlist
```
GET /users/watchlist
```
**Headers:** Authorization required
**Response:**
```json
{
  "watchlist": [
    {
      "id": 1,
      "movie": {
        "id": 1,
        "title": "Movie Title",
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "genre": "Action",
        "rating": 4.5
      },
      "added_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Add to Watchlist
```
POST /users/watchlist
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "movie_id": 1
}
```
**Response:**
```json
{
  "message": "Movie added to watchlist"
}
```

#### Remove from Watchlist
```
DELETE /users/watchlist/{movie_id}
```
**Headers:** Authorization required
**Response:**
```json
{
  "message": "Movie removed from watchlist"
}
```

### Favourites Endpoints

#### Get User Favourites
```
GET /users/favourites
```
**Headers:** Authorization required
**Response:**
```json
{
  "favourites": [
    {
      "id": 1,
      "movie": {
        "id": 1,
        "title": "Movie Title",
        "thumbnail_url": "https://example.com/thumbnail.jpg",
        "genre": "Action",
        "rating": 4.5
      },
      "added_at": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Add to Favourites
```
POST /users/favourites
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "movie_id": 1
}
```
**Response:**
```json
{
  "message": "Movie added to favourites"
}
```

#### Remove from Favourites
```
DELETE /users/favourites/{movie_id}
```
**Headers:** Authorization required
**Response:**
```json
{
  "message": "Movie removed from favourites"
}
```

### Rating & Review Endpoints

#### Rate Movie
```
POST /movies/{movie_id}/rating
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "rating": 5,
  "review": "Great movie!"
}
```
**Response:**
```json
{
  "message": "Rating submitted successfully"
}
```

#### Get Movie Ratings
```
GET /movies/{movie_id}/ratings
```
**Response:**
```json
{
  "ratings": [
    {
      "id": 1,
      "user": {
        "first_name": "John",
        "last_name": "D."
      },
      "rating": 5,
      "review": "Great movie!",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "average_rating": 4.5,
  "total_ratings": 100
}
```

### Subscription Endpoints

#### Get Subscription Plans
```
GET /subscriptions/plans
```
**Response:**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Premium",
      "description": "Access to all premium content",
      "price": 9.99,
      "duration_months": 1,
      "features": ["HD Quality", "Premium Content", "Ad-free"]
    }
  ]
}
```

#### Subscribe to Plan
```
POST /subscriptions/subscribe
```
**Headers:** Authorization required
**Request Body:**
```json
{
  "plan_id": 1,
  "payment_method_id": "stripe_payment_method_id"
}
```
**Response:**
```json
{
  "message": "Subscription created successfully",
  "subscription_id": 1
}
```

#### Get Subscription Status
```
GET /subscriptions/status
```
**Headers:** Authorization required
**Response:**
```json
{
  "subscription": {
    "id": 1,
    "plan": {
      "name": "Premium",
      "price": 9.99
    },
    "status": "active",
    "start_date": "2023-01-01T00:00:00Z",
    "end_date": "2023-02-01T00:00:00Z"
  }
}
```

#### Cancel Subscription
```
POST /subscriptions/cancel
```
**Headers:** Authorization required
**Response:**
```json
{
  "message": "Subscription cancelled successfully"
}
```

### Admin Endpoints

#### Upload Movie (Admin Only)
```
POST /admin/movies
```
**Headers:** Authorization required (Admin role)
**Request Body:**
```json
{
  "title": "New Movie",
  "description": "Movie description",
  "genre": "Action",
  "release_year": 2023,
  "duration": 120,
  "video_url": "https://example.com/video.mp4",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "trailer_url": "https://example.com/trailer.mp4",
  "is_premium": false
}
```
**Response:**
```json
{
  "message": "Movie uploaded successfully",
  "movie_id": 1
}
```

#### Update Movie (Admin Only)
```
PUT /admin/movies/{movie_id}
```
**Headers:** Authorization required (Admin role)
**Request Body:**
```json
{
  "title": "Updated Movie Title",
  "description": "Updated description",
  "genre": "Drama"
}
```
**Response:**
```json
{
  "message": "Movie updated successfully"
}
```

#### Delete Movie (Admin Only)
```
DELETE /admin/movies/{movie_id}
```
**Headers:** Authorization required (Admin role)
**Response:**
```json
{
  "message": "Movie deleted successfully"
}
```

#### Get Admin Dashboard (Admin Only)
```
GET /admin/dashboard
```
**Headers:** Authorization required (Admin role)
**Response:**
```json
{
  "stats": {
    "total_users": 1000,
    "total_movies": 500,
    "active_subscriptions": 250,
    "total_revenue": 2500.00
  },
  "recent_registrations": [...],
  "popular_movies": [...]
}
```

## Error Responses

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Admin endpoints: 50 requests per minute

## Data Validation
All endpoints include input validation:
- Email format validation
- Password strength requirements (min 8 characters)
- Required field validation
- Data type validation