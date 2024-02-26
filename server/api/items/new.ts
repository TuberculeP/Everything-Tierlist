import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

// get item name from request and send it to the database
export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const user = await serverSupabaseUser(event);
  if (!user) throw new Error("You must be logged to perform this action");
  const { name }: { name: string } = await readBody(event);
  await client.from("items").insert({ name, user_id: user.id } as never);
});
