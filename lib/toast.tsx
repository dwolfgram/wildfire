import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"
import Toast, {
  BaseToastProps,
  ErrorToast,
  BaseToast,
  ToastProps,
  InfoToast,
} from "react-native-toast-message"

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "#12a347",
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderLeftColor: "#3CBA56",
        borderRadius: 8,
        paddingVertical: 5,
        height: (props.text2?.length ?? 0) > 30 ? 76 : 60,
      }}
      text1Style={[
        {
          fontSize: 15,
          fontWeight: "bold",
          fontFamily: "san Francisco",
          color: "#fff",
        },
        props.text1Style,
      ]}
      text2Style={[
        {
          fontSize: 14,
          color: "#fafafa",
          fontFamily: "san Francisco",
        },
        props.text2Style,
      ]}
      text2NumberOfLines={2}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View
          style={{
            margin: "auto",
            position: "relative",
            left: 13,
          }}
        >
          <Ionicons name="checkmark-circle" size={26} color={"#fff"} />
        </View>
      )}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: "#d93e18",
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderLeftColor: "#3CBA56",
        borderRadius: 8,
        height: (props.text2?.length ?? 0) > 30 ? 76 : 60,
      }}
      text1Style={[
        {
          fontSize: 16,
          fontWeight: "bold",
          fontFamily: "san Francisco",
          color: "#fff",
        },
        props.text1Style,
      ]}
      text2Style={[
        {
          fontSize: 14,
          color: "#f5e1dc",
          fontFamily: "san Francisco",
        },
        props.text2Style,
      ]}
      text2NumberOfLines={2}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View
          style={{
            margin: "auto",
            position: "relative",
            left: 13,
          }}
        >
          <Ionicons name="warning" size={26} color={"#fff"} />
        </View>
      )}
    />
  ),

  info: (props: BaseToastProps) => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: "#256ccf",
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderLeftColor: "#3CBA56",
        borderRadius: 8,
        paddingVertical: 5,
        height: (props.text2?.length ?? 0) > 30 ? 76 : 60,
      }}
      text1Style={[
        {
          fontSize: 16,
          fontWeight: "bold",
          fontFamily: "san Francisco",
          color: "#fff",
        },
        props.text1Style,
      ]}
      text2Style={[
        {
          fontSize: 14,
          color: "#edf3fa",
          fontFamily: "san Francisco",
        },
        props.text2Style,
      ]}
      text2NumberOfLines={2}
      text1NumberOfLines={2}
      renderLeadingIcon={() => (
        <View
          style={{
            margin: "auto",
            position: "relative",
            left: 13,
          }}
        >
          <Ionicons name="information-circle" size={26} color={"#fff"} />
        </View>
      )}
    />
  ),
}
