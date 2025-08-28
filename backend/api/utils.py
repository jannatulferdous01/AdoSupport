import openai
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.response import Response

openai.api_key = settings.OPENAI_API_KEY


def success_response(message, data=None, status_code=200):
    return {
        "success": True,
        "statusCode": status_code,
        "message": message,
        "data": data
    }


def error_response(message, error_type="Error", status_code=400):
    return {
        "success": False,
        "statusCode": status_code,
        "errorType": error_type,
        "message": message
    }


def api_ok(message, data=None, status_code=status.HTTP_200_OK):
    return Response(
        {
            "success": True,
            "statusCode": status_code,
            "message": message,
            "data": data if data is not None else [],
        },
        status=status_code,
    )


def api_error(message, code="INVALID_REQUEST", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    return Response(
        {
            "success": False,
            "statusCode": status_code,
            "message": message,
            "error": {
                "code": code,
                "details": details or {},
            },
        },
        status=status_code,
    )


def generate_ai_session_title(first_message) -> str:
    if not first_message:
        return "New Chat"

    prompt = f"Generate a short, meaningful title (max 8 words) for this chat based on the user's message: {first_message}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates concise, meaningful titles for chat conversations. Keep titles under 8 words and make them descriptive of the main topic."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=20,
            temperature=0.5,
        )
        title = response.choices[0].message.content.strip()
        # Remove quotes if AI added them
        title = title.strip('"').strip("'")
        return title[:60]  # Limit to 60 characters
    except Exception as e:
        print(f"OpenAI title generation failed: {e}")
        # Fallback to simple title generation
        return first_message[:50] + "..." if len(first_message) > 50 else first_message
