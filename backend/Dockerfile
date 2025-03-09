# --- Stage 1: Builder ---
FROM python:3.9-slim AS builder

# Set environment variables (for build stage)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt /app/

# Install dependencies
RUN pip install --user --no-cache-dir -r requirements.txt


# --- Stage 2: Production ---
FROM python:3.9-slim

# Set environment variables (for runtime)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy *only* the installed dependencies from the builder stage
COPY --from=builder /root/.local /root/.local

# Copy the application code
COPY . /app/

# Add the .local/bin directory to PATH (in case we need any CLI tools)
ENV PATH="/root/.local/bin:$PATH"

# Run the application using the main.py file
CMD ["python", "main.py"]