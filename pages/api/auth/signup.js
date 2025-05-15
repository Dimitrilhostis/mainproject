// pages/api/auth/signup.js
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { email, password, name, last_name } = req.body;

  try {
    // 1) Crée le user
    const { data: user, error: userErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, last_name },
      email_confirm: true,
    });
    if (userErr) throw userErr;

    // 2) Crée le profil
    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .insert([{ user_id: user.id, email, name, last_name }]);
    if (profErr) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      throw profErr;
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: err.message });
  }
}
