import { User } from "@/lib/types/user"
import { atom } from "jotai"

export const userAtom = atom<User | undefined>(undefined)
