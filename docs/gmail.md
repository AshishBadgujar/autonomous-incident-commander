# Gmail Setup

Gmail notifications are handled by the app on `localhost:8004`.

By default, Gmail is in dry-run mode. That means the workflow shows exactly what it would send, but no real email leaves your machine.

## Dry Run

This is the default setting:

```bash
GMAIL_DRY_RUN=true
```

Keep dry-run mode while testing the local incident flow.

## Live Gmail

To send real email:

1. Enable two-step verification on the Gmail account.
2. Create a Google app password for Mail.
3. Update `.env`:

```bash
GMAIL_DRY_RUN=false
GMAIL_FROM=your-address@gmail.com
GMAIL_TO=recipient@example.com
GMAIL_SMTP_USER=your-address@gmail.com
GMAIL_SMTP_PASSWORD=your-google-app-password
```

4. Restart the app:

```bash
npm run native:stop
npm run native:start
```

## SMTP Defaults

- Host: `smtp.gmail.com`
- Port: `587`
- TLS: STARTTLS

## Check Notification Status

Open the console at http://localhost:8004 or call:

```bash
curl http://localhost:8004/notify/health
```
