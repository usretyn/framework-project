package cn.com.rexen.core.security.filter;

import cn.com.rexen.core.api.PermissionConstant;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * shiro首頁验证处理过滤器
 * Created by sunlf on 2015/7/10.
 */
public class KalixAuthenticationFilter extends FormAuthenticationFilter {

    private static final Logger log = LoggerFactory
            .getLogger(KalixAuthenticationFilter.class);

    /*
     *  主要是针对登入成功的处理方法。对于请求头是AJAX的之间返回JSON字符串。
     */
    @Override
    protected boolean onLoginSuccess(AuthenticationToken token,
                                     Subject subject, ServletRequest request, ServletResponse response)
            throws Exception {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;

        /*if (!"XMLHttpRequest".equalsIgnoreCase(httpServletRequest.getHeader("X-Requested-With"))) {// 不是ajax请求
            issueSuccessRedirect(request, response);
        } else */
        {
            Session session=SecurityUtils.getSubject().getSession();
            String name=String.valueOf(session.getAttribute(PermissionConstant.SYS_CURRENT_USERNAME));
            httpServletResponse.setCharacterEncoding("UTF-8");
            PrintWriter out = httpServletResponse.getWriter();
            out.println("{success:true,location:'/kalix/index.jsp',message:'登入成功',user:{name:'" + name + "',token:'" + session.getId() + "'}}");
            out.flush();
            out.close();
        }
        return false;
    }

    /**
     * 主要是处理登入失败的方法
     */
    @Override
    protected boolean onLoginFailure(AuthenticationToken token,
                                     AuthenticationException e, ServletRequest request,
                                     ServletResponse response) {
//        if (!"XMLHttpRequest".equalsIgnoreCase(((HttpServletRequest) request)
//                .getHeader("X-Requested-With"))) {// 不是ajax请求
//            setFailureAttribute(request, e);
//            return true;
//        }
        try {
            response.setCharacterEncoding("UTF-8");
            PrintWriter out = response.getWriter();
            String message = e.getClass().getSimpleName();
            if ("IncorrectCredentialsException".equals(message)) {
                out.println("{success:false,message:'密码错误'}");
            } else if ("UnknownAccountException".equals(message)) {
                out.println("{success:false,message:'账号不存在'}");
            } else if ("LockedAccountException".equals(message)) {
                out.println("{success:false,message:'账号被锁定'}");
            } else {
                e.printStackTrace();
                out.println("{success:false,message:'未知错误'}");
            }
            out.flush();
            out.close();
        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        return false;
    }

    /**
     * 所有请求都会经过的方法。
     */
    @Override
    protected boolean onAccessDenied(ServletRequest request,
                                     ServletResponse response) throws Exception {

        //判断是否是登陆操作
        if (isLoginRequest(request, response)) {
            //验证登陆方式
            if (isLoginSubmission(request, response)) {
                if (log.isTraceEnabled()) {
                    log.trace("Login submission detected.  Attempting to execute login.");
                }
                /*if ("XMLHttpRequest"
                        .equalsIgnoreCase(((HttpServletRequest) request)
                                .getHeader("X-Requested-With"))) {// 不是ajax请求
                    String vcode = request.getParameter("vcode");
                    HttpServletRequest httpservletrequest = (HttpServletRequest) request;
                    *//*String vvcode = (String) httpservletrequest
                            .getSession()
                            .getAttribute(
                                    com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);*//*

                    String vvcode = "123";
                    if (vvcode == null || "".equals(vvcode)
                            || !vvcode.equals(vcode)) {
                        response.setCharacterEncoding("UTF-8");
                        PrintWriter out = response.getWriter();
                        out.println("{success:false,message:'验证码错误'}");
                        out.flush();
                        out.close();
                        return false;
                    }
                }*/
                return executeLogin(request, response);
            } else {
                if (log.isTraceEnabled()) {
                    log.trace("Login page view.");
                }
                // allow them to see the login page ;)
                return true;
            }
        } else {
            if (log.isTraceEnabled()) {
                log.trace("Attempting to access a path which requires authentication.  Forwarding to the "
                        + "Authentication url [" + getLoginUrl() + "]");
            }
            // saveRequestAndRedirectToLogin(request, response);
            if (!"XMLHttpRequest"
                    .equalsIgnoreCase(((HttpServletRequest) request)
                            .getHeader("X-Requested-With"))) {// 不是ajax请求
                saveRequestAndRedirectToLogin(request, response);
            } else {
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.println("{message:'login'}");
                out.flush();
                out.close();
            }
            return false;
        }
    }
}