# Dockerfile
FROM python:3.12

# Install system dependencies for mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential

# Upgrade pip to make sure you are using the latest version (which may have better compatibility with wheels)
RUN pip install --upgrade pip

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app/

# Expose port 8000
EXPOSE 8000

RUN python manage.py collectstatic --noinput

# Command to run the application
CMD ["gunicorn", "pushprogress.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]