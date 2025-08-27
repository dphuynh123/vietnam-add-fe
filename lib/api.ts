export async function searchAddress(text: string) {
  try {
    const res = await fetch("https://ahphan.com/vietnam-addresses-api/api/v1/address/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return null;
  }
}