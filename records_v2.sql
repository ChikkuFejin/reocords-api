DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT DEFAULT NULL,
    username VARCHAR(100),
    email VARCHAR(100),
    password_hash VARCHAR(255),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (institution_id, email)
);

DROP TABLE IF EXISTS institutions;

CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    gst VARCHAR(50),
    email VARCHAR(255),
    mobile VARCHAR(20),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

alter table institutions
add column type VARCHAR(50) default null;

DROP TABLE IF EXISTS question_types;

CREATE TABLE question_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique (name)
);

DROP TABLE IF EXISTS standards;

CREATE TABLE standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    institution_id BIGINT default null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE standards
ADD CONSTRAINT institutions_standards_fk FOREIGN KEY (institution_id) REFERENCES institutions (id);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT default null,
    parent_id BIGINT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX categories_name_parent_id (name, parent_id)
);

alter table categories
add column standard_id BIGINT default null,
add constraint fk_categories_standard_id foreign key (standard_id) references standards (id);

ALTER TABLE categories
ADD CONSTRAINT categories_parent_id FOREIGN KEY (parent_id) REFERENCES categories (id);

DROP TABLE IF EXISTS question_sources;

CREATE TABLE question_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT default null,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index question_sources_name (name)
);

DROP TABLE IF EXISTS complexity_levels;

CREATE TABLE complexity_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX complexity_levels_name (name)
);

DROP TABLE IF EXISTS boards;

CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT default null,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX boards_name (name)
);

DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type_id INT,
    category_id BIGINT,
    source_id INT,
    mark DOUBLE,
    answerable_time_seconds INT,
    complexity_level_id INT,
    mcq_selection VARCHAR(10) DEFAULT NULL,
    created_by VARCHAR(255) default null,
    verified_by VARCHAR(255) default null,
    status ENUM('draft', 'publish') DEFAULT 'draft',
    evaluation_method ENUM('AI', 'MANUAL') default null,
    board_id INT default null,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

alter table questions
add column deleted_at TIMESTAMP NULL,
add standard_id BIGINT default null,
add constraint fk_questions_standard_id foreign key (standard_id) references standards (id);

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_id FOREIGN KEY (question_type_id) REFERENCES question_types (id),
ADD CONSTRAINT questions_category_id_ref FOREIGN KEY (category_id) REFERENCES categories (id),
ADD CONSTRAINT questions_source_id_ref FOREIGN KEY (source_id) REFERENCES question_sources (id),
ADD CONSTRAINT questions_board_id_ref FOREIGN KEY (board_id) REFERENCES boards (id),
ADD CONSTRAINT questions_complexity_level_id_ref FOREIGN KEY (complexity_level_id) REFERENCES complexity_levels (id);

DROP TABLE IF EXISTS question_media;

CREATE TABLE question_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('image', 'audio', 'document'),
    path TEXT,
    question_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE question_media
ADD CONSTRAINT question_media_questions_question_id FOREIGN KEY (question_id) REFERENCES questions (id);

DROP TABLE IF EXISTS mcq_options;

CREATE TABLE mcq_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT,
    option_text TEXT,
    is_correct_answer BOOLEAN default false,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE mcq_options
ADD CONSTRAINT question_mcq_options_question_id_ref FOREIGN KEY (question_id) REFERENCES questions (id);

DROP TABLE IF EXISTS mcq_option_media;

CREATE TABLE mcq_option_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('image', 'video', 'audio', 'document'),
    path TEXT,
    mcq_option_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE mcq_option_media
ADD CONSTRAINT mcq_option_media_mcq_options_id_ref FOREIGN KEY (mcq_option_id) REFERENCES mcq_options (id);

DROP TABLE IF EXISTS question_explanations;

CREATE TABLE question_explanations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id BIGINT,
    explanation TEXT,
    answer_keywords TEXT default null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE question_explanations
ADD CONSTRAINT questions_question_id_ref FOREIGN KEY (question_id) REFERENCES questions (id);

DROP TABLE IF EXISTS question_explanation_media;

CREATE TABLE question_explanation_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('image', 'video', 'audio', 'document'),
    path TEXT,
    question_explanation_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE question_explanation_media
ADD CONSTRAINT question_explanation_medias_question_explanation_id_ref FOREIGN KEY (question_explanation_id) REFERENCES question_explanations (id);

DROP TABLE IF EXISTS topics;

CREATE TABLE topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT default null,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS assessments;

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
    board_id INT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE assessments
ADD CONSTRAINT assessments_topics_fk FOREIGN KEY (topic_id) REFERENCES topics (id),
ADD CONSTRAINT assessment_board_id_fk FOREIGN KEY (board_id) REFERENCES boards (id);

DROP TABLE IF EXISTS assessment_instructions;

CREATE TABLE assessment_instructions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    description TEXT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE assessment_instructions
ADD CONSTRAINT assessment_instructions_assessments_fk FOREIGN KEY (assessment_id) references assessments (id);

DROP TABLE IF EXISTS assessment_sections;

CREATE TABLE assessment_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    name VARCHAR(255),
    total_question_count INT,
    positive_mark DOUBLE default 0,
    negative_mark DOUBLE default 0,
    total_duration_minutes INT default null,
    status ENUM('draft', 'publish'),
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE assessment_sections
ADD CONSTRAINT assessment_sections_assessment_id_fk FOREIGN KEY (assessment_id) REFERENCES assessments (id);

DROP TABLE IF EXISTS standard_sections;

CREATE TABLE standard_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    standard_id BIGINT,
    name VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE standard_sections
ADD CONSTRAINT standard_sections_standard_id_fk FOREIGN KEY (standard_id) REFERENCES standards (id);

DROP TABLE IF EXISTS standard_section_categories;

CREATE TABLE standard_section_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    standard_section_id BIGINT,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE standard_section_categories
ADD CONSTRAINT standard_section_categories_standard_section_id_FK FOREIGN KEY (standard_section_id) REFERENCES standard_sections,
ADD CONSTRAINT standard_section_categories_category_id FOREIGN KEY (category_id) REFERENCES categories (id);

CREATE TABLE assessment_standards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    standard_id BIGINT,
    institution_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE assessment_standards
ADD CONSTRAINT assessment_id_assessment_standards_fk FOREIGN KEY (assessment_id) references assessments (id),
ADD CONSTRAINT standard_id_assessment_standards_fk FOREIGN KEY (standard_id) references standards (id);

DROP TABLE IF EXISTS section_questions;

CREATE TABLE section_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_section_id BIGINT,
    question_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE section_questions
ADD CONSTRAINT assessment_section_id_section_questions_fk FOREIGN KEY (assessment_section_id) references assessment_sections (id),
ADD CONSTRAINT question_id_section_questions_fk FOREIGN KEY (question_id) references questions (id);

DROP TABLE IF EXISTS participants;

CREATE TABLE participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT,
    name VARCHAR(255),
    roll_number VARCHAR(100),
    password_hash TEXT,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    standard_id BIGINT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE participants
ADD CONSTRAINT participants_institution_id_FK FOREIGN KEY (institution_id) REFERENCES institutions (id),
ADD CONSTRAINT participants_standard_id_FK FOREIGN KEY (standard_id) REFERENCES standard_sections (id);

CREATE TABLE participants_standard_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    participant_id BIGINT,
    standard_section_id BIGINT
);

ALTER TABLE participants_standard_sections
ADD CONSTRAINT partcipants_standard_sections_participant_id_FK FOREIGN KEY (participant_id) REFERENCES participants (id),
ADD CONSTRAINT partcipants_standard_sections_standard_section_id_FK FOREIGN KEY (standard_section_id) REFERENCES standard_sections (id);

DROP TABLE IF EXISTS participant_assessments;

CREATE TABLE participant_assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    participant_id BIGINT
);

ALTER TABLE participant_assessments
ADD CONSTRAINT participant_assessments_assessment_id_FK FOREIGN KEY (assessment_id) REFERENCES assessments (id),
ADD CONSTRAINT participant_assessments_participant_id_id_FK FOREIGN KEY (participant_id) REFERENCES participants (id);

DROP TABLE IF EXISTS participant_assessment_attempts;

CREATE TABLE participant_assessment_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_id BIGINT,
    start_time DATETIME,
    finish_time DATETIME,
    score VARCHAR(50),
    status ENUM('in_process', 'submitted', 'graded'),
    verified_by VARCHAR(255),
    verified_comments TEXT,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE participant_assessment_attempts
ADD CONSTRAINT participant_assessment_attempts_assessment_id_FK FOREIGN KEY (assessment_id) REFERENCES assessments (id);

DROP TABLE IF EXISTS participant_assessment_responses;

CREATE TABLE participant_assessment_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assessment_attempt_id BIGINT,
    question_id BIGINT,
    entered_answers TEXT,
    is_correct BOOLEAN,
    point_awarded DECIMAL(10, 2),
    negative_point DECIMAL(10, 2),
    options_ids TEXT,
    started_at DATETIME,
    answered_at DATETIME,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE participant_assessment_responses
ADD CONSTRAINT participant_assessment_responses_assessment_attempt_id_FK FOREIGN KEY (assessment_attempt_id) REFERENCES participant_assessment_attempts (id);

-- Mentors
DROP TABLE IF EXISTS mentors;

CREATE TABLE mentors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    username VARCHAR(255),
    password TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS mentor_standard_sections;

CREATE TABLE mentor_standard_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT,
    standard_section_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX mentor_standard_mentor_id_standard_id (mentor_id, standard_section_id)
);

ALTER TABLE mentor_standard_sections
ADD CONSTRAINT mentor_standard_mentor_id_FK FOREIGN KEY (mentor_id) REFERENCES mentors (id),
ADD CONSTRAINT mentor_standard_standard_section_id_FK FOREIGN KEY (standard_section_id) REFERENCES standard_sections (id);

-- Mentor Categories
DROP TABLE IF EXISTS mentor_standard_section_category;

CREATE TABLE mentor_standard_section_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_standard_section_id BIGINT,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX mentor_std_sec_cat_mentor_std_sec_id_cat_id (mentor_standard_section_id, category_id)
);

ALTER TABLE mentor_standard_section_category
ADD CONSTRAINT mentor_standard_section_category_mentor_standard_section_id_FK FOREIGN KEY (mentor_standard_section_id) REFERENCES mentor_standard_sections (id),
ADD CONSTRAINT mentor_standard_section_category_category_id_FK FOREIGN KEY (category_id) REFERENCES categories (id);

INSERT INTO
    participants (
        institution_id,
        name,
        roll_number,
        password_hash,
        email,
        phone_number,
        standard_section_id
    )
VALUES
    (
        1,
        'John Doe',
        'R001',
        '$2b$10$hashedpassword1',
        'john.doe@example.com',
        '9876543210',
        5
    ),
    (
        1,
        'Jane Smith',
        'R002',
        '$2b$10$hashedpassword2',
        'jane.smith@example.com',
        '9876543211',
        5
    ),
    (
        1,
        'Michael Johnson',
        'R003',
        '$2b$10$hashedpassword3',
        'michael.j@example.com',
        '9876543212',
        5
    );

INSERT INTO
    assessment_sections (
        assessment_id,
        `name`,
        total_question_count,
        positive_mark,
        negative_mark,
        status
    )
VALUES
    (1, 'Revision 01', 1, 2, 0, 'publish');

INSERT INTO
    assessment_instructions (assessment_id, description, instructions)
VALUES
    (
        1, -- existing assessment ID
        'This assessment is for grade 10 students.',
        '1. Read all questions carefully.\n2. No negative marking.\n3. Time is limited per question.'
    );

INSERT INTO
    institutions (name, gst, email, mobile)
VALUES
    (
        'Green Valley High School',
        'GST123456',
        'contact@gvhigh.edu',
        '9876543210'
    ),
    (
        'Sunrise Public School',
        'GST654321',
        'info@sunrise.edu',
        '9123456780'
    ),
    (
        'Blue Ocean Academy',
        'GST789456',
        'admin@blueocean.edu',
        '9988776655'
    );

INSERT INTO
    standards (name, description, is_active, institution_id)
VALUES
    ('Grade 1', 'Standard for beginners', TRUE, null),
    ('Grade 2', 'Second-year standard', TRUE, null),
    ('Grade 3', 'Third-year standard', TRUE, null);

INSERT INTO
    standards (name, description, is_active, institution_id)
VALUES
    ('X A', 'tenth standard', TRUE, 1);

INSERT INTO
    standard_sections (standard_id, name)
VALUES
    (5, 'A Section'),
    (5, 'B Section');

INSERT INTO
    assessments (
        name,
        category_id,
        topic_id,
        total_marks,
        examination_duration_minutes,
        examination_code,
        type,
        schedule_date,
        is_question_timed,
        question_time_seconds,
        question_pick,
        is_homework,
        is_question_shuffle,
        is_display_result,
        reminder_time_to_end_seconds,
        created_by,
        reviewed_by,
        board_id
    )
VALUES
    (
        'Mid Term Assessment',
        1, -- category_id
        1, -- topic_id
        100.0, -- total_marks
        '60', -- duration in minutes
        'EXAM2025MID001', -- unique code
        'schedule', -- ENUM: 'prebuild' or 'schedule'
        '2025-09-01 09:00:00', -- schedule_date (TIMESTAMP)
        TRUE, -- is_question_timed
        '60', -- question time per question in seconds
        'auto', -- ENUM: 'auto' or 'manual'
        FALSE, -- is_homework
        TRUE, -- is_question_shuffle
        TRUE, -- is_display_result
        300, -- reminder_time_to_end_seconds
        'admin_user', -- created_by
        'reviewer_user', -- reviewed_by
        2 -- board_id
    );

insert into
    topics (`name`, `description`)
VALUES
    ('Topics 1', null),
    ('Topics 2', null);

INSERT INTO
    question_explanations (question_id, explanation)
VALUES
    (
        1,
        'Every sentence must begin with a capital letter and end with a period (full stop) when it''s a statement.'
    );

INSERT INTO
    mcq_options (question_id, option_text, is_correct_answer)
VALUES
    (1, 'he is a good boy.', false),
    (1, 'He is a good boy', false),
    (1, 'He is a good boy.', true),
    (1, 'he Is A Good boy.', false);

INSERT INTO
    questions (
        question,
        question_type_id,
        category_id,
        source_id,
        mark,
        answerable_time_seconds,
        complexity_level_id,
        created_by,
        evaluation_method,
        board_id
    )
VALUES
    (
        'Identify the correctly punctuated sentence:',
        1,
        5,
        1,
        1,
        60,
        1,
        'Fejin|1|users',
        null,
        1
    );

INSERT INTO
    boards (name)
VALUES
    ('CBSE'),
    ('TNBSE'),
    ('CISCE'),
    ('NIOS');

INSERT INTO
    complexity_levels (name)
VALUES
    ('beginner'),
    ('intermediate'),
    ('advanced'),
    ('pro');

INSERT INTO
    question_sources (name)
VALUES
    ('Book'),
    ('Online');

INSERT INTO
    categories (name, parent_id)
VALUES
    ('English', null),
    ('Mathematics', null),
    ('Science', null),
    ('Social Science', null),
    ('Verbal', 1),
    ('Algebra', 2),
    ('Matrix', 2),
    ('Physics', 3),
    ('Chemestry', 3),
    ('Biology', 3),
    ('History', 4),
    ('Geography', 4);

INSERT INTO
    question_types (name, description)
VALUES
    ('MCQ', 'Multiple Choice Question'),
    ('FIB', 'FILL IN THE BLANKS');

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    question_type_id INT,
    category_id BIGINT,
    source_id BIGINT,
    mark DOUBLE,
    answerable_time_seconds INT,
    complexity_level_id BIGINT,
    created_by VARCHAR(255),
    verified_by VARCHAR(255),
    status ENUM('draft', 'publish') DEFAULT 'draft',
    evaluation_method ENUM('AI', 'MANUAL'),
    board_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO
    users (`username`, `email`, `password_hash`)
VALUES
    (
        'Fejin',
        'rpf.fejin@gmail.com',
        '$2b$10$7V7.FziDKXggSvaP3pfzGeKOUWFWptkVaGp.aV7b/fiUxErNAX0Z2'
    );

-- ALTER TABLE users
--     ADD CONSTRAINT users_institution_id
--         FOREIGN KEY (institution_id)
--             REFERENCES parent_table(institution);
-- ============================================
-- ALTER QUERIES: Migrate Categories from Sections to Standards
-- ============================================
-- Step 1: Update foreign key constraint on categories.standard_id to allow ON DELETE SET NULL
-- Note: If the constraint already exists, you may need to drop it first manually:
-- ALTER TABLE categories DROP FOREIGN KEY fk_categories_standard_id;
-- Then run the ADD CONSTRAINT below
-- Re-add the constraint with ON DELETE SET NULL to match entity definition
ALTER TABLE categories
DROP FOREIGN KEY fk_categories_standard_id;

ALTER TABLE categories
ADD CONSTRAINT fk_categories_standard_id FOREIGN KEY (standard_id) REFERENCES standards (id) ON DELETE SET NULL;

-- Step 2: Migrate existing data from standard_section_categories to categories.standard_id
-- This updates categories that were previously linked through sections to be directly linked to standards
UPDATE categories c
INNER JOIN standard_section_categories ssc ON c.id = ssc.category_id
INNER JOIN standard_sections ss ON ssc.standard_section_id = ss.id
SET
    c.standard_id = ss.standard_id
WHERE
    c.standard_id IS NULL;

-- Step 3: Drop the standard_section_categories table as it's no longer needed
-- Categories are now directly connected to standards
DROP TABLE IF EXISTS standard_section_categories;