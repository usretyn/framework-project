package cn.com.rexen.admin.core;

import cn.com.rexen.admin.api.biz.IWorkGroupBeanService;
import cn.com.rexen.admin.api.dao.IWorkGroupBeanDao;
import cn.com.rexen.admin.api.dao.IWorkGroupRoleBeanDao;
import cn.com.rexen.admin.api.dao.IWorkGroupUserBeanDao;
import cn.com.rexen.admin.entities.WorkGroupBean;
import cn.com.rexen.admin.entities.WorkGroupRoleBean;
import cn.com.rexen.admin.entities.WorkGroupUserBean;
import cn.com.rexen.core.api.biz.JsonStatus;
import cn.com.rexen.core.api.persistence.JsonData;
import cn.com.rexen.core.api.security.IShiroService;
import cn.com.rexen.core.impl.biz.GenericBizServiceImpl;
import cn.com.rexen.core.util.Assert;
import cn.com.rexen.core.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 工作组管理服务实现
 * @author majian <br/>
 *         date:2015-7-27
 * @version 1.0.0
 */
public class WorkGroupBeanServiceImpl extends GenericBizServiceImpl<IWorkGroupBeanDao, WorkGroupBean> implements IWorkGroupBeanService {
    private static final String FUNCTION_NAME = "工作组";
    //    private IWorkGroupBeanDao dao;
    private IWorkGroupUserBeanDao workGroupUserBeanDao;
    private IWorkGroupRoleBeanDao workGroupRoleBeanDao;
    private IShiroService shiroService;

    public WorkGroupBeanServiceImpl() {
        super.init(WorkGroupBean.class.getName());
    }

    public void setWorkGroupRoleBeanDao(IWorkGroupRoleBeanDao workGroupRoleBeanDao) {
        this.workGroupRoleBeanDao = workGroupRoleBeanDao;
    }

    public void setWorkGroupUserBeanDao(IWorkGroupUserBeanDao workGroupUserBeanDao) {
        this.workGroupUserBeanDao = workGroupUserBeanDao;
    }

    public void setShiroService(IShiroService shiroService) {
        this.shiroService = shiroService;
    }


//    public void setWorkGroupBeanDao(IWorkGroupBeanDao dictBeanDao) {
//        this.dao = dictBeanDao;
//
//    }

    @Override
    public List<WorkGroupBean> query(WorkGroupBean WorkGroupBean) {
        return dao.find("select a from WorkGroupBean a where a.name like ?1", "%" + WorkGroupBean.getName() + "%");
    }

    @Override
    public void afterDeleteEntity(Long id, JsonStatus status) {
        workGroupUserBeanDao.deleteByWorkGroupId(id);
    }

    @Override
    public boolean isDelete(Long entityId, JsonStatus status) {
        if (dao.get(entityId) == null) {
            status.setFailure(true);
            status.setMsg(FUNCTION_NAME + "已经被删除！");
            return false;
        }
        return true;
    }

    @Override
    public void beforeSaveEntity(WorkGroupBean entity, JsonStatus status) {
        String userName = shiroService.getCurrentUserName();
        Assert.notNull(userName, "用户名不能为空.");
        if(StringUtils.isNotEmpty(userName)) {
            entity.setCreateBy(userName);
            entity.setUpdateBy(userName);
        }
    }

    @Override
    public boolean isUpdate(WorkGroupBean entity, JsonStatus status) {
        Assert.notNull(entity, "实体不能为空.");
        WorkGroupBean bean=(WorkGroupBean)entity;
        List<WorkGroupBean> beans = dao.find("select ob from WorkGroupBean ob where ob.name = ?1", bean.getName());
        if(beans!=null&&beans.size()>0){
            WorkGroupBean _workGroup=beans.get(0);
            if(_workGroup.getId()!=entity.getId()) {
                status.setFailure(true);
                status.setMsg(FUNCTION_NAME + "已经存在！");
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean isSave(WorkGroupBean entity, JsonStatus status) {
        Assert.notNull(entity, "实体不能为空.");
        WorkGroupBean bean=(WorkGroupBean)entity;
        List<WorkGroupBean> beans = dao.find("select ob from WorkGroupBean ob where ob.name = ?1", bean.getName());
        if(beans!=null&&beans.size()>0){
            status.setSuccess(false);
            status.setMsg(FUNCTION_NAME + "已经存在！");
            return false;
        }
        return true;
    }

    @Override
    public void beforeUpdateEntity(WorkGroupBean entity, JsonStatus status) {
        Assert.notNull(entity, "实体不能为空.");
        WorkGroupBean WorkGroup=(WorkGroupBean)entity;
        String userName = shiroService.getCurrentUserName();
        Assert.notNull(userName, "用户名不能为空.");
        if(StringUtils.isNotEmpty(userName)) {
            WorkGroup.setUpdateBy(userName);
        }
    }

    @Override
    public JsonData getAllWorkGroup(int page,int limit) {
        return dao.getAll(page, limit);
    }

    @Override
    public List getUsersByWorkGroupId(long id) {
        List<String> userIds=new ArrayList<String>();
        List<WorkGroupUserBean> workGroupUserBeans=workGroupUserBeanDao.find("select ob from WorkGroupUserBean ob where ob.groupId = ?1", id);
        if(workGroupUserBeans!=null&&!workGroupUserBeans.isEmpty()){
            for(WorkGroupUserBean workGroupUserBean:workGroupUserBeans){
                if(workGroupUserBean!=null&&workGroupUserBean.getUserId()!=0){
                    userIds.add(String.valueOf(workGroupUserBean.getUserId()));
                }
            }
        }
        return userIds;
    }
    @Override
    public List getRolesByWorkGroupId(long id) {
        List<String> roleIds=new ArrayList<String>();
        List<WorkGroupRoleBean> workGroupRoleBeans=workGroupRoleBeanDao.find("select ob from WorkGroupRoleBean ob where ob.groupId = ?1", id);
        if(workGroupRoleBeans!=null&&!workGroupRoleBeans.isEmpty()){
            for(WorkGroupRoleBean workGroupRoleBean:workGroupRoleBeans){
                if(workGroupRoleBean!=null&&workGroupRoleBean.getRoleId()!=0){
                    roleIds.add(String.valueOf(workGroupRoleBean.getRoleId()));
                }
            }
        }
        return roleIds;
    }

    @Override
    public JsonStatus saveWorkGroupUsers(long workGroupId, String userId) {
        JsonStatus jsonStatus=new JsonStatus();
        try {
            workGroupUserBeanDao.deleteByWorkGroupId(workGroupId);
            String userName=shiroService.getCurrentUserName();
            if (StringUtils.isNotEmpty(userId)) {
                if (userId.indexOf(",") != -1) {
                    String[] userIds = userId.split(",");
                    for (String _userId : userIds) {
                        if (StringUtils.isNotEmpty(_userId.trim())) {
                            WorkGroupUserBean workGroupUserBean = new WorkGroupUserBean();
                            workGroupUserBean.setCreateBy(userName);
                            workGroupUserBean.setUpdateBy(userName);
                            workGroupUserBean.setGroupId(workGroupId);
                            workGroupUserBean.setUserId(Long.parseLong(_userId));
                            workGroupUserBeanDao.save(workGroupUserBean);
                        }
                    }
                }else{
                    if (StringUtils.isNotEmpty(userId.trim())) {
                        WorkGroupUserBean workGroupUserBean = new WorkGroupUserBean();
                        workGroupUserBean.setCreateBy(userName);
                        workGroupUserBean.setUpdateBy(userName);
                        workGroupUserBean.setGroupId(workGroupId);
                        workGroupUserBean.setUserId(Long.parseLong(userId));
                        workGroupUserBeanDao.save(workGroupUserBean);
                    }
                }
            }
        }catch(Exception e){
            e.printStackTrace();
            jsonStatus.setFailure(true);
            jsonStatus.setMsg("保存失败!");
            return jsonStatus;
        }
        jsonStatus.setSuccess(true);
        jsonStatus.setMsg("保存成功!");
        return jsonStatus;
    }

    @Override
    public JsonStatus saveWorkGroupRoles(long workGroupId, String roleId) {
        JsonStatus jsonStatus=new JsonStatus();
        try {
            workGroupRoleBeanDao.deleteByWorkGroupId(workGroupId);
            String userName=shiroService.getCurrentUserName();
            if (StringUtils.isNotEmpty(roleId)) {
                if (roleId.indexOf(",") != -1) {
                    String[] roleIds = roleId.split(",");
                    for (String _roleId : roleIds) {
                        if (StringUtils.isNotEmpty(_roleId.trim())) {
                            WorkGroupRoleBean workGroupRoleBean = new WorkGroupRoleBean();
                            workGroupRoleBean.setCreateBy(userName);
                            workGroupRoleBean.setUpdateBy(userName);
                            workGroupRoleBean.setGroupId(workGroupId);
                            workGroupRoleBean.setRoleId(Long.parseLong(_roleId));
                            workGroupRoleBeanDao.save(workGroupRoleBean);
                        }
                    }
                }else{
                    if (StringUtils.isNotEmpty(roleId.trim())) {
                        WorkGroupRoleBean workGroupRoleBean = new WorkGroupRoleBean();
                        workGroupRoleBean.setCreateBy(userName);
                        workGroupRoleBean.setUpdateBy(userName);
                        workGroupRoleBean.setGroupId(workGroupId);
                        workGroupRoleBean.setRoleId(Long.parseLong(roleId));
                        workGroupRoleBeanDao.save(workGroupRoleBean);
                    }
                }
            }
        }catch(Exception e){
            e.printStackTrace();
            jsonStatus.setFailure(true);
            jsonStatus.setMsg("保存失败!");
            return jsonStatus;
        }
        jsonStatus.setSuccess(true);
        jsonStatus.setMsg("保存成功!");
        return jsonStatus;
    }

    @Override
    public List<WorkGroupUserBean> getWorkGroupUserBeanByUserId(long userId) {
        return workGroupUserBeanDao.find("select wgu from WorkGroupUserBean wgu where wgu.userId=?1",userId);
    }
}
