__author__ = 'tmkasun'
"""
Service ( EventProcessorAdminService ) tns="http://admin.processor.event.carbon.wso2.org"
      (EventProcessorAdminServiceHttpsSoap11Endpoint)
         Methods (18):
            deployExecutionPlanConfiguration(ns2:ExecutionPlanConfigurationDto configurationDto, )
            deployExecutionPlanConfigurationFromConfigXml(xs:string executionPlanConfigurationXml, )
            editActiveExecutionPlanConfiguration(xs:string configuration, xs:string name, )
            editInactiveExecutionPlanConfiguration(xs:string configuration, xs:string fileName, )
            getActiveExecutionPlanConfiguration(xs:string name, )
            getActiveExecutionPlanConfigurationContent(xs:string planName, )
            getAllActiveExecutionPlanConfigurations()
            getAllExportedStreamSpecificActiveExecutionPlanConfiguration(xs:string streamId, )
            getAllImportedStreamSpecificActiveExecutionPlanConfiguration(xs:string streamId, )
            getAllInactiveExecutionPlanConigurations()
            getExecutionPlanStatusAsString(xs:string filename, )
            getInactiveExecutionPlanConfigurationContent(xs:string filename, )
            getSiddhiStreams(xs:string[] inputStreamDefinitions, xs:string queryExpressions, )
            setStatisticsEnabled(xs:string executionPlanName, xs:boolean isEnabled, )
            setTracingEnabled(xs:string executionPlanName, xs:boolean isEnabled, )
            undeployActiveExecutionPlanConfiguration(xs:string name, )
            undeployInactiveExecutionPlanConfiguration(xs:string fileName, )
            validateSiddhiQueries(xs:string[] inputStreamDefiniitons, xs:string queryExpressions, )
         Types (5):
            ns2:ExecutionPlanConfigurationDto
            ns2:ExecutionPlanConfigurationFileDto
            ns2:SiddhiConfigurationDto
            ns2:StreamConfigurationDto
            ns2:StreamDefinitionDto
"""

from map_service.lib.wso2.carbon_connect import AdminService
from config.carbon import api
from suds import WebFault


def escapeXml(text):
    from xml.sax.saxutils import escape

    XML_CHAR_MAP = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
    }
    return escape(text, XML_CHAR_MAP)


class EventProcessor(object):
    service_name = 'EventProcessorAdminService'

    def __init__(self):
        self._carbon = AdminService(api, service_name=self.service_name)
        self._carbon.connect()
        self._carbon.client.set_options(port='EventProcessorAdminServiceHttpsSoap11Endpoint')


    def getActiveExecutionPlanConfiguration(self, name):
        try:
            execution_plan = self._carbon.client.service.getActiveExecutionPlanConfiguration(name)
        except WebFault:
            execution_plan = None
        return execution_plan



    def editActiveExecutionPlanConfiguration(self, new_execution_plan, name):
        escaped_xml = escapeXml(new_execution_plan)
        return self._carbon.client.service.editActiveExecutionPlanConfiguration(escaped_xml, name=name)

    def deployExecutionPlanConfigurationFromConfigXml(self, executionPlanConfigurationXml):
        escaped_xml = escapeXml(executionPlanConfigurationXml)
        return self._carbon.client.service.deployExecutionPlanConfigurationFromConfigXml(escaped_xml)
