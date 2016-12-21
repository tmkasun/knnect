class IEventProcessor(object):
    def __init__(self):
        pass

    def data_in(self, geojson):
        raise NotImplementedError("Subclass need to implement this method")

    def data_out(self, geojson):
        raise NotImplementedError("Subclass need to implement this method")
