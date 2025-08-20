# Netflix Clone - System Architecture

## Overview
This document outlines the system architecture for the Netflix clone streaming platform, designed to support video streaming, user management, content discovery, and subscription services.

## Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework for REST APIs
- **PostgreSQL** - Primary relational database for structured data
- **SQLAlchemy** - ORM for database operations and migrations
- **JWT** - Token-based authentication and authorization

### Frontend
- **React.js** - Component-based UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Shadcn/Tailwind CSS** - UI component library and styling


### Payment Processing
- **Stripe API** - Secure payment processing for subscriptions

## System Architecture

### High-Level Architecture
```
[React Frontend] <-> [FastAPI Backend] <-> [PostgreSQL Database]
                           |
                     [AWS S3 + CDN]
```

### Database Schema

#### Core Tables

##### users
- id: Integer (Primary Key, Auto-increment)
- email: String (Unique, Required)
- password_hash: String (Required)
- name: String (Required)
- profile_picture: String (URL)
- role: String (Default: 'user', Options: 'user', 'admin')
- created_at: Timestamp
- updated_at: Timestamp

##### movies
- id: Integer (Primary Key, Auto-increment)
- title: String (Required)
- description: Text
- genre: String (Required)
- release_year: Integer
- duration: Integer (minutes)
- rating: Decimal (2,1)
- video_url: String (URL)
- thumbnail_url: String (URL)
- trailer_url: String (URL)
- is_premium: Boolean (Default: false)
- created_at: Timestamp
- updated_at: Timestamp

##### plans
- id: Integer (Primary Key, Auto-increment)
- name: String (Required)
- description: Text
- price: Decimal (10,2)
- duration_months: Integer
- features: Array of Strings
- is_active: Boolean (Default: true)
- created_at: Timestamp

##### subscriptions
- id: Integer (Primary Key, Auto-increment)
- user_id: Integer (Foreign Key → users.id)
- plan_id: Integer (Foreign Key → plans.id)
- status: String (Options: 'active', 'cancelled', 'expired')
- start_date: Timestamp
- end_date: Timestamp
- created_at: Timestamp

##### payments
- id: Integer (Primary Key, Auto-increment)
- user_id: Integer (Foreign Key → users.id)
- subscription_id: Integer (Foreign Key → subscriptions.id)
- amount: Decimal (10,2)
- currency: String (Default: 'USD')
- stripe_payment_id: String
- status: String (Options: 'pending', 'completed', 'failed')
- created_at: Timestamp

##### watchlist
- id: Integer (Primary Key, Auto-increment)
- user_id: Integer (Foreign Key → users.id)
- movie_id: Integer (Foreign Key → movies.id)
- added_at: Timestamp
- Unique constraint: (user_id, movie_id)

##### favourites
- id: Integer (Primary Key, Auto-increment)
- user_id: Integer (Foreign Key → users.id)
- movie_id: Integer (Foreign Key → movies.id)
- added_at: Timestamp
- Unique constraint: (user_id, movie_id)

##### ratings
- id: Integer (Primary Key, Auto-increment)
- user_id: Integer (Foreign Key → users.id)
- movie_id: Integer (Foreign Key → movies.id)
- rating: Integer (Range: 1-5)
- review: Text
- created_at: Timestamp
- updated_at: Timestamp
- Unique constraint: (user_id, movie_id)


### Security Considerations
- JWT tokens for stateless authentication
- Password hashing with bcrypt
- HTTPS encryption for all communications
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration for frontend access

### Video Streaming Architecture
- Video files stored in local storage or cloudinary 
- Multiple quality options (720p, 1080p)
- Adaptive streaming based on user bandwidth


## Development Environment Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+


### Backend Setup
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary redis python-jose bcrypt
```

### Frontend Setup
```bash
npx create-react-app netflix-clone
npm install axios react-router-dom @mui/material
```

### Database Setup
- PostgreSQL database creation
- Environment variables configuration
- SQLAlchemy model definitions
- Alembic migration setup

