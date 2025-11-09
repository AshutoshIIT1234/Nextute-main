import { PrismaClient } from '../db/generated/prisma/index.js';

const prisma = new PrismaClient();

const mentors = [
  {
    name: "Gopal Gurjar",
    email: "gopalgurjar46882@gmail.com",
    expertise: "AIIMS Patna",
    description: "Currently pursuing MBBS at AIIMS Patna. Specializes in Physics & Biology mentoring.",
    image: "https://ui-avatars.com/api/?name=Gopal+Gurjar&background=2D7B67&color=fff&size=200",
    studentsCount: 150,
    rating: 4.8,
    isAvailable: true,
    subjects: ["Physics", "Chemistry", "Biology"],
    course: "MBBS",
    instituteName: "AIIMS Patna",
    rank: "AIR 1934",
  },
  {
    name: "Shubhomoy Dey",
    email: "shubhomoy365@gmail.com",
    expertise: "IIT Dhanbad",
    description: "Currently pursuing Btech CSE at IIT Dhanbad. Specializes in Physics, Chemistry,Mathematics mentoring.",
    image: "https://ui-avatars.com/api/?name=Gopal+Gurjar&background=2D7B67&color=fff&size=200",
    studentsCount: 150,
    rating: 4,
    isAvailable: true,
    subjects: ["Physics", "Chemistry","Mathematics"],
    course: "CSE",
    instituteName: "IIT Dhanbad",
    rank: "3186",
  },
   {
    name: "Likhitha",
    email: "vijjlkhitha@gmail.com",
    expertise: "IIT Patna",
    description: "Currently pursuing Btech mathematics and computing at IIT Patna. Specializes in Mathematics mentoring.",
    image: "https://ui-avatars.com/api/?name=Gopal+Gurjar&background=2D7B67&color=fff&size=200",
    studentsCount: 150,
    rating: 4,
    isAvailable: true,
    subjects: ["Mathematics"],
    course: "mathematics and computing",
    instituteName: "IIT PATNA ",
    rank: "16k",
  },
   {
    name: "Karan garg",
    email: "gargkaran2005@gmail.com",
    expertise: "AIIMS Rishikesh",
    description: "Currently pursuing MBBS at AIIMS Rishikesh. Specializes in Biology mentoring.",
    image: "https://ui-avatars.com/api/?name=Gopal+Gurjar&background=2D7B67&color=fff&size=200",
    studentsCount: 150,
    rating: 4,
    isAvailable: true,
    subjects: ["Biology"],
    course: "MBBS",
    instituteName: "AIIMS Rishikesh ",
    rank: "241",
  },
 


];

async function main() {
  console.log('🌱 Starting mentor seed...');

  for (const mentor of mentors) {
    try {
      const created = await prisma.mentor.upsert({
        where: { email: mentor.email },
        update: mentor,
        create: mentor,
      });
      console.log(`✅ Created/Updated mentor: ${created.name}`);
    } catch (error) {
      console.error(`❌ Error creating mentor ${mentor.name}:`, error.message);
    }
  }

  console.log('✨ Mentor seed completed!');
  console.log(`📊 Total mentors: ${mentors.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });