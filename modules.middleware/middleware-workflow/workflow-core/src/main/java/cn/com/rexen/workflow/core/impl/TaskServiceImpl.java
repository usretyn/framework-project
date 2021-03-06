package cn.com.rexen.workflow.core.impl;

import cn.com.rexen.core.api.security.IUserLoginService;
import cn.com.rexen.workflow.api.biz.ITaskService;
import cn.com.rexen.workflow.api.model.JsonData;
import cn.com.rexen.workflow.api.model.TaskDTO;
import cn.com.rexen.workflow.api.util.WorkflowUtil;
import cn.com.rexen.workflow.core.DozerHelper;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;

import java.util.List;

/**
 * Created by sunlf on 2015/7/31.
 * 任务服务的实现类
 */
public class TaskServiceImpl implements ITaskService {
    private TaskService taskService;
    private RuntimeService runtimeService;
    private HistoryService historyService;
    private JsonData jsonData = new JsonData();
    private IUserLoginService userLoginService;

    public void setTaskService(TaskService taskService) {
        this.taskService = taskService;
    }

    public void setUserLoginService(IUserLoginService userLoginService) {
        this.userLoginService = userLoginService;
    }

    public void setRuntimeService(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    public void setHistoryService(HistoryService historyService) {
        this.historyService = historyService;
    }

    /**
     * 获得工作流任务列表
     *
     * @return
     */
    @Override
    public JsonData getTasks(int page, int limit) {
        //获得当前登陆用户
        String userName = userLoginService.getLoginName();
        List<TaskDTO> taskDTOList;
        List<Task> taskList = taskService
                .createTaskQuery()
                .taskAssignee(userName).orderByTaskCreateTime().desc()
                .listPage((page - 1) * limit, limit);

        if (taskList != null) {
            Mapper mapper = new DozerBeanMapper();
            taskDTOList = DozerHelper.map(mapper, taskList, TaskDTO.class);
            jsonData.setTotalCount((int) taskService
                    .createTaskQuery()
                    .taskAssignee(userName).count());
            //获得业务实体id
            for (TaskDTO dto : taskDTOList) {
                ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(dto.getProcessInstanceId()).singleResult();
                if(processInstance!=null) {
                    dto.setEntityId(WorkflowUtil.getBizId(processInstance.getBusinessKey()));
                }else{
                    HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(dto.getProcessInstanceId()).singleResult();
                    if(historicProcessInstance!=null)
                        dto.setEntityId(WorkflowUtil.getBizId(historicProcessInstance.getBusinessKey()));
                }
            }
            jsonData.setData(taskDTOList);
        }
        return jsonData;
    }

    /**
     * 获得流程启动用户id
     *
     * @param processInstanceId 流程实例id
     * @return
     */
    public String getStartUserName(String processInstanceId) {
        HistoricProcessInstance historicProcessInstance;
        historicProcessInstance = historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        String userName = historicProcessInstance.getStartUserId();
        return userName;
    }
}
