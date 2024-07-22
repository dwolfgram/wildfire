export function redirectSystemPath({
  path,
  initial,
}: {
  path: string
  initial: string
}) {
  try {
    if (path.toLowerCase().includes("rnsharekey")) {
      return "(tabs)/home"
    }
    return path
  } catch {
    console.error("ERROR NATIVE INTENT ROUTE")
    // Do not crash inside this function! Instead you should redirect users
    // to a custom route to handle unexpected errors, where they are able to report the incident
    return "(tabs)/home"
  }
}
