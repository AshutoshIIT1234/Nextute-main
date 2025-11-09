-- Add MentorshipBooking table for storing mentorship session bookings

CREATE TABLE IF NOT EXISTS mentorship_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id INTEGER NOT NULL,
  mentor_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  student_name VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_student_id ON mentorship_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_mentor_id ON mentorship_bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_bookings_payment_id ON mentorship_bookings(payment_id);

-- Add comment
COMMENT ON TABLE mentorship_bookings IS 'Stores mentorship session bookings with payment details';
