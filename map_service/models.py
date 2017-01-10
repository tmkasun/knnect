from mongoengine import Document, EmbeddedDocument, fields


class LkState(Document):
    object_id = fields.StringField(required=True)
    status = fields.StringField(required=True)
    lk_geo_feature = fields.PointField()
