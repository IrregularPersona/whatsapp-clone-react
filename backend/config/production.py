from .base import BaseConfig

class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False

    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True