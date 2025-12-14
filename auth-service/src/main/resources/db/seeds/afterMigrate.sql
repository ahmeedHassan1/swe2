-- ============================================================================
-- SEED DATA - EXECUTED ON EVERY STARTUP
-- ============================================================================
-- This script deletes all existing data and inserts fresh seed data
-- Password for all users: 123456 (hashed: $2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou)
-- ============================================================================

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Clear all existing data (in reverse order of dependencies)
TRUNCATE TABLE audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE announcement_reads RESTART IDENTITY CASCADE;
TRUNCATE TABLE announcements RESTART IDENTITY CASCADE;
TRUNCATE TABLE payroll RESTART IDENTITY CASCADE;
TRUNCATE TABLE leaves RESTART IDENTITY CASCADE;
TRUNCATE TABLE attendance RESTART IDENTITY CASCADE;
TRUNCATE TABLE employees RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- ============================================================================
-- USERS DATA
-- ============================================================================
-- Password: 123456 (hashed with BCrypt)
INSERT INTO users (id, email, password, role, created_at) VALUES
-- Admin Users
(1, 'admin@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'ADMIN', NOW()),
(2, 'hr@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'ADMIN', NOW()),

-- Employee Users
(3, 'john.doe@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(4, 'jane.smith@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(5, 'mike.johnson@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(6, 'sarah.williams@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(7, 'david.brown@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(8, 'emily.davis@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(9, 'robert.miller@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(10, 'lisa.wilson@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(11, 'james.moore@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW()),
(12, 'maria.taylor@company.com', '$2a$10$VLaxtEi1z98XZ66O55D/j.OkVmk.HVNJnI0IomfCMcHJoSYnhYvou', 'EMPLOYEE', NOW());

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- ============================================================================
-- EMPLOYEES DATA
-- ============================================================================
INSERT INTO employees (id, user_id, employee_id, first_name, last_name, email, phone, address, department, position, join_date, salary, created_at) VALUES
-- Admin Employees
(1, 1, 'EMP001', 'Admin', 'User', 'admin@company.com', '+1-555-0101', '123 Admin St, New York, NY', 'Management', 'System Administrator', '2020-01-15', 80000.00, NOW()),
(2, 2, 'EMP002', 'HR', 'Manager', 'hr@company.com', '+1-555-0102', '456 HR Ave, New York, NY', 'Human Resources', 'HR Manager', '2020-03-01', 75000.00, NOW()),

-- Engineering Department
(3, 3, 'EMP003', 'John', 'Doe', 'john.doe@company.com', '+1-555-0103', '789 Tech Blvd, San Francisco, CA', 'Engineering', 'Senior Software Engineer', '2021-06-15', 95000.00, NOW()),
(4, 4, 'EMP004', 'Jane', 'Smith', 'jane.smith@company.com', '+1-555-0104', '321 Code Lane, San Francisco, CA', 'Engineering', 'Software Engineer', '2022-01-10', 85000.00, NOW()),
(5, 5, 'EMP005', 'Mike', 'Johnson', 'mike.johnson@company.com', '+1-555-0105', '654 Dev Street, Austin, TX', 'Engineering', 'Frontend Developer', '2022-04-20', 80000.00, NOW()),

-- Marketing Department
(6, 6, 'EMP006', 'Sarah', 'Williams', 'sarah.williams@company.com', '+1-555-0106', '987 Market Rd, Chicago, IL', 'Marketing', 'Marketing Manager', '2021-02-14', 72000.00, NOW()),
(7, 7, 'EMP007', 'David', 'Brown', 'david.brown@company.com', '+1-555-0107', '147 Brand Ave, Chicago, IL', 'Marketing', 'Marketing Specialist', '2022-07-01', 62000.00, NOW()),

-- Sales Department
(8, 8, 'EMP008', 'Emily', 'Davis', 'emily.davis@company.com', '+1-555-0108', '258 Sales Pkwy, Boston, MA', 'Sales', 'Sales Manager', '2020-11-30', 78000.00, NOW()),
(9, 9, 'EMP009', 'Robert', 'Miller', 'robert.miller@company.com', '+1-555-0109', '369 Deal Street, Boston, MA', 'Sales', 'Sales Representative', '2023-01-15', 58000.00, NOW()),

-- Finance Department
(10, 10, 'EMP010', 'Lisa', 'Wilson', 'lisa.wilson@company.com', '+1-555-0110', '741 Finance Blvd, Seattle, WA', 'Finance', 'Financial Analyst', '2021-09-01', 70000.00, NOW()),
(11, 11, 'EMP011', 'James', 'Moore', 'james.moore@company.com', '+1-555-0111', '852 Money Lane, Seattle, WA', 'Finance', 'Accountant', '2022-11-20', 65000.00, NOW()),

-- Customer Support
(12, 12, 'EMP012', 'Maria', 'Taylor', 'maria.taylor@company.com', '+1-555-0112', '963 Support Ave, Miami, FL', 'Customer Support', 'Support Specialist', '2023-03-10', 52000.00, NOW());

-- Reset sequence for employees
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));

-- ============================================================================
-- ATTENDANCE DATA (Last 30 days)
-- ============================================================================
-- Generate attendance records for the last 30 days
-- Mix of on-time, late, and some absences

-- Helper function to generate dates
DO $$
DECLARE
    emp_record RECORD;
    day_offset INT;
    attendance_date DATE;
    clock_in TIME;
    clock_out TIME;
    random_val FLOAT;
BEGIN
    -- Loop through each employee (excluding admins)
    FOR emp_record IN SELECT id FROM employees WHERE id > 2 LOOP
        -- Generate attendance for last 30 days
        FOR day_offset IN 0..29 LOOP
            attendance_date := CURRENT_DATE - day_offset;
            
            -- Skip weekends
            IF EXTRACT(DOW FROM attendance_date) NOT IN (0, 6) THEN
                random_val := random();
                
                -- 85% present, 10% late, 5% absent
                IF random_val < 0.85 THEN
                    -- On time (8:00 AM - 8:15 AM)
                    clock_in := '08:00:00'::TIME + (random() * INTERVAL '15 minutes');
                    clock_out := '17:00:00'::TIME + (random() * INTERVAL '30 minutes');
                    
                    INSERT INTO attendance (employee_id, clock_in_time, clock_out_time, date, status, work_hours, created_at)
                    VALUES (
                        emp_record.id,
                        attendance_date + clock_in,
                        attendance_date + clock_out,
                        attendance_date,
                        'PRESENT',
                        EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600,
                        NOW()
                    );
                    
                ELSIF random_val < 0.95 THEN
                    -- Late (8:30 AM - 9:30 AM)
                    clock_in := '08:30:00'::TIME + (random() * INTERVAL '60 minutes');
                    clock_out := '17:00:00'::TIME + (random() * INTERVAL '30 minutes');
                    
                    INSERT INTO attendance (employee_id, clock_in_time, clock_out_time, date, status, work_hours, created_at)
                    VALUES (
                        emp_record.id,
                        attendance_date + clock_in,
                        attendance_date + clock_out,
                        attendance_date,
                        'LATE',
                        EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600,
                        NOW()
                    );
                END IF;
                -- 5% absent (no record inserted)
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Reset sequence for attendance
SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance));

-- ============================================================================
-- LEAVES DATA
-- ============================================================================
-- Past approved leaves
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status, approved_by, approval_notes, created_at, updated_at) VALUES
-- Approved leaves (past)
(3, 'ANNUAL_LEAVE', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '55 days', 'Family vacation', 'APPROVED', 1, 'Approved - enjoy your vacation', NOW() - INTERVAL '65 days', NOW() - INTERVAL '62 days'),
(4, 'SICK_LEAVE', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '43 days', 'Flu and fever', 'APPROVED', 2, 'Approved - get well soon', NOW() - INTERVAL '46 days', NOW() - INTERVAL '45 days'),
(6, 'ANNUAL_LEAVE', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '25 days', 'Wedding anniversary trip', 'APPROVED', 1, 'Approved - congratulations', NOW() - INTERVAL '35 days', NOW() - INTERVAL '32 days'),
(8, 'EMERGENCY_LEAVE', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '20 days', 'Family emergency', 'APPROVED', 2, 'Approved - hope everything is okay', NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),

-- Pending leaves (future)
(5, 'ANNUAL_LEAVE', CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '20 days', 'Summer vacation planned', 'PENDING', NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(7, 'SICK_LEAVE', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '6 days', 'Medical appointment', 'PENDING', NULL, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(9, 'ANNUAL_LEAVE', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '35 days', 'Beach vacation', 'PENDING', NULL, NULL, NOW(), NOW()),

-- Approved leaves (upcoming)
(10, 'ANNUAL_LEAVE', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '12 days', 'Long weekend trip', 'APPROVED', 1, 'Approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),

-- Rejected leave
(11, 'ANNUAL_LEAVE', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '14 days', 'Vacation request', 'REJECTED', 1, 'Too many people on leave during this period', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

-- Recent leave
(12, 'SICK_LEAVE', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '1 day', 'Cold and headache', 'APPROVED', 2, 'Approved - rest well', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days');

-- Reset sequence for leaves
SELECT setval('leaves_id_seq', (SELECT MAX(id) FROM leaves));

-- ============================================================================
-- PAYROLL DATA (Last 2 months - excluding current month)
-- ============================================================================
-- Generate payroll for the last 2 months (excluding current month)
DO $$
DECLARE
    emp_record RECORD;
    month_offset INT;
    payroll_month INT;
    payroll_year INT;
    working_days INT := 22; -- Average working days per month
    present_count INT;
    absent_count INT;
    deduction_amount DECIMAL(10, 2);
    bonus_amount DECIMAL(10, 2);
BEGIN
    FOR emp_record IN SELECT id, salary FROM employees WHERE id > 2 LOOP
        FOR month_offset IN 1..2 LOOP
            payroll_month := EXTRACT(MONTH FROM CURRENT_DATE - (month_offset || ' months')::INTERVAL);
            payroll_year := EXTRACT(YEAR FROM CURRENT_DATE - (month_offset || ' months')::INTERVAL);
            
            -- Calculate attendance for the month
            present_count := working_days - floor(random() * 3)::INT; -- 0-2 absences
            absent_count := working_days - present_count;
            
            -- Calculate deductions (per day absent)
            deduction_amount := (emp_record.salary / working_days) * absent_count;
            
            -- Random bonus (0-1000)
            bonus_amount := floor(random() * 1000)::DECIMAL(10, 2);
            
            INSERT INTO payroll (
                employee_id, 
                month, 
                year, 
                base_salary, 
                deductions, 
                bonuses, 
                net_salary,
                working_days,
                present_days,
                absent_days,
                generated_at,
                created_at
            ) VALUES (
                emp_record.id,
                payroll_month,
                payroll_year,
                emp_record.salary,
                deduction_amount,
                bonus_amount,
                emp_record.salary - deduction_amount + bonus_amount,
                working_days,
                present_count,
                absent_count,
                NOW() - (month_offset || ' months')::INTERVAL,
                NOW() - (month_offset || ' months')::INTERVAL
            );
        END LOOP;
    END LOOP;
END $$;

-- Reset sequence for payroll
SELECT setval('payroll_id_seq', (SELECT MAX(id) FROM payroll));

-- ============================================================================
-- ANNOUNCEMENTS DATA
-- ============================================================================
INSERT INTO announcements (id, title, content, priority, created_by, created_at) VALUES
(1, 'Welcome to the Company!', 'We are excited to have you as part of our team. This attendance system will help you track your work hours, apply for leaves, and stay updated with company announcements.', 'NORMAL', 1, NOW() - INTERVAL '90 days'),

(2, 'Holiday Announcement - New Year', 'The office will be closed from December 25th to January 1st for the holiday season. Wishing everyone a wonderful holiday!', 'HIGH', 1, NOW() - INTERVAL '60 days'),

(3, 'Updated Leave Policy', 'Please note that the annual leave policy has been updated. Each employee is now entitled to 20 days of annual leave per year. Check the HR portal for more details.', 'URGENT', 2, NOW() - INTERVAL '45 days'),

(4, 'Team Building Event', 'Join us for a team building event on the 15th of next month! There will be fun activities, food, and prizes. RSVP in the company portal.', 'NORMAL', 1, NOW() - INTERVAL '30 days'),

(5, 'Office Maintenance Notice', 'The office will undergo maintenance this Saturday from 8 AM to 2 PM. Please plan accordingly if you need to access the office.', 'HIGH', 2, NOW() - INTERVAL '20 days'),

(6, 'New Health Insurance Benefits', 'We are pleased to announce enhanced health insurance benefits for all employees starting next month. Details will be shared via email.', 'HIGH', 1, NOW() - INTERVAL '15 days'),

(7, 'Quarterly Performance Reviews', 'Quarterly performance reviews will be conducted next week. Please schedule a meeting with your manager.', 'URGENT', 2, NOW() - INTERVAL '10 days'),

(8, 'Company Milestone Achieved!', 'Congratulations team! We have successfully completed 1000 projects this year. Thank you for your hard work and dedication!', 'NORMAL', 1, NOW() - INTERVAL '5 days'),

(9, 'Security Reminder', 'Please remember to lock your workstations when leaving your desk and do not share your passwords with anyone.', 'HIGH', 2, NOW() - INTERVAL '3 days'),

(10, 'Friday Casual Dress Code', 'Starting this month, employees can dress casually on Fridays. Business casual attire is still expected for client meetings.', 'NORMAL', 1, NOW() - INTERVAL '1 day'),

(11, 'System Maintenance Tonight', 'The attendance system will undergo scheduled maintenance tonight from 11 PM to 2 AM. Please plan your clock-in/out accordingly.', 'URGENT', 1, NOW());

-- Reset sequence for announcements
SELECT setval('announcements_id_seq', (SELECT MAX(id) FROM announcements));

-- ============================================================================
-- ANNOUNCEMENT READS DATA
-- ============================================================================
-- Mark some announcements as read by employees
INSERT INTO announcement_reads (announcement_id, employee_id, read_at)
SELECT 
    a.id,
    e.id,
    NOW() - (random() * INTERVAL '30 days')
FROM announcements a
CROSS JOIN employees e
WHERE e.id > 2  -- Exclude admin employees
  AND random() < 0.7  -- 70% read rate
  AND a.created_at < NOW() - INTERVAL '2 days'; -- Only for older announcements

-- Reset sequence for announcement_reads
SELECT setval('announcement_reads_id_seq', (SELECT MAX(id) FROM announcement_reads));

-- ============================================================================
-- AUDIT LOGS DATA (Sample)
-- ============================================================================
INSERT INTO audit_logs (action, user_email, details, timestamp) VALUES
('EmployeeService.createEmployee', 'admin@company.com', 'Created employee EMP012', NOW() - INTERVAL '10 days'),
('LeaveService.approveLeave', 'hr@company.com', 'Approved leave request #5', NOW() - INTERVAL '8 days'),
('PayrollService.generatePayroll', 'admin@company.com', 'Generated payroll for November 2024', NOW() - INTERVAL '5 days'),
('AnnouncementService.createAnnouncement', 'admin@company.com', 'Created announcement: System Maintenance Tonight', NOW() - INTERVAL '1 day'),
('LeaveService.rejectLeave', 'admin@company.com', 'Rejected leave request #9', NOW() - INTERVAL '2 days');

-- Reset sequence for audit_logs
SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs));
