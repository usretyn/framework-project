package cn.com.rexen.admin.persist.openjpa;

import cn.com.rexen.admin.api.dao.IMessageBeanDao;
import cn.com.rexen.admin.entities.MessageBean;
import cn.com.rexen.core.impl.persistence.GenericOpenJpaDao;

/**
 * @类描述：系统消息Dao实现类
 * @创建人： sunlingfeng
 * @创建时间：2014/9/25
 * @修改人：
 * @修改时间：
 * @修改备注：
 */
public class MessageBeanDaoOpenjpa extends GenericOpenJpaDao<MessageBean, Long> implements IMessageBeanDao {
}
