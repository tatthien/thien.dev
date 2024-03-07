import { StackContext, Api, EventBus } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
        environment: {
          SUPABASE_KEY: String(process.env.SUPABASE_KEY),
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",

      "POST /events": "packages/functions/src/event.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
