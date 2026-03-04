const resendApiKey = process.env.RESEND_API_KEY?.trim();
const fallbackContactEmail = "farzadhammdard122@gmail.com";
const contactTo =
  process.env.CONTACT_TO_EMAIL?.trim() || process.env.RESEND_TO?.trim() || fallbackContactEmail;
const contactFrom =
  process.env.CONTACT_FROM_EMAIL?.trim() ||
  process.env.RESEND_FROM?.trim() ||
  "Portfolio <onboarding@resend.dev>";

function hasEmailConfig() {
  return Boolean(resendApiKey && contactTo);
}

export function getContactEmailConfigStatus() {
  return {
    configured: hasEmailConfig(),
    hasApiKey: Boolean(resendApiKey),
    hasTo: Boolean(contactTo)
  };
}

export async function sendContactEmail(payload) {
  if (!hasEmailConfig()) {
    return {
      sent: false,
      reason: "missing_config"
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: contactFrom,
      to: [contactTo],
      subject: `Portfolio Contact: ${payload.name}`,
      reply_to: payload.email,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend request failed: ${errorText}`);
  }

  return {
    sent: true
  };
}
