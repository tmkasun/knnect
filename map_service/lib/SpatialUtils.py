from datetime import datetime


class SpatialUtils(object):
    @staticmethod
    def _date_validate(date):
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")
