import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function Card({ title, imageUrl, description }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,            // Android skygge
    shadowColor: "#000",     // iOS skygge
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: { width: "100%", height: 160, borderRadius: 8, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  desc: { color: "#555" },
});
