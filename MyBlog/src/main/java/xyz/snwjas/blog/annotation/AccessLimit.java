package xyz.snwjas.blog.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface AccessLimit {

	/**
	 * 最大访问次数
	 */
	int maxCount() default Integer.MAX_VALUE;

	/**
	 * 固定时间
	 */
	int seconds() default 1;

}
