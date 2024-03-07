import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ApiHandler } from "sst/node/api";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabaseUrl = "https://yuldghaqqbjlljamwaxa.supabase.co";
const supabaseKey = String(process.env.SUPABASE_KEY);
const client = createClient(supabaseUrl, supabaseKey);

export const create = ApiHandler(async (_evt: APIGatewayProxyEventV2) => {
  const { body } = _evt;

  const schema = z.object({
    url: z.string().url(),
    name: z.string(),
    data: z.record(z.any()).optional(),
  });

  try {
    const payload = JSON.parse(body ?? "{}");
    schema.parse(payload);

    payload.data = { ...payload.data, ..._evt.headers };

    const { error } = await client.from("events").insert(payload);

    if (error) {
      throw error;
    }

    return {
      statusCode: 201,
      headers: {
        "Set-Cookie": `_unique_id=${Date.now()}; Max-Age=${60 * 60 * 24 * 365}; HttpOnly`,
      },
    };
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify({ error }),
    };
  }
});
