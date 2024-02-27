import { serverSupabaseClient } from "#supabase/server";
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data, error } = await client.rpc("get_total_scores");
  if(error) throw error;
  return data;
});
