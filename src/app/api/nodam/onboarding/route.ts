import { getUser } from "@/shared/lib/api/getUser";

export async function POST(request: Request) {
  const auth = await getUser(request);
  if ("response" in auth) return auth.response;

  const { supabase, user } = auth;

  try {
    const body = await request.json();
    const { dailySmokeCost, dailySmokeCount } = body;

    const { error } = await supabase
      .from("nodam_status")
      .upsert(
        {
          user_id: user.id,
          start_date: new Date().toISOString(),
          daily_smoke_cost: dailySmokeCost ?? 4500,
          daily_smoke_count: dailySmokeCount ?? 20,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      return new Response(
        JSON.stringify({ message: "DB 에러", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "금연 시작 저장 완료" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "요청 처리 실패" }),
      { status: 500 }
    );
  }
}