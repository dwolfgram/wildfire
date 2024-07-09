import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Feather as Icon } from "@expo/vector-icons"

const TabIcon = ({ name, label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="items-center justify-center p-4"
  >
    <Icon name={name} color="white" size={24} />
    <Text className="text-white">{label}</Text>
  </TouchableOpacity>
)

export default TabIcon
