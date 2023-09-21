export const baseurl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  console.log("body", body);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    console.log("register inside", message);
    return { error: true, message };
  }
  console.log("register outside data", data);
  return data;
};
