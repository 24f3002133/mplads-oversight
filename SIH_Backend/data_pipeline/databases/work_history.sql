CREATE TABLE work_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    work_id VARCHAR(100),           -- FK to project_directory
    field_changed VARCHAR(100),     -- e.g. 'sanction_amount', 'work_stage'
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);