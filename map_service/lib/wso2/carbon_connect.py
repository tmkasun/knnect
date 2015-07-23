__author__ = 'tmkasun'

from suds.client import Client
from suds.transport.https import HttpAuthenticated


class AdminService(object):
    client = None

    def __init__(self, api, service_name):
        self.tenant = HttpAuthenticated(username=api['username'], password=api['password'])

        self.protocol = 'http'
        if api['ssl']:
            self.protocol = 'https'

        self.wsdl_url = '{}://{}:{}/services/{}?wsdl'.format(self.protocol, api['host'], api['port'],
                                                             service_name)
        self.service_url = '{}://{}:{}/services/{}'.format(self.protocol, api['host'], api['port'],
                                                           service_name)

    def connect(self):
        self.client = Client(self.wsdl_url, transport=self.tenant, location=self.service_url)

    def is_connected(self):
        if not self.client:
            return False
        return True