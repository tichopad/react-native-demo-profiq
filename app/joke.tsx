import { Camera } from "@/components/Camera";
import { anthropic } from "@/utils/anthropic";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Joke() {
  const [joke, setJoke] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onPhotoTaken(photo: string) {
    setIsLoading(true);
    const joke = await createJoke(photo);
    setJoke(joke);
    setIsLoading(false);
  }

  function onRetake() {
    setJoke(null);
  }

  return (
    <View style={styles.container}>
      <Camera onPhotoTaken={onPhotoTaken} onRetake={onRetake} />
      {joke && <Text style={styles.text}>{joke}</Text>}
      {isLoading && <Text style={styles.text}>Loading...</Text>}
    </View>
  );
}

async function createJoke(photo: string) {
  const result = await anthropic([
    {
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: photo },
        },
        {
          type: "text",
          text: `Please create a joke about the image. It should be very awkward and dry.
          Only output the joke. Do not output any other text. Add a number of laughing emojis (😂) at the end of the joke
          so that people know they're supposed to laugh.`,
        },
      ],
    },
  ]);
  console.log('result: %o', result)
  return result.content[0].text;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    color: "#2d3748",
    textAlign: "center",
    lineHeight: 28,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
