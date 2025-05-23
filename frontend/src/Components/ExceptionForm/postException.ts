export const postException = async (data: File) => {
  const formData = new FormData();
  formData.append("tables", data);

  fetch(import.meta.env.VITE_SERVER_URL, {
    method: "POST",
    body: formData,
  });
};