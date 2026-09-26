CREATE TABLE IF NOT EXISTS vendor_payments (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    work_id VARCHAR(100) REFERENCES project_directory(work_id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    ia_name VARCHAR(255),
    fund_disbursed_amt DECIMAL(14,2),
    expenditure_date DATE,
    payment_status VARCHAR(50)
);
