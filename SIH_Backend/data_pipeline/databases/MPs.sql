CREATE TABLE IF NOT EXISTS mp_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mp_name VARCHAR(200) NOT NULL,
    house ENUM('Lok Sabha', 'Rajya Sabha') NOT NULL,
    tenure VARCHAR(50),
    tenure_start_date DATE,
    tenure_end_date DATE,
    state VARCHAR(100),
    district VARCHAR(150),
    allocated_amount DECIMAL(14,2),
    amount_recommended DECIMAL(14,2),
    amount_sanctioned DECIMAL(14,2) -- may differ from allocated, kept separate
);