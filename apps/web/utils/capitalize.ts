export function capitalizeName(username: string) {
  const firstLetter = username[0]?.toUpperCase();
  return firstLetter + username.slice(1, username.length);
}
