import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def escalate_issue(email, question, error_message):
    support_email = os.getenv("SUPPORT_EMAIL")
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    msg = MIMEText(f"User email: {email}\nQuestion: {question}\nError: {error_message}")
    msg['Subject'] = 'Urgent: Issue Escalation Required'
    msg['From'] = smtp_user
    msg['To'] = support_email

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, [support_email], msg.as_string())
        logger.info("Escalation email sent successfully.")
    except Exception as e:
        logger.error(f"Failed to send escalation email: {str(e)}")

# Test function to trigger email escalation
def test_escalation():
    email = "test@example.com"
    question = "What is the normal blood pressure range for elderly?"
    error_message = "This is a test error message."
    escalate_issue(email, question, error_message)

if __name__ == "__main__":
    test_escalation()
