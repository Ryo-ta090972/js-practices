export function handleDatabaseError(error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error("捕捉したいエラー:", error.message);
  } else {
    throw error;
  }
}
