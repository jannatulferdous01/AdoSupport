# AdoSupport Backend

This is the backend service for the AdoSupport project, built with Django and designed to support RESTful APIs, user management, and integration testing.

## Features

- Django-based REST API
- User authentication and permissions
- Admin interface
- Integration and unit tests
- Docker support for easy deployment
- Load testing with Locust

## Project Structure

```
backend/
  api/                # Django app with models, views, serializers, etc.
  backend/            # Django project settings and configuration
  env/                # Python virtual environment
  Dockerfile          # Docker image definition
  docker-compose.yml  # Multi-container orchestration
  requirement.txt     # Python dependencies
  pyproject.toml      # Project metadata
  pytest.ini          # Pytest configuration
  locust_test.py      # Locust load test script
  locust.conf         # Locust configuration
  manage.py           # Django management script
  conftest.py         # Pytest configuration
  migrations/         # Django database migrations
testing/
  test_chatbot.py     # Chatbot test cases
  test_integration.py # Integration test cases
  test_register.py    # Registration test cases
profile_pic/
  ...                 # Profile images
```

## Setup

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/kakon2001/AdoSupport.git
   cd AdoSupport/backend
   ```

2. **Create and activate a virtual environment:**
   ```powershell
   python -m venv env
   .\env\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirement.txt
   ```

4. **Apply migrations:**
   ```powershell
   python manage.py migrate
   ```

5. **Run the development server:**
   ```powershell
   python manage.py runserver
   ```

## Docker Usage

To build and run the backend using Docker:

```powershell
docker-compose up --build
```

## Testing

### Pytest

Run all tests in the `testing/` directory:

```powershell
pytest testing/
```

Or run all tests in the project:

```powershell
pytest
```

### Django Test Runner

```powershell
python manage.py test
```

### Load Testing with Locust

Start Locust for load testing:

```powershell
locust -f locust_test.py --config locust.conf
```

Then open [http://localhost:8089](http://localhost:8089) in your browser.

## Useful Commands

- **Create superuser for admin:**
  ```powershell
  python manage.py createsuperuser
  ```

- **Collect static files:**
  ```powershell
  python manage.py collectstatic
  ```

## License

MIT