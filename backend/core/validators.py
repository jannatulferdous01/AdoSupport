"""Custom validators"""
from django.core.exceptions import ValidationError
import re


def validate_phone_number(phone):
    """
    Validate phone number format
    Accepts: +1234567890, 1234567890, (123) 456-7890
    """
    pattern = r'^\+?1?\d{9,15}$'
    cleaned_phone = re.sub(r'[^\d+]', '', phone)

    if not re.match(pattern, cleaned_phone):
        raise ValidationError(
            'Invalid phone number format. Use format: +1234567890 or 1234567890'
        )


def validate_age(dob):
    """
    Validate user is at least 13 years old
    """
    from datetime import date
    today = date.today()
    age = today.year - dob.year - \
        ((today.month, today.day) < (dob.month, dob.day))

    if age < 13:
        raise ValidationError('User must be at least 13 years old')

    if age > 120:
        raise ValidationError('Invalid date of birth')


def validate_username(username):
    """
    Validate username format
    - 3-30 characters
    - Alphanumeric and underscores only
    - Must start with a letter
    """
    if len(username) < 3 or len(username) > 30:
        raise ValidationError('Username must be between 3 and 30 characters')

    if not re.match(r'^[a-zA-Z][a-zA-Z0-9_]*$', username):
        raise ValidationError(
            'Username must start with a letter and contain only letters, numbers, and underscores'
        )


def validate_password_strength(password):
    """
    Validate password strength
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    """
    if len(password) < 8:
        raise ValidationError('Password must be at least 8 characters long')

    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            'Password must contain at least one uppercase letter')

    if not re.search(r'[a-z]', password):
        raise ValidationError(
            'Password must contain at least one lowercase letter')

    if not re.search(r'\d', password):
        raise ValidationError('Password must contain at least one number')


def validate_file_extension(file, allowed_extensions):
    """
    Validate file extension
    Usage: validate_file_extension(file, ['jpg', 'png', 'gif'])
    """
    import os
    ext = os.path.splitext(file.name)[1].lower().replace('.', '')

    if ext not in allowed_extensions:
        raise ValidationError(
            f'Invalid file extension. Allowed: {", ".join(allowed_extensions)}'
        )


def validate_image_dimensions(image, min_width=100, min_height=100, max_width=4000, max_height=4000):
    """
    Validate image dimensions
    """
    from PIL import Image

    img = Image.open(image)
    width, height = img.size

    if width < min_width or height < min_height:
        raise ValidationError(
            f'Image dimensions too small. Minimum: {min_width}x{min_height}px'
        )

    if width > max_width or height > max_height:
        raise ValidationError(
            f'Image dimensions too large. Maximum: {max_width}x{max_height}px'
        )
