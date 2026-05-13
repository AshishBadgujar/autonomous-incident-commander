const nodemailer = require("nodemailer");
const { gmail } = require("./config");

function recipients(payload = {}) {
  const raw = payload.recipient || gmail.to;
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function body(payload = {}) {
  const lines = [
    "Autonomous Incident App notification",
    "",
    `Incident ID: ${payload.incident_id}`,
    `Phase: ${payload.phase || "triage"}`,
    `Severity: ${payload.severity || "critical"}`,
    `Summary: ${payload.summary || ""}`,
  ];

  if (payload.action) {
    lines.push("", `Action: ${payload.action}`);
  }

  if (payload.triage !== undefined && payload.triage !== null) {
    lines.push("", "Triage:", typeof payload.triage === "string" ? payload.triage : JSON.stringify(payload.triage));
  }

  if (payload.evidence !== undefined && payload.evidence !== null) {
    lines.push("", "Evidence:", typeof payload.evidence === "string" ? payload.evidence : JSON.stringify(payload.evidence));
  }

  return lines.join("\n");
}

function health() {
  return {
    service: "app",
    healthy: true,
    notification: "gmail-smtp",
    dry_run: gmail.dryRun,
    smtp_host: gmail.host,
    smtp_port: gmail.port,
    has_user: Boolean(gmail.user),
    has_password: Boolean(gmail.password),
    from_configured: Boolean(gmail.from),
    recipient_count: recipients({}).length,
  };
}

async function send(payload = {}) {
  const to = recipients(payload);
  const canSend = Boolean(gmail.user && gmail.password && gmail.from && to.length);
  const messageBody = body(payload);

  if (gmail.dryRun || !canSend) {
    return {
      ok: true,
      dry_run: true,
      would_send: canSend,
      reason: gmail.dryRun ? "dry run enabled" : "missing Gmail SMTP settings",
      subject: payload.subject,
      to,
      body: messageBody,
    };
  }

  const transporter = nodemailer.createTransport({
    host: gmail.host,
    port: gmail.port,
    secure: gmail.port === 465,
    auth: {
      user: gmail.user,
      pass: gmail.password,
    },
  });

  await transporter.sendMail({
    from: gmail.from,
    to,
    subject: payload.subject,
    text: messageBody,
  });

  return {
    ok: true,
    dry_run: false,
    subject: payload.subject,
    to,
  };
}

module.exports = {
  health,
  send,
};
