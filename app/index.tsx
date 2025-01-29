import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Profiq</Text>
      <Link href="/joke" style={styles.linkContainer}>
        <Text style={styles.linkText}>Tell me a joke</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  linkContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  linkText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3182ce',
    letterSpacing: 0.25,
  },
});
