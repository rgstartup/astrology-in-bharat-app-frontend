const { Client } = require('./node_modules/pg');

const DATABASE_URL = 'postgresql://neondb_owner:npg_r94TzaWBnjVv@ep-wispy-sky-a1j6w3i2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function checkUserRole() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    const query = `
      SELECT u.email, u.name as user_name, r.name as role_name 
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = 'r66448251@gmail.com'
    `;
    const res = await client.query(query);
    if (res.rows.length > 0) {
      console.log('USER_ROLES:', JSON.stringify(res.rows));
    } else {
      console.log('USER_NOT_FOUND');
    }
  } catch (err) {
    console.error('DB_ERROR:', err.message);
  } finally {
    await client.end();
  }
}

checkUserRole();
