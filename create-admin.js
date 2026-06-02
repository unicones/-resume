const fs = require('fs');
const path = require('path');

// Read and parse .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error(".env.local not found in this directory!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

// Dynamically import @supabase/supabase-js
let createClient;
try {
  const supabaseJs = require('@supabase/supabase-js');
  createClient = supabaseJs.createClient;
} catch (e) {
  console.error("Failed to load @supabase/supabase-js. Running npm install first might be required.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  const email = "admin@example.com";
  const password = "admin1234";
  
  console.log(`Creating Admin User: ${email}...`);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'admin'
      }
    }
  });

  if (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("SUCCESS: Admin User Created in Supabase Auth!");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log("==================================================\n");
  console.log("Note: If email confirmation is enabled in your Supabase Auth settings,");
  console.log("you will need to go to your Supabase Dashboard -> Authentication -> Users");
  console.log("and manually click 'Confirm User' for this account before logging in.");
}

createAdmin();
