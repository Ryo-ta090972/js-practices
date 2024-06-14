export function handleGeneralError(error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    throw error;
  }
}

export function handleTypeError(error) {
  if (error instanceof TypeError) {
    console.error(error.message);
  } else {
    throw error;
  }
}

export function handleSqliteGeneralError(error) {
  if (error instanceof Error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}

export function handleSqliteConstraintError(error) {
  if (error instanceof Error && error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}

export function handleEnquirerError(error) {
  if (error === "") {
    console.error("プログラムは終了しました。");
  } else {
    throw error;
  }
}
