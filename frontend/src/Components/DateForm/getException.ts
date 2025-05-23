export const getException = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_SERVER_URL)
    return response.json()
  } catch (e) {
    console.error("Произошла ошибка!", e);
  }
};