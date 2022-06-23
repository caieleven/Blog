package xyz.snwjas.blog.model.base;

/**
 * 参数校验分组
 * 根据不同的操作类型检验参数
 */
public interface ValidGroupType {

	// 保存时的检验
	interface Save {
	}

	// 更新时的检验
	interface Update {
	}
}
