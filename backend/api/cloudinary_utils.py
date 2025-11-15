"""Cloudinary utility functions"""
import cloudinary.uploader
from django.core.exceptions import ValidationError
import os
from cloudinary import CloudinaryImage


def upload_image_to_cloudinary(image_file, folder="adosupport", public_id=None):

    try:
        # Validate file size (max 10MB)
        if image_file.size > 10 * 1024 * 1024:
            raise ValidationError("Image size must be less than 10MB")

        # Validate file type
        allowed_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        file_ext = os.path.splitext(image_file.name)[
            1].lower().replace('.', '')

        if file_ext not in allowed_formats:
            raise ValidationError(
                f"Invalid image format. Allowed: {', '.join(allowed_formats)}")

        # Upload configuration
        upload_options = {
            'folder': folder,
            'resource_type': 'image',
            'format': file_ext,
            'quality': 'auto',
            'fetch_format': 'auto',
        }

        if public_id:
            upload_options['public_id'] = public_id

        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            image_file,
            **upload_options
        )

        return {
            'success': True,
            'url': result.get('url'),
            'secure_url': result.get('secure_url'),
            'public_id': result.get('public_id'),
            'format': result.get('format'),
            'width': result.get('width'),
            'height': result.get('height'),
            'bytes': result.get('bytes'),
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def delete_image_from_cloudinary(public_id):

    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': result.get('result') == 'ok',
            'result': result.get('result')
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def get_cloudinary_url(public_id, transformations=None):

    if transformations:
        return CloudinaryImage(public_id).build_url(**transformations)

    return CloudinaryImage(public_id).build_url()


def upload_multiple_images(image_files, folder="adosupport"):

    results = []

    for image_file in image_files:
        result = upload_image_to_cloudinary(image_file, folder)
        results.append(result)

    return results


# Image transformation presets
IMAGE_TRANSFORMATIONS = {
    'thumbnail': {
        'width': 150,
        'height': 150,
        'crop': 'fill',
        'quality': 'auto',
    },
    'profile': {
        'width': 400,
        'height': 400,
        'crop': 'fill',
        'quality': 'auto',
        'gravity': 'face',
    },
    'post': {
        'width': 800,
        'height': 600,
        'crop': 'limit',
        'quality': 'auto',
    },
    'product': {
        'width': 600,
        'height': 600,
        'crop': 'pad',
        'quality': 'auto',
        'background': 'white',
    },
}


def validate_image_file(image_file):

    if image_file.size > 10 * 1024 * 1024:
        return False, "Image size must be less than 10MB"

    # Check file type
    allowed_formats = ['image/jpeg', 'image/jpg',
                       'image/png', 'image/gif', 'image/webp']
    if image_file.content_type not in allowed_formats:
        return False, "Invalid image format. Allowed: JPEG, PNG, GIF, WebP"

    return True, None
