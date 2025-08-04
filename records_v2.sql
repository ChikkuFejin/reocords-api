
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

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(255),
                            description TEXT default  null,
                            parent_id BIGINT NULL,
                            is_active BOOLEAN DEFAULT TRUE,
                            deleted_at TIMESTAMP NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            UNIQUE INDEX categories_name_parent_id (name,parent_id)
);

ALTER TABLE categories
    ADD CONSTRAINT categories_parent_id
        FOREIGN KEY (parent_id)
           REFERENCES categories(id);


DROP TABLE  IF EXISTS question_sources;
    CREATE TABLE question_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT default  null,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    unique index question_sources_name (name)
);

DROP TABLE  IF EXISTS complexity_levels;
CREATE TABLE complexity_levels (
                                   id INT AUTO_INCREMENT PRIMARY KEY,
                                   name VARCHAR(255),
                                   is_active BOOLEAN DEFAULT TRUE,
                                   deleted_at TIMESTAMP NULL,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    UNIQUE INDEX complexity_levels_name (name)
);


DROP TABLE  IF EXISTS boards;
CREATE TABLE boards (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255),
                        description TEXT default null,
                        is_active BOOLEAN DEFAULT TRUE,
                        deleted_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        UNIQUE  INDEX boards_name (name)
);

DROP TABLE  IF EXISTS questions;
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

alter table  questions
    add column deleted_at TIMESTAMP NULL;


ALTER TABLE questions
    ADD CONSTRAINT questions_question_type_id
        FOREIGN KEY (question_type_id)
           REFERENCES question_types(id),
    ADD CONSTRAINT questions_category_id_ref
        FOREIGN KEY (category_id)
            REFERENCES categories(id),
    ADD CONSTRAINT questions_source_id_ref
        FOREIGN KEY (source_id)
            REFERENCES question_sources(id),
    ADD CONSTRAINT questions_board_id_ref
        FOREIGN KEY (board_id)
            REFERENCES boards(id),
    ADD CONSTRAINT questions_complexity_level_id_ref
        FOREIGN KEY (complexity_level_id)
            REFERENCES complexity_levels(id);


DROP TABLE  IF EXISTS question_media;
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
    ADD CONSTRAINT question_media_questions_question_id
        FOREIGN KEY (question_id)
            REFERENCES questions(id);


DROP TABLE  IF EXISTS mcq_options;
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
    ADD CONSTRAINT question_mcq_options_question_id_ref
        FOREIGN KEY (question_id)
            REFERENCES questions(id);


DROP TABLE  IF EXISTS mcq_option_media;
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
    ADD CONSTRAINT mcq_option_media_mcq_options_id_ref
        FOREIGN KEY (mcq_option_id)
            REFERENCES mcq_options(id);

DROP TABLE  IF EXISTS question_explanations;
CREATE TABLE question_explanations (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       question_id BIGINT,
                                       explanation TEXT,
                                       answer_keywords TEXT default null,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE question_explanations
    ADD CONSTRAINT questions_question_id_ref
        FOREIGN KEY (question_id)
            REFERENCES questions(id);

DROP TABLE  IF EXISTS question_explanation_media;
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
    ADD CONSTRAINT question_explanation_medias_question_explanation_id_ref
        FOREIGN KEY (question_explanation_id)
            REFERENCES question_explanations(id);

DROP TABLE  IF EXISTS topics;
CREATE TABLE topics (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255),
                        description TEXT default null,
                        is_active BOOLEAN DEFAULT TRUE,
                        deleted_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




insert into topics (`name`,`description`) VALUES
                                              ('Topics 1',null),
                                              ('Topics 2',null);

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

INSERT INTO question_explanations (question_id,explanation) VALUES
(1,'Every sentence must begin with a capital letter and end with a period (full stop) when it''s a statement.');


INSERT INTO mcq_options (question_id, option_text,is_correct_answer) VALUES
 (1,'he is a good boy.',false),
 (1,'He is a good boy',false),
 (1,'He is a good boy.',true),
 (1,'he Is A Good boy.',false);



INSERT INTO questions (question,question_type_id,category_id,source_id,mark,answerable_time_seconds,complexity_level_id,created_by,evaluation_method,board_id) VALUES
    ('Identify the correctly punctuated sentence:',1,5,1,1,60,1,'Fejin|1|users',null,1);


INSERT INTO boards (name) VALUES ('CBSE'),('TNBSE'),('CISCE'),('NIOS');

INSERT INTO  complexity_levels (name) VALUES ('beginner'),('intermediate'),('advanced'),('pro');

INSERT INTO question_sources ( name) VALUES
 ('Book'),('Online');

INSERT INTO categories (name, parent_id) VALUES
 ('English',null),
 ('Mathematics',null),
 ('Science',null),
 ('Social Science',null),
 ('Verbal',1),
 ('Algebra',2),
 ('Matrix',2),
 ('Physics',3),
 ('Chemestry',3),
 ('Biology',3),
 ('History',4),
 ('Geography',4);


INSERT INTO question_types (name,description) VALUES
 ('MCQ','Multiple Choice Question'),
 ('FIB','FILL IN THE BLANKS');

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


INSERT INTO users (`username`,`email`,`password_hash`) VALUES
('Fejin','rpf.fejin@gmail.com','$2b$10$7V7.FziDKXggSvaP3pfzGeKOUWFWptkVaGp.aV7b/fiUxErNAX0Z2');

-- ALTER TABLE users
--     ADD CONSTRAINT users_institution_id
--         FOREIGN KEY (institution_id)
--             REFERENCES parent_table(institution);