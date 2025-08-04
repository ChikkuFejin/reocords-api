
CREATE TABLE assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    category_id BIGINT,
    topic_id BIGINT,
    total_marks DOUBLE,
    examination_duration_minutes VARCHAR(50),
    examination_code VARCHAR(50) UNIQUE,
    type ENUM('prebuild', 'schedule'),
    schedule_date TIMESTAMP,
    is_question_timed BOOLEAN,
    question_time_seconds VARCHAR(50),
    question_pick ENUM('auto', 'manual'),
    is_homework BOOLEAN,
    is_question_shuffle BOOLEAN,
    is_display_result BOOLEAN,
    reminder_time_to_end_seconds INT,
    created_by VARCHAR(255),
    reviewed_by VARCHAR(255),
    board_id BIGINT
);

-- Assessment Instructions
CREATE TABLE assessment_instructions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    description TEXT,
    instructions TEXT
);

-- Assessment Standards
CREATE TABLE assessment_standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    standard_id BIGINT,
    institution_id BIGINT
);

-- Assessment Sections
CREATE TABLE assessment_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    name VARCHAR(255),
    total_question_count INT,
    positive_mark DOUBLE,
    negative_mark DOUBLE,
    total_duration_minutes INT,
    status ENUM('draft', 'publish')
);

-- Section Questions
CREATE TABLE section_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_section_id BIGINT,
    question_id BIGINT
);

-- Participants
CREATE TABLE participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT,
    name VARCHAR(255),
    roll_number VARCHAR(100),
    password_hash TEXT,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    standard_id BIGINT,
    deleted_at TIMESTAMP NULL
);

-- Participant Assessment
CREATE TABLE participant_assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    participant_id BIGINT
);

-- Participant Assessment Attempt
CREATE TABLE participant_assessment_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_assessment_id BIGINT,
    start_time DATETIME,
    finish_time DATETIME,
    score VARCHAR(50),
    status ENUM('in_process', 'submitted', 'graded'),
    verified_by VARCHAR(255),
    verified_comments TEXT
);

-- Participant Assessment Responses
CREATE TABLE participant_assessment_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_attempt_id BIGINT,
    question_id BIGINT,
    entered_answers TEXT,
    is_correct BOOLEAN,
    point_awarded DECIMAL(10,2),
    negative_point DECIMAL(10,2),
    options_ids TEXT,
    started_at DATETIME,
    answered_at DATETIME
);

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
    institution_id BIGINT
);

-- Standard Categories
CREATE TABLE standard_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    standard_id BIGINT,
    category_id BIGINT
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
