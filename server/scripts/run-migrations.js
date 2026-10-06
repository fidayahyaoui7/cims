const knex = require('knex');
const knexConfig = require('../../knexfile');

async function runMigrations() {
  // Use development configuration for migrations
  const config = knexConfig.development;
  const db = knex(config);

  try {
    console.log('Running database migrations...');
    
    // Run migrations
    const [migrationBatch, migrations] = await db.migrate.latest();
    
    if (migrations.length === 0) {
      console.log('✅ Database is already up to date');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => console.log(`- ${migration}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

runMigrations();
