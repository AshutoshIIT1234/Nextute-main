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