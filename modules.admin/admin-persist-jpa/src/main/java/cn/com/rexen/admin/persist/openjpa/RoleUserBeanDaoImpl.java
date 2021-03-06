package cn.com.rexen.admin.persist.openjpa;

import cn.com.rexen.admin.api.dao.IRoleUserBeanDao;
import cn.com.rexen.admin.entities.RoleUserBean;

/**
 * 角色用户DAO实现
 * @author majian <br/>
 *         date:2015-7-23
 * @version 1.0.0
 */
public class RoleUserBeanDaoImpl extends BaseAdminDao<RoleUserBean, Long> implements IRoleUserBeanDao {
    private final String className = RoleUserBean.class.getName();

    @Override
    public void deleteByRoleId(long id) {
        super.updateNativeQuery("delete from sys_role_user where roleId="+id);
    }
}
