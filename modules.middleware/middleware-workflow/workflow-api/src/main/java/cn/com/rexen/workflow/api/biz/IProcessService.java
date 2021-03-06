package cn.com.rexen.workflow.api.biz;

import cn.com.rexen.core.api.IService;
import cn.com.rexen.core.api.biz.JsonStatus;
import cn.com.rexen.workflow.api.model.JsonData;


/**
 * Created by sunlf on 2015/7/30.
 * 流程服务接口
 */
public interface IProcessService extends IService {
    JsonData getProcessDefinition(int page, int limit);

    JsonStatus activateProcessDefinition(String key);

    JsonStatus suspendProcessDefinition(String key);

    JsonData getProcessHistory(int firstResult, int maxResults);

    JsonData getHistoricActivity(String historyProcessId);
}
