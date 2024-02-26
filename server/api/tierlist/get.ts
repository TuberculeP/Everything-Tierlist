import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw new Error("You must be logged to perform this action");
  const client = await serverSupabaseClient(event);
  const { data } = await client
    .from("votes")
    .select("item_id, tier")
    .eq("user_id", user.id)
    .order("tier", { ascending: false });
  return data;
});
