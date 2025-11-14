from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
import google.generativeai as genai

# Configure Gemini AI
genai.configure(api_key=settings.GEMINI_API_KEY)


def api_ok(message, data=None, status_code=status.HTTP_200_OK):
    """
    Standard success response
    Usage: return api_ok("Success", data={'key': 'value'})
    """
    return Response(
        {
            "success": True,
            "message": message,
            "data": data if data is not None else {},
        },
        status=status_code,
    )


def api_error(message, code="ERROR", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Standard error response
    Usage: return api_error("Failed", code="VALIDATION_ERROR", details={'field': 'error'})
    """
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
    """
    Generate a short, meaningful title for chat sessions using Gemini AI
    Fallback to truncated message if AI fails
    """
    if not first_message:
        return "New Chat"

    prompt = f"""Generate a short, meaningful title (max 6 words) for this chat based on the user's message.
    
User message: {first_message}

Requirements:
- Maximum 6 words
- Descriptive and clear
- No quotes or special characters
- Title case format

Title:"""

    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(
            prompt,
            generation_config={
                'temperature': 0.3,
                'max_output_tokens': 20,
            }
        )

        title = response.text.strip()
        # Remove quotes if AI added them
        title = title.strip('"').strip("'").strip()

        # Limit to 60 characters
        if len(title) > 60:
            title = title[:57] + "..."

        return title

    except Exception as e:
        print(f"Gemini title generation failed: {e}")
        # Fallback to simple title generation
        return first_message[:50] + "..." if len(first_message) > 50 else first_message


def validate_file_size(file, max_size_mb=5):
    """
    Validate uploaded file size
    Usage: validate_file_size(request.FILES['image'], max_size_mb=10)
    """
    if file.size > max_size_mb * 1024 * 1024:
        return False, f"File size exceeds {max_size_mb}MB limit"
    return True, None


def validate_image_format(file):
    """
    Validate image file format
    Returns: (is_valid, error_message)
    """
    allowed_formats = ['image/jpeg', 'image/jpg',
                       'image/png', 'image/gif', 'image/webp']

    if file.content_type not in allowed_formats:
        return False, "Invalid image format. Allowed: JPEG, PNG, GIF, WebP"

    return True, None


def paginate_queryset(queryset, request, default_limit=20, max_limit=100):
    """
    Paginate queryset with page and limit params
    Usage: paginated_data = paginate_queryset(Product.objects.all(), request)
    Returns: (paginated_items, pagination_meta)
    """
    try:
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', default_limit))

        # Enforce maximum limit
        if limit > max_limit:
            limit = max_limit

        # Calculate pagination
        total_count = queryset.count()
        total_pages = (total_count + limit - 1) // limit

        start = (page - 1) * limit
        end = start + limit

        items = queryset[start:end]

        meta = {
            'total_count': total_count,
            'current_page': page,
            'total_pages': total_pages,
            'page_size': limit,
            'has_next': page < total_pages,
            'has_previous': page > 1,
        }

        return items, meta

    except (ValueError, TypeError):
        # Return first page if invalid params
        return queryset[:default_limit], {
            'total_count': queryset.count(),
            'current_page': 1,
            'total_pages': 1,
            'page_size': default_limit,
            'has_next': False,
            'has_previous': False,
        }
