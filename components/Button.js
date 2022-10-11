import * as React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Button({ title, onPress, icon, color }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Entypo name={icon} size={28} color={color ? color : "#f1f1f1"} />
      <Text style={[styles.text, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
    marginLeft: 10,
  },
});
