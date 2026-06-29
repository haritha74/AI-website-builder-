from email.message import EmailMessage
import smtplib

from flask import current_app


def send_password_reset_email(user, token):
    reset_url = f"{current_app.config['RESET_BASE_URL']}?token={token}"
    if not current_app.config["SMTP_HOST"]:
        current_app.logger.info("Password reset link for %s: %s", user.email, reset_url)
        return

    message = EmailMessage()
    message["Subject"] = "Reset your AI Website Builder password"
    message["From"] = current_app.config["SMTP_FROM"]
    message["To"] = user.email
    message.set_content(
        f"Hi {user.name},\n\nUse this secure link to reset your password:\n{reset_url}\n\nThis link expires in 30 minutes."
    )

    with smtplib.SMTP(current_app.config["SMTP_HOST"], current_app.config["SMTP_PORT"]) as smtp:
        smtp.starttls()
        if current_app.config["SMTP_USERNAME"]:
            smtp.login(current_app.config["SMTP_USERNAME"], current_app.config["SMTP_PASSWORD"])
        smtp.send_message(message)
