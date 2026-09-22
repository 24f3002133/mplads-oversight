CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_email VARCHAR(255),

    home_state VARCHAR(100),
    
    -- risk thresholds (what the officer actually tunes)
    risk_flag_threshold INT DEFAULT 40,
    risk_high_threshold INT DEFAULT 75,
    stalled_days INT DEFAULT 365,
    idle_fund_threshold DECIMAL(14,2) DEFAULT 50000000,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);