const allowedCharactersRegex = /^[\w.]{1,28}$/
const noConsecutivePeriodsRegex = /^(?!.*\.\.)/
const endWithWordCharacterRegex = /[\w]$/
const startWithWordCharacterRegex = /^[\w]/
const containsAtLeastOneLetterOrNumberRegex = /[a-zA-Z0-9]/

function validateEndWithWordCharacter(username: string): boolean {
  return endWithWordCharacterRegex.test(username)
}

function validateStartWithWordCharacter(username: string): boolean {
  return startWithWordCharacterRegex.test(username)
}

function validateNoConsecutivePeriods(username: string): boolean {
  return noConsecutivePeriodsRegex.test(username)
}

function validateAllowedCharacters(username: string): boolean {
  return allowedCharactersRegex.test(username)
}

function validateContainsLetterOrNumber(value: string): boolean {
  return containsAtLeastOneLetterOrNumberRegex.test(value)
}

export const usernameValidationRules = [
  {
    check: validateAllowedCharacters,
    message:
      "Username can only contain letters, numbers, underscores, or periods, and must be 1-30 characters long",
  },
  {
    check: validateContainsLetterOrNumber,
    message: "Username must contain at least one letter or number",
  },
  {
    check: validateStartWithWordCharacter,
    message: "Username must start with a letter, number, or underscore",
  },
  {
    check: validateNoConsecutivePeriods,
    message: "Username cannot contain two consecutive periods",
  },
  {
    check: validateEndWithWordCharacter,
    message: "Username must end with a letter, number, or underscore",
  },
]
