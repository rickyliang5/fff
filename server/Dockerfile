# Use an official Python runtime as the base image
FROM python:3.9.5

# Set the working directory in the container
WORKDIR /app/server

# Install system dependencies
RUN apt-get update && \
    apt-get install -y tesseract-ocr libtesseract-dev

# Copy the backend source code
COPY . .

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the Flask app runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=bank.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run the Flask application
CMD ["flask", "run", "--host", "0.0.0.0"]
