export function checkErrorOfSqlite(object) {
  return object instanceof Error && object.code === "SQLITE_ERROR";
}
