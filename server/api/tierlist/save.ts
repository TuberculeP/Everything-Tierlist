import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw new Error("You must be logged to perform this action");
  const client = await serverSupabaseClient(event);
  // delete all previous rows from this user
  const { error: deleteError } = await client
    .from("votes")
    .delete()
    .eq("user_id", user.id);
  if (deleteError) throw deleteError;
  const { newVotes } = await readBody(event);
  const { status, error: insertError } = await client
    .from("votes")
    .insert(newVotes as never);
  if (insertError) throw insertError;
  return { status };
});
