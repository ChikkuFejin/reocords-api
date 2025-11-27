-- Participants
-- Topics
CREATE TABLE topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL
);

-- Standards
CREATE TABLE standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    institution_id BIGINT default null
);

-- Standard Categories
CREATE TABLE standard_section_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    standard_sectio_id BIGINT,
    category_id BIGINT,
    institution_id BIGINT,
);

-- Boards
CREATE TABLE boards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL
);

-- Institutions
CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    gst VARCHAR(50),
    email VARCHAR(255),
    mobile VARCHAR(20),
    deleted_at TIMESTAMP NULL
);

-- Mentors
CREATE TABLE mentors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    username VARCHAR(255),
    password TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL
);

-- Mentor Categories
CREATE TABLE mentor_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    standard_category_id BIGINT
);

-- Users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT,
    username VARCHAR(255),
    email VARCHAR(255),
    password_hash TEXT,
    deleted_at TIMESTAMP NULL
);

select
    *
from
    institutions;

show tables;