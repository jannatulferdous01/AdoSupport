"""Custom exception classes"""
from rest_framework.exceptions import APIException
from rest_framework import status


class InvalidRequestError(APIException):
    """Raised when request data is invalid"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid request data'
    default_code = 'INVALID_REQUEST'


class ResourceNotFoundError(APIException):
    """Raised when requested resource is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Resource not found'
    default_code = 'NOT_FOUND'


class PermissionDeniedError(APIException):
    """Raised when user doesn't have permission"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'Permission denied'
    default_code = 'PERMISSION_DENIED'


class AuthenticationFailedError(APIException):
    """Raised when authentication fails"""
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Authentication failed'
    default_code = 'AUTHENTICATION_FAILED'


class ValidationError(APIException):
    """Raised when data validation fails"""
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = 'Validation failed'
    default_code = 'VALIDATION_ERROR'


class ServerError(APIException):
    """Raised when server encounters an error"""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'Internal server error'
    default_code = 'SERVER_ERROR'