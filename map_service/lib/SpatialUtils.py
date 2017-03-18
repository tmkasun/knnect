from datetime import datetime


class SpatialCons(object):
    DATE_TIME_FORMAT = "%Y-%m-%d %H:%M:%S"
    START_TIME = "start_time"
    END_TIME = "end_time"


class SpatialUtils(object):
    @staticmethod
    def validate_date(date):
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")
