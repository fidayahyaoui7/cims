const knex = require('knex');
const knexConfig = require('../../knexfile');

async function setupDatabase() {
  // Use development configuration
  const config = knexConfig.development;
  const db = knex(config);

  try {
    console.log('🔍 Testing database connection...');
    
    // Test the connection
    await db.raw('SELECT 1+1 AS result');
    console.log('✅ Database connection successful');
    
    // Run migrations
    console.log('\n🔄 Running database migrations...');
    const [migrationBatch, migrations] = await db.migrate.latest();
    
    if (migrations.length === 0) {
      console.log('✅ Database is already up to date');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => console.log(`- ${migration}`));
    }
    
    // List all tables
    console.log('\n📋 Current database tables:');
    const tables = await db.raw(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    if (tables.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      tables.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

setupDatabase();
