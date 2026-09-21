CREATE TABLE IF NOT EXISTS mp_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mp_name VARCHAR(200) NOT NULL,
    house VARCHAR(20),
    tenure VARCHAR(50),
    tenure_start_date DATE,
    tenure_end_date DATE,
    state VARCHAR(100),
    constituency VARCHAR(150),
    allocated_amount DECIMAL(14,2),
    amount_recommended DECIMAL(14,2),
    amount_sanctioned DECIMAL(14,2), -- may differ from allocated, kept separate
    UNIQUE (mp_name, constituency, tenure)
);
