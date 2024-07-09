import { FlatList, Image, Pressable } from "react-native"
import React from "react"
import { ThemedView } from "./ThemedView"
import { ThemedText } from "./ThemedText"
import tw from "twrnc"
import { User } from "@/lib/types/user"
import { Link } from "expo-router"
import { Button } from "@rneui/themed"
import { useAtom } from "jotai"
import { userAtom } from "@/state/user"

type DataType = User & {
  isFollowingBack: boolean
}

interface FollowListProps {
  data: DataType[]
  onFollowUnfollow: (user: DataType) => Promise<void>
  isLoading: boolean
  linkHref: string
}

const FollowItem = ({
  item: user,
  myUserId,
  onFollowButtonPress,
  linkHref,
}: {
  item: FollowListProps["data"][number]
  onFollowButtonPress: FollowListProps["onFollowUnfollow"]
  myUserId: string
  linkHref: string
  index: number
}) => {
  return (
    <Link
      href={{
        pathname: `${linkHref}`,
        params: { userId: user.id },
      }}
      push
      asChild
    >
      <Pressable>
        <ThemedView className="flex-row items-center justify-between mb-3">
          <ThemedView className="flex-row items-center gap-3">
            <Image
              className="rounded-full"
              source={{ uri: user.pfp }}
              width={40}
              height={40}
            />
            <ThemedView className="w-[200px]">
              <ThemedText
                className="text-lg"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user.username}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          {myUserId !== user.id && (
            <Button
              onPress={() => onFollowButtonPress(user)}
              buttonStyle={[
                user.isFollowingBack
                  ? tw`bg-gray-100 dark:bg-neutral-800`
                  : tw`bg-orange-600`,
                tw`py-1 px-3 rounded-md`,
              ]}
              titleStyle={[
                user?.isFollowingBack &&
                  tw`text-gray-800 dark:text-neutral-300`,
                tw`font-semibold text-base`,
              ]}
              title={user.isFollowingBack ? "unfollow" : "follow"}
              activeOpacity={0.8}
              loading={false}
              disabled={false}
            />
          )}
        </ThemedView>
      </Pressable>
    </Link>
  )
}

const FollowList = ({
  data,
  onFollowUnfollow,
  isLoading,
  linkHref,
}: FollowListProps) => {
  const [user] = useAtom(userAtom)

  return (
    <FlatList
      renderItem={(props) => (
        <FollowItem
          onFollowButtonPress={onFollowUnfollow}
          linkHref={linkHref}
          myUserId={user?.id!}
          {...props}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`pt-5`}
      data={data}
      ListEmptyComponent={
        <ThemedView className="items-center justify-center pt-1">
          <ThemedText className="opacity-50">
            {isLoading ? "loading..." : "no results"}
          </ThemedText>
        </ThemedView>
      }
      showsVerticalScrollIndicator={false}
    />
  )
}

export default FollowList
