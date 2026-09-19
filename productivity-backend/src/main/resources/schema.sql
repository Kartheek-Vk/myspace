-- Productivity App Database Schema
-- PostgreSQL

CREATE DATABASE productivity_db;

\c productivity_db;

-- Tasks table
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    subject VARCHAR(200),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    start_date DATE,
    due_date DATE,
    start_time TIME,
    end_time TIME,
    estimated_minutes INTEGER DEFAULT 0,
    notes VARCHAR(2000),
    tags VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT chk_task_category CHECK (category IN ('LIFE', 'BTECH', 'DSA', 'JAVA_DAA', 'PYTHON', 'PROJECT', 'CAREER', 'OTHER')),
    CONSTRAINT chk_task_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT chk_task_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_task_dates CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
);

-- Subtasks table
CREATE TABLE subtasks (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT fk_subtask_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT chk_subtask_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
);

-- Indexes
CREATE INDEX idx_task_due_date ON tasks(due_date);
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_task_category ON tasks(category);
CREATE INDEX idx_subtask_task_id ON subtasks(task_id);
CREATE INDEX idx_subtask_completed ON subtasks(completed);
