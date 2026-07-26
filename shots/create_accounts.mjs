const SUPABASE_URL = "https://jptxpkxfyatdiiwxodal.supabase.co";
const ANON_KEY = "sb_publishable_9a0leAErUaI7k_xp5zmZuw_VqEQHIXh";

const ACCOUNTS = [
  { role: "farmer",  email: "test_farmer@demo.com",  pass: "DemoPass123!", name: "Test Farmer" },
  { role: "buyer",   email: "test_buyer@demo.com",   pass: "DemoPass123!", name: "Test Buyer" },
  { role: "warehouse_manager", email: "test_warehouse@demo.com", pass: "DemoPass123!", name: "Test Warehouse" },
  { role: "transporter", email: "test_transport@demo.com", pass: "DemoPass123!", name: "Test Transporter" },
  { role: "admin",    email: "test_admin@demo.com",   pass: "DemoPass123!", name: "Test Admin" },
];

async function main() {
  for (const acct of ACCOUNTS) {
    const body = {
      email: acct.email,
      password: acct.pass,
      options: {
        data: {
          full_name: acct.name,
          role: acct.role,
        },
      },
    };

    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.access_token) {
      console.log(`OK ${acct.role}: created (id=${data.user.id.slice(0,8)}…)`);
    } else if (data.msg && data.msg.includes("already")) {
      console.log(`OK ${acct.role}: already exists`);
    } else {
      console.log(`ERR ${acct.role}: ${JSON.stringify(data)}`);
    }
  }
}

main().catch(e => console.error(e));
