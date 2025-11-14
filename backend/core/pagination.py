"""Custom pagination classes"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    """
    Standard pagination with customizable page size
    Default: 20 items per page
    Max: 100 items per page
    """
    page_size = 20
    page_size_query_param = 'limit'
    max_page_size = 100
    page_query_param = 'page'

    def get_paginated_response(self, data):
        """Return paginated response in standard format"""
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': {
                'results': data,
                'meta': {
                    'total_count': self.page.paginator.count,
                    'current_page': self.page.number,
                    'total_pages': self.page.paginator.num_pages,
                    'page_size': self.page_size,
                    'has_next': self.page.has_next(),
                    'has_previous': self.page.has_previous(),
                }
            }
        })


class LargePagination(PageNumberPagination):
    """
    Pagination for large datasets
    Default: 50 items per page
    Max: 200 items per page
    """
    page_size = 50
    page_size_query_param = 'limit'
    max_page_size = 200
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': {
                'results': data,
                'meta': {
                    'total_count': self.page.paginator.count,
                    'current_page': self.page.number,
                    'total_pages': self.page.paginator.num_pages,
                    'page_size': self.page_size,
                    'has_next': self.page.has_next(),
                    'has_previous': self.page.has_previous(),
                }
            }
        })


class SmallPagination(PageNumberPagination):
    """
    Pagination for small datasets
    Default: 10 items per page
    Max: 50 items per page
    """
    page_size = 10
    page_size_query_param = 'limit'
    max_page_size = 50
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'message': 'Data retrieved successfully',
            'data': {
                'results': data,
                'meta': {
                    'total_count': self.page.paginator.count,
                    'current_page': self.page.number,
                    'total_pages': self.page.paginator.num_pages,
                    'page_size': self.page_size,
                    'has_next': self.page.has_next(),
                    'has_previous': self.page.has_previous(),
                }
            }
        })