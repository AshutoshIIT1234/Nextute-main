import prisma from './db/index.js';

async function deleteTestInstitute() {
  try {
    // Find and delete the institute with name "bfdbdsgdsg"
    const result = await prisma.institute.deleteMany({
      where: {
        institute_name: {
          contains: 'bfdbdsgdsg',
          mode: 'insensitive'
        }
      }
    });

    console.log(`✅ Deleted ${result.count} institute(s) with name containing "bfdbdsgdsg"`);
    
    // Also delete any other test/dummy institutes
    const testPatterns = ['test', 'dummy', 'sample', 'bfd', 'asd', 'qwe', 'xyz123'];
    
    for (const pattern of testPatterns) {
      const testResult = await prisma.institute.deleteMany({
        where: {
          institute_name: {
            contains: pattern,
            mode: 'insensitive'
          }
        }
      });
      
      if (testResult.count > 0) {
        console.log(`✅ Deleted ${testResult.count} test institute(s) containing "${pattern}"`);
      }
    }
    
    console.log('\n✨ Database cleanup complete!');
  } catch (error) {
    console.error('❌ Error deleting institute:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestInstitute();
