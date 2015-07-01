package cn.com.rexen.admin.persist.openjpa;

import com.daren.admin.api.dao.IRoleBeanDao;
import com.daren.admin.entities.RoleBean;
import com.daren.admin.entities.UserBean;
import com.daren.core.impl.persistence.GenericOpenJpaDao;

import javax.persistence.Query;
import java.util.List;

/**
 * @类描述：角色dao实现类
 * @创建人：sunlf
 * @创建时间：2014-04-03 下午6:32
 * @修改人：
 * @修改时间：
 * @修改备注：
 */

public class RoleBeanDaoOpenjpa extends GenericOpenJpaDao<RoleBean, Long> implements IRoleBeanDao {
    @Override
    public List<String> getRoleNameList() {
        /*List<RoleBean> roleBeanList=super.getAll(RoleBean.class.getName());
        if(roleBeanList!=null){
            roleNameList=new ArrayList<String>();
            for(RoleBean roleBean:roleBeanList){
                roleNameList.add(roleBean.getName());
            }
        }*/
        final Query query = entityManager.createQuery("select c.name from RoleBean c ");
        final List<String> resultList = query.getResultList();
        return resultList;
    }

    @Override
    public RoleBean getRole(String roleName) {
        RoleBean roleBean = this.findUnique("select u from RoleBean u where u.name=?1", roleName);
        return roleBean;
    }

    @Override
    public List<String> getRoleNameList(UserBean userBean) {
        final Query query = this.createQuery("select d.name from RoleBean d inner join d.userList t   where t.id = ?1", userBean.getId());
        final List<String> resultList = query.getResultList();
        return resultList;
    }
}
