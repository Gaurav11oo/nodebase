import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

/**
 * Safely serialize a value as JSON.
 * Never returns "undefined".
 */
Handlebars.registerHelper("json", (value) => {
    return new Handlebars.SafeString(
        JSON.stringify(value ?? {}, null, 2),
    );
});

type HttpRequestData = {
    variableName: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    const updateStatus = async (
        status: "loading" | "success" | "error",
    ) => {
        await publish(
            httpRequestChannel().status({
                nodeId,
                status,
            }),
        );
    };

    await updateStatus("loading");

    try {
        if (!data.endpoint?.trim()) {
            throw new NonRetriableError(
                "HTTP Request node: Endpoint is required.",
            );
        }

        if (!data.variableName?.trim()) {
            throw new NonRetriableError(
                "HTTP Request node: Variable name is required.",
            );
        }

        if (!data.method) {
            throw new NonRetriableError(
                "HTTP Request node: Method is required.",
            );
        }

        const result = await step.run(
            `http-request:${nodeId}`,
            async () => {
                let endpoint: string;

                try {
                    endpoint = Handlebars.compile(data.endpoint)(context).trim();
                } catch (err) {
                    throw new NonRetriableError(
                        `Failed to render endpoint.\n${err}`,
                    );
                }

                if (!endpoint) {
                    throw new NonRetriableError(
                        "Endpoint rendered to an empty string.",
                    );
                }

                const options: KyOptions = {
                    method: data.method,
                };

                if (["POST", "PUT", "PATCH"].includes(data.method)) {
                    let renderedBody = "{}";

                    try {
                        renderedBody = Handlebars.compile(
                            data.body || "{}",
                        )(context).trim();
                    } catch (err) {
                        throw new NonRetriableError(
                            `Failed to render request body.\n${err}`,
                        );
                    }

                    // console.log("========== HTTP REQUEST ==========");
                    // console.log("Template:");
                    // console.log(data.body);

                    // console.log("Rendered:");
                    // console.log(renderedBody);

                    // console.dir(context, { depth: null });
                    // console.log("==================================");

                    if (
                        !renderedBody ||
                        renderedBody === "undefined"
                    ) {
                        throw new NonRetriableError(
                            `Request body rendered to "${renderedBody}".\n\n` +
                            `This usually means a Handlebars variable doesn't exist.\n\n` +
                            `Template:\n${data.body}`,
                        );
                    }

                    let parsedBody: unknown;

                    try {
                        parsedBody = JSON.parse(renderedBody);
                    } catch {
                        throw new NonRetriableError(
                            `Request body is not valid JSON.\n\n` +
                            `Template:\n${data.body}\n\n` +
                            `Rendered:\n${renderedBody}`,
                        );
                    }

                    options.json = parsedBody;
                }

                let response;

                try {
                    response = await ky(endpoint, options);
                } catch (err) {
                    throw new NonRetriableError(
                        `HTTP request failed.\n${err}`,
                    );
                }

                const contentType =
                    response.headers.get("content-type") ?? "";

                const responseData = contentType.includes(
                    "application/json",
                )
                    ? await response.json()
                    : await response.text();

                return {
                    ...context,
                    [data.variableName]: {
                        httpResponse: {
                            status: response.status,
                            statusText: response.statusText,
                            headers: Object.fromEntries(
                                response.headers.entries(),
                            ),
                            data: responseData,
                        },
                    },
                };
            },
        );

        await updateStatus("success");

        return result;
    } catch (err) {
        await updateStatus("error");

        if (err instanceof NonRetriableError) {
            throw err;
        }

        throw new NonRetriableError(
            err instanceof Error
                ? err.message
                : "Unknown HTTP Request error.",
        );
    }
};