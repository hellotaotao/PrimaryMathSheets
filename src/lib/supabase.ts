import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { WorksheetPayload } from "./types";

let client: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function saveWorksheet(payload: WorksheetPayload) {
  if (!client) {
    return { saved: false, reason: "Supabase credentials missing" };
  }

  const { error } = await client
    .from("worksheets")
    .insert({
      config: payload.config,
      generated_at: payload.generatedAt,
      question_count: payload.questions.length,
      seed: payload.config.seed,
    })
    .select()
    .single();

  if (error) {
    return { saved: false, reason: error.message };
  }

  return { saved: true };
}
