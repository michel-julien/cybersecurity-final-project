FROM python:3.12-slim
WORKDIR /app
COPY vulnerable/ ./vulnerable/
COPY sample-data/ ./sample-data/
ENV SAMPLE_DATA_DIR=/app/sample-data HOST=0.0.0.0 PORT=5001
EXPOSE 5001
CMD ["python3", "vulnerable/app.py"]
