package cn.com.rexen.notice.api.biz;

import cn.com.rexen.core.api.biz.IBizService;
import cn.com.rexen.notice.entities.NoticeBean;

import java.util.List;

/**
 * @类描述：公告管理
 * @创建人： sunlf
 * @创建时间：2014/10/10
 * @修改人：
 * @修改时间：
 * @修改备注：
 */
public interface INoticeBeanService extends IBizService {
    public List<NoticeBean> query(String title);
}
