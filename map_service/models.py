from mongoengine import Document, fields


class LkState(Document):
    o_id = fields.StringField(required=True)
    lk_properties = fields.DynamicField(required=True)
    lk_geo_json = fields.PointField()
