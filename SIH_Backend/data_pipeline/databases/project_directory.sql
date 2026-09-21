CREATE TABLE IF NOT EXISTS project_directory (
    work_id VARCHAR(100) PRIMARY KEY,
    mp_name VARCHAR(200) NOT NULL,
    constituency VARCHAR(150),
    state VARCHAR(100),
    description TEXT,
    category VARCHAR(100),
    activity_name VARCHAR(255),
    ida_name VARCHAR(255),
    district VARCHAR(150),
    status VARCHAR(50),
    recommended_amount DECIMAL(14,2),
    sanction_amount DECIMAL(14,2), -- separate from recommended amount
    actual_completion_amount DECIMAL(14,2),
    recommended_date DATE,
    sanctioned_date DATE,
    completion_date DATE
);
