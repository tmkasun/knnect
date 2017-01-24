from mongoengine import Document, fields


class LkState(Document):
    meta = {'strict': False}
    id = fields.StringField(required=True)
    lk_properties = fields.DynamicField(required=True)
    lk_geo_json = fields.PointField()


class SpatialObjects(Document):
    meta = {'strict': False}
    type = fields.StringField(required=True)
    id = fields.StringField(required=True)
    geometry = fields.PointField()
    properties = fields.DynamicField(required=True)
