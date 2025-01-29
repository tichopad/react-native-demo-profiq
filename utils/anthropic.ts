/**
 * Anthropic request message type
 */
type Message = {
  role: "user" | "assistant";
  content:
    | string
    | Array<
        | {
            type: "image";
            source: {
              type: "base64";
              media_type: string;
              data: string;
            };
          }
        | {
            type: "text";
            text: string;
          }
      >;
};

/**
 * Request type
 */
type AnthropicRequest = {
  model: string;
  max_tokens: number;
  messages: Message[];
};

/**
 * Response type
 */
type AnthropicResponse = {
  content: Array<{
    text: string;
    type: "text";
  }>;
  id: string;
  model: string;
  role: "assistant";
  stop_reason: "end_turn" | string;
  stop_sequence: string | null;
  type: "message";
  usage: {
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    input_tokens: number;
    output_tokens: number;
  };
};

/**
 * Call Anthropic API
 * @param messages - Messages to send to Anthropic
 * @returns Response from Anthropic
 */
export async function anthropic(
  messages: Message[]
): Promise<AnthropicResponse> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return a default answer if the API key is not set
    console.error(
      "Please set EXPO_PUBLIC_ANTHROPIC_API_KEY environment variable. Returning a default joke instead."
    );
    return {
      content: [
        {
          text: "Why did the environment variable go to therapy?\n\nIt was tired of being left undefined! 🛋️\n\n(Maybe set EXPO_PUBLIC_ANTHROPIC_API_KEY\nbefore I start charging for these dad jokes...)",
          type: "text",
        },
      ],
      id: "123",
      model: "claude-3-5-sonnet-20241022",
      role: "assistant",
      stop_reason: "end_turn",
      stop_sequence: null,
      type: "message",
      usage: {
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        input_tokens: 0,
        output_tokens: 0,
      },
    };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages,
    } satisfies AnthropicRequest),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  return response.json();
}
