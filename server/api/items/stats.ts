import { serverSupabaseClient } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { id } = await readBody(event);
  const { data, error } = await client.rpc("get_item_stats", {
    item_id_requested: id,
  });
  if (error) throw error;
  return data[0];
});
