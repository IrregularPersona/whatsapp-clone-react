def get_config(config_name):
    """Returns config based on set env"""

    config_map = {
        'development' : DevelopmentConfig,
        'production' : ProductionConfig,
        'testing' : TestingConfig
    }

    return config_map.get(config_map, DevelopmentConfig)

