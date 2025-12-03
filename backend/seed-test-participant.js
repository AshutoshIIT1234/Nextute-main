import { PrismaClient } from './db/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding test participant...\n');

  try {
    const participant = await prisma.techHuntParticipant.create({
      data: {
        name: 'Ashutosh',
        rollNumber: '2312res192',
        teamName: 'Akatsuki',
      },
    });

    console.log('✅ Test participant added successfully!\n');
    console.log('Details:');
    console.log('  Name:', participant.name);
    console.log('  Roll Number:', participant.rollNumber);
    console.log('  Team Name:', participant.teamName);
    console.log('  Claimed At:', participant.claimedAt);
    console.log('  ID:', participant.id);
    console.log('');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  This participant already exists!');
      console.log('   (Roll number + team name combination is unique)');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
