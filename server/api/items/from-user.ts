import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  if (!user) throw new Error("You must be logged to perform this action");

  const { data } = await client
    .from("items")
    .select("id, name")
    .eq("user_id", user.id);

  return { items: data };
});
