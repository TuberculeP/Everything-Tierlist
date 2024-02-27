import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

// get item name from request and send it to the database
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  if (!user) throw new Error("You must be logged to perform this action");
  const { id }: { id: number } = await readBody(event);
  await client.from("items").delete().eq("id", id);
});
