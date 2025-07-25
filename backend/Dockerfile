# Base image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the working directory
COPY requirements.txt /code/

# Install dependencies for Python and MySQL (if needed)
RUN apt-get update -y \
    && apt-get install -y python3-dev build-essential default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project code to the working directory
COPY . /code/

# Run Django migrations (optional for build stage)
RUN python manage.py migrate

# Expose port 8000 for Daphne
EXPOSE 8000

# Start the Daphne ASGI server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "chat.asgi:application"]
