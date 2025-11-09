-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    students_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.5,
    is_available BOOLEAN DEFAULT true,
    contact_number VARCHAR(50),
    alternative_contact_number VARCHAR(50),
    gender VARCHAR(50),
    date_of_birth TIMESTAMP,
    course VARCHAR(255),
    institute_name VARCHAR(255),
    rank VARCHAR(100),
    major VARCHAR(255),
    subjects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mentor data
INSERT INTO mentors (name, email, expertise, description, image, students_count, rating, is_available, subjects, course, institute_name, rank) VALUES
('Arjun Verma', 'arjun.verma@example.com', 'IIT Bombay CSE', 'Currently pursuing B.Tech at IIT Bombay. Specializes in Physics & Mathematics mentoring.', 'https://ui-avatars.com/api/?name=Arjun+Verma&background=2D7B67&color=fff&size=200', 150, 4.8, true, ARRAY['Physics', 'Mathematics', 'Programming'], 'B.Tech CSE', 'IIT Bombay', 'AIR 45'),
('Priya Malhotra', 'priya.malhotra@example.com', 'AIIMS Delhi MBBS', 'AIIMS Delhi student. Expert in Biology and Chemistry for NEET aspirants.', 'https://ui-avatars.com/api/?name=Priya+Malhotra&background=8B5CF6&color=fff&size=200', 180, 4.9, true, ARRAY['Biology', 'Chemistry', 'Physics'], 'MBBS', 'AIIMS Delhi', 'AIR 12'),
('Rohan Kapoor', 'rohan.kapoor@example.com', 'IIT Delhi EE', 'IIT Delhi Electrical Engineering. Helps with JEE Maths and Physics problem-solving.', 'https://ui-avatars.com/api/?name=Rohan+Kapoor&background=3B82F6&color=fff&size=200', 120, 4.7, true, ARRAY['Mathematics', 'Physics', 'Electrical Engineering'], 'B.Tech EE', 'IIT Delhi', 'AIR 78'),
('Ananya Singh', 'ananya.singh@example.com', 'JIPMER MBBS', 'JIPMER Puducherry medical student. Specializes in NEET Biology and exam strategies.', 'https://ui-avatars.com/api/?name=Ananya+Singh&background=EC4899&color=fff&size=200', 165, 4.8, true, ARRAY['Biology', 'Chemistry', 'Organic Chemistry'], 'MBBS', 'JIPMER Puducherry', 'AIR 25'),
('Karan Sharma', 'karan.sharma@example.com', 'IIT Madras ME', 'IIT Madras Mechanical Engineering. Guides on JEE preparation and time management.', 'https://ui-avatars.com/api/?name=Karan+Sharma&background=F59E0B&color=fff&size=200', 95, 4.6, true, ARRAY['Mathematics', 'Physics', 'Mechanics'], 'B.Tech ME', 'IIT Madras', 'AIR 156'),
('Sneha Patel', 'sneha.patel@example.com', 'AFMC Pune MBBS', 'Armed Forces Medical College student. Expert in NEET Chemistry and Physics.', 'https://ui-avatars.com/api/?name=Sneha+Patel&background=10B981&color=fff&size=200', 200, 4.9, true, ARRAY['Chemistry', 'Physics', 'Biology'], 'MBBS', 'AFMC Pune', 'AIR 8'),
('Aditya Reddy', 'aditya.reddy@example.com', 'IIT Kanpur CSE', 'IIT Kanpur Computer Science. Mentors in advanced Mathematics and coding.', 'https://ui-avatars.com/api/?name=Aditya+Reddy&background=6366F1&color=fff&size=200', 140, 4.8, true, ARRAY['Mathematics', 'Programming', 'Data Structures'], 'B.Tech CSE', 'IIT Kanpur', 'AIR 92'),
('Ishita Gupta', 'ishita.gupta@example.com', 'MAMC Delhi MBBS', 'Maulana Azad Medical College student. Helps with NEET Biology and revision strategies.', 'https://ui-avatars.com/api/?name=Ishita+Gupta&background=EF4444&color=fff&size=200', 175, 4.7, true, ARRAY['Biology', 'Zoology', 'Botany'], 'MBBS', 'MAMC Delhi', 'AIR 34'),
('Vikram Joshi', 'vikram.joshi@example.com', 'IIT Kharagpur CE', 'IIT Kharagpur Chemical Engineering. Specializes in JEE Chemistry and Physical Chemistry.', 'https://ui-avatars.com/api/?name=Vikram+Joshi&background=14B8A6&color=fff&size=200', 110, 4.6, true, ARRAY['Chemistry', 'Physical Chemistry', 'Mathematics'], 'B.Tech CE', 'IIT Kharagpur', 'AIR 203'),
('Riya Deshmukh', 'riya.deshmukh@example.com', 'KGMU Lucknow MBBS', 'King Georges Medical University student. Guides on NEET preparation and stress management.', 'https://ui-avatars.com/api/?name=Riya+Deshmukh&background=A855F7&color=fff&size=200', 130, 4.7, true, ARRAY['Biology', 'Chemistry', 'Anatomy'], 'MBBS', 'KGMU Lucknow', 'AIR 67')
ON CONFLICT (email) DO NOTHING;

SELECT * FROM mentors;
