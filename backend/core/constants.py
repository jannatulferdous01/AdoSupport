"""Shared constants across all apps"""

# ==================== User Constants ====================

USER_ROLES = (
    ('adolescent', 'Adolescent'),
    ('parent', 'Parent'),
)

# ==================== Post Constants ====================

POST_CATEGORIES = (
    ('questions', 'Questions'),
    ('experiences', 'Experiences'),
    ('resources', 'Resources'),
    ('general', 'General Discussion'),
)

POST_PRIVACY_CHOICES = (
    ('public', 'Public'),
    ('private', 'Private'),
)

# ==================== Reaction Constants ====================

REACTION_TYPES = (
    ('like', 'Like'),
    ('love', 'Love'),
    ('support', 'Support'),
    ('celebrate', 'Celebrate'),
)

# ==================== Report Constants ====================

REPORT_REASONS = (
    ('spam', 'Spam'),
    ('harassment', 'Harassment'),
    ('inappropriate', 'Inappropriate Content'),
    ('misinformation', 'Misinformation'),
    ('other', 'Other'),
)

REPORT_STATUS = (
    ('pending', 'Pending'),
    ('reviewed', 'Reviewed'),
    ('resolved', 'Resolved'),
    ('dismissed', 'Dismissed'),
)

# ==================== Order Constants ====================

ORDER_STATUS = (
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
)

PAYMENT_METHODS = (
    ('card', 'Credit/Debit Card'),
    ('paypal', 'PayPal'),
    ('cod', 'Cash on Delivery'),
)

# ==================== File Upload Constants ====================

MAX_IMAGE_SIZE_MB = 5  # 5MB
MAX_FILE_SIZE_MB = 10  # 10MB

ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg',
                         'image/png', 'image/gif', 'image/webp']
ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

# ==================== Pagination Constants ====================

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# ==================== API Rate Limiting ====================

RATE_LIMIT_AUTHENTICATED = '100/hour'
RATE_LIMIT_ANONYMOUS = '20/hour'

# ==================== Chat Constants ====================

MAX_MESSAGE_LENGTH = 2000
MAX_SESSION_TITLE_LENGTH = 100
