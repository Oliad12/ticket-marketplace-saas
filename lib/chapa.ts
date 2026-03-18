// Chapa payment gateway client
// Docs: https://developer.chapa.co

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

if (!process.env.CHAPA_SECRET_KEY) {
  console.warn("CHAPA_SECRET_KEY is missing — Chapa payments will not work");
}

export const chapaSecretKey = process.env.CHAPA_SECRET_KEY ?? "";
export const chapaEncryptionKey = process.env.CHAPA_ENCRYPTION_KEY ?? "";

export async function initializeChapaPayment({
  amount,
  currency = "ETB",
  email,
  firstName,
  lastName,
  txRef,
  callbackUrl,
  returnUrl,
  title,
  description,
}: {
  amount: number;
  currency?: string;
  email: string;
  firstName: string;
  lastName: string;
  txRef: string;
  callbackUrl: string;
  returnUrl: string;
  title: string;
  description: string;
}) {
  const res = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chapaSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: { title, description },
    }),
  });

  const data = await res.json();
  if (data.status !== "success") {
    console.error("Chapa error response:", JSON.stringify(data));
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : JSON.stringify(data.message)
    );
  }

  return data.data as { checkout_url: string };
}

export async function verifyChapaPayment(txRef: string) {
  const res = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
    headers: { Authorization: `Bearer ${chapaSecretKey}` },
  });

  const data = await res.json();
  return data;
}
