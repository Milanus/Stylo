// Quick check to see if transformation_types table has data
import { prisma } from './lib/db/prisma'

async function checkDatabase() {
  try {
    console.log('🔍 Checking transformation_types table...\n')

    const count = await prisma.transformationType.count()
    console.log(`Found ${count} transformation types in database`)

    if (count > 0) {
      const types = await prisma.transformationType.findMany({
        select: {
          slug: true,
          label: true,
          icon: true,
          isActive: true
        },
        orderBy: { sortOrder: 'asc' }
      })

      console.log('\n📋 Existing transformation types:')
      types.forEach((type, idx) => {
        console.log(`   ${idx + 1}. ${type.icon} ${type.slug} - ${type.label} ${type.isActive ? '✅' : '❌'}`)
      })

      console.log('\n✅ Database is ready! API should work.\n')
    } else {
      console.log('\n⚠️  No data found. You need to run the seed script:')
      console.log('   psql "$DATABASE_URL" -f prisma/seed-transformation-types.sql\n')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
