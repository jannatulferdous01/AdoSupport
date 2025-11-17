from django.conf import settings
import google.generativeai as genai
from rest_framework import status, permissions
from rest_framework.response import Response


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
    """Generate a chat session title from the first message"""
    if not first_message:
        return "New Chat"

    try:
        # Try using Gemini if configured
        if hasattr(settings, 'GOOGLE_API_KEY') and settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            prompt = f"Generate a short, meaningful title (max 8 words) for this mental health chat based on the user's message: {first_message}. Reply with only the title, no quotes."
            
            response = model.generate_content(prompt)
            title = response.text.strip()
            # Remove quotes if AI added them
            title = title.strip('"').strip("'")
            return title[:60]  # Limit to 60 characters
            
    except Exception as e:
        print(f"AI title generation failed: {e}")
    
    # Fallback to simple title generation from first message
    return first_message[:50] + "..." if len(first_message) > 50 else first_message
