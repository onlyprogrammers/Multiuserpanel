-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (email, password, role, name) VALUES
('admin@school.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'administrator', 'John Admin'),
('teacher@school.com', '1234', 'teacher', 'Sarah Teacher'),
('student@school.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'student', 'Mike Student')
ON CONFLICT (email) DO NOTHING;
