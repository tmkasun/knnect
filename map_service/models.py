from mongoengine import Document, EmbeddedDocument, fields


class LkState(Document):
    o_id = fields.StringField(required=True)
    lk_state = fields.StringField(required=True)
    lk_geo_json = fields.PointField()
