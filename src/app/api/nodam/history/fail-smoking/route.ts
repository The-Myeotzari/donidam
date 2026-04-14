// /app/api/nodam/fail/route.ts

import { getUser } from "@/shared/lib/api/getUser";

export async function POST(request: Request) {
  const auth = await getUser(request);
  if ("response" in auth) return auth.response;

  const { supabase, user } = auth;

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("nodam_history")
    .upsert(
      {
        user_id: user.id,
        date: today,
        status: "fail",
      },
      {
        onConflict: "user_id,date",
      }
    )
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: "DB 에러", error }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}