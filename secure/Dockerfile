FROM python:3.12-slim
WORKDIR /app
COPY secure/ ./secure/
COPY sample-data/ ./sample-data/
ENV SAMPLE_DATA_DIR=/app/sample-data HOST=0.0.0.0 PORT=5002 AUDIT_LOG=/app/secure/audit.log
EXPOSE 5002
CMD ["python3", "secure/app.py"]
