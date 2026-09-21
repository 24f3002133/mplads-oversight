CREATE TABLE IF NOT EXISTS work_history (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_id VARCHAR(100) REFERENCES project_directory(work_id) ON DELETE CASCADE,
    field_changed VARCHAR(100),     -- e.g. 'sanction_amount', 'status'
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
