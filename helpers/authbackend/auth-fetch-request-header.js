export function authFetchRequestHeader(token, type = "GET", payload = "") {
  if (!!token) {
    const header = {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (!!payload) header.body = JSON.stringify(payload);

    return header;
  }
  return false;
}
