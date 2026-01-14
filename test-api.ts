// Test script to verify transformation types API and prompt lookup
import { prisma } from './lib/db/prisma'
import { getCachedTransformationTypes, getCachedTransformationPrompt } from './lib/cache/transformation-types'

async function testAPI() {
  console.log('🧪 Testing Transformation Types API\n')

  try {
    // Test 1: Check database connection and data
    console.log('1️⃣ Testing database connection...')
    const typesFromDB = await prisma.transformationType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
    console.log(`✅ Found ${typesFromDB.length} transformation types in database`)

    if (typesFromDB.length === 0) {
      console.log('⚠️  WARNING: No transformation types found! Run seed script first.')
      console.log('   Command: psql "$DATABASE_URL" -f prisma/seed-transformation-types.sql\n')
    } else {
      console.log('\n📋 Available types:')
      typesFromDB.forEach((type, idx) => {
        console.log(`   ${idx + 1}. ${type.icon} ${type.slug} - ${type.label}`)
      })
    }

    // Test 2: Test caching layer - public types (without prompts)
    console.log('\n2️⃣ Testing cached transformation types (public API)...')
    const publicTypes = await getCachedTransformationTypes()
    console.log(`✅ Retrieved ${publicTypes.length} types from cache`)
    console.log('✅ Prompts are NOT exposed (security check):')
    publicTypes.forEach(type => {
      const hasPrompt = 'prompt' in type
      console.log(`   ${type.icon} ${type.slug}: ${hasPrompt ? '❌ EXPOSED!' : '✅ Hidden'}`)
    })

    // Test 3: Test prompt lookup for transformation
    console.log('\n3️⃣ Testing prompt lookup (server-side only)...')
    if (typesFromDB.length > 0) {
      const testSlug = typesFromDB[0].slug
      const prompt = await getCachedTransformationPrompt(testSlug)

      if (prompt) {
        console.log(`✅ Successfully retrieved prompt for '${testSlug}'`)
        console.log(`   Prompt length: ${prompt.length} characters`)
        console.log(`   Prompt preview: ${prompt.substring(0, 100)}...`)
      } else {
        console.log(`❌ Failed to retrieve prompt for '${testSlug}'`)
      }
    }

    // Test 4: Test invalid slug
    console.log('\n4️⃣ Testing invalid slug handling...')
    const invalidPrompt = await getCachedTransformationPrompt('invalid-slug-12345')
    if (invalidPrompt === null) {
      console.log('✅ Invalid slug correctly returns null')
    } else {
      console.log('❌ Invalid slug should return null')
    }

    console.log('\n✅ All API tests completed!\n')

  } catch (error) {
    console.error('❌ Error during testing:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run tests
testAPI().catch(console.error)
