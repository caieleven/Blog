package xyz.snwjas.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import xyz.snwjas.blog.mapper.CommentMapper;
import xyz.snwjas.blog.model.PageResult;
import xyz.snwjas.blog.model.entity.CommentEntity;
import xyz.snwjas.blog.model.enums.BlogCommentAllowStatus;
import xyz.snwjas.blog.model.enums.CommentStatus;
import xyz.snwjas.blog.model.params.BasePageParam;
import xyz.snwjas.blog.model.params.CommentSearchParam;
import xyz.snwjas.blog.model.vo.BlogSimpleVO;
import xyz.snwjas.blog.model.vo.CommentDetailVO;
import xyz.snwjas.blog.model.vo.CommentSimpleVO;
import xyz.snwjas.blog.service.BlogService;
import xyz.snwjas.blog.service.CommentService;
import xyz.snwjas.blog.service.UserService;
import xyz.snwjas.blog.utils.IPUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


@Service
public class CommentServiceImpl implements CommentService {

	@Resource
	private CommentMapper commentMapper;

	@Autowired
	private UserService userService;

	@Autowired
	private BlogService blogService;

	@Override
	public int getCountByStatus(CommentStatus status) {
		return commentMapper.selectCount(
				Wrappers.lambdaQuery(CommentEntity.class)
						.eq(CommentEntity::getStatus, status)
		);
	}

	@Override
	public int getCountByBlogIdAndStatus(int blogId, CommentStatus status) {
		return commentMapper.selectCount(
				Wrappers.lambdaQuery(CommentEntity.class)
						.eq(CommentEntity::getBlogId, blogId)
						.eq(Objects.nonNull(status), CommentEntity::getStatus, status)
		);
	}

	@Override
	public int getCountByParentIdAndStatus(int parentId, CommentStatus status) {
		return commentMapper.selectCount(
				Wrappers.lambdaQuery(CommentEntity.class)
						.eq(CommentEntity::getParentId, parentId)
						.eq(Objects.nonNull(status), CommentEntity::getStatus, status)
		);
	}

	@Override
	public int changeStatus(int commentId, CommentStatus status) {
		return commentMapper.update(null,
				Wrappers.lambdaUpdate(CommentEntity.class)
						.eq(CommentEntity::getId, commentId)
						.set(CommentEntity::getStatus, status)
		);
	}

	@Override
	public int changeStatus(List<Integer> commentIds, CommentStatus status) {
		if (CollectionUtils.isEmpty(commentIds)) {
			return 0;
		}
		Set<Integer> idSet = commentIds.stream()
				.filter(id -> Objects.nonNull(id) && id > 0)
				.collect(Collectors.toSet());
		int count = 0;
		for (Integer commentId : idSet) {
			int i = changeStatus(commentId, status);
			if (i > 0) {
				count++;
			}
		}
		return count;
	}

	@Override
	public int deleteById(int commentId) {
		int i = commentMapper.deleteById(commentId);
		int ri = 0;
		if (i > 0) {
			ri = deleteByRecursively(commentId);
		}
		return i + ri;
	}

	@Override
	public int deleteByIds(@NonNull List<Integer> commentIds) {
		Set<Integer> idSet = commentIds.stream().parallel()
				.filter(id -> Objects.nonNull(id) && id > 0)
				.collect(Collectors.toSet());
		if (idSet.isEmpty()) {
			return 0;
		}
		AtomicInteger i = new AtomicInteger();
		idSet.stream().parallel().forEach(id -> i.addAndGet(deleteById(id)));
		return i.get();
	}

	/**
	 * ??????????????????
	 */
	private int deleteByRecursively(int parentId) {
		List<CommentEntity> commentEntityList = commentMapper.selectList(
				Wrappers.lambdaQuery(CommentEntity.class)
						.select(CommentEntity::getId)
						.eq(CommentEntity::getParentId, parentId)
		);
		if (CollectionUtils.isEmpty(commentEntityList)) {
			return 0;
		}
		Set<Integer> commentIdSet = commentEntityList.stream().parallel()
				.map(CommentEntity::getId)
				.collect(Collectors.toSet());
		int deleteCount = commentMapper.deleteBatchIds(commentIdSet);
		// ????????????
		AtomicInteger deletes = new AtomicInteger();
		commentIdSet.stream().parallel().forEach(id -> deletes.addAndGet(deleteByRecursively(id)));
		return deleteCount + deletes.get();
	}

	@Override
	public int deleteByBlogId(int blogId) {
		return commentMapper.delete(
				Wrappers.lambdaQuery(CommentEntity.class)
						.eq(CommentEntity::getBlogId, blogId)
		);
	}

	@Override
	public int reply(CommentDetailVO vo) {
		BlogSimpleVO blog = blogService.getSimpleById(vo.getBlogId());
		// ???????????????
		if (Objects.isNull(blog)) {
			return -1;
		}

		// ???????????????
		BlogCommentAllowStatus allowComment = blog.getAllowComment();
		if (Objects.isNull(allowComment) || allowComment == BlogCommentAllowStatus.UNALLOWED) {
			return 0;
		}

		CommentEntity commentEntity = vo.convertTo(new CommentEntity());
		commentEntity.setBlogId(vo.getBlogId());

		Integer parentId = vo.getParentId();
		commentEntity.setParentId(Objects.isNull(parentId) || parentId < 0 ? 0 : parentId);

		Authentication auth = userService.getAuth();
		if (Objects.isNull(auth)) { // ????????????
			commentEntity.setIsAdmin(false);

			CommentStatus commentStatus =
					allowComment == BlogCommentAllowStatus.ALLOWED_AUDITING
							? CommentStatus.AUDITING
							: CommentStatus.PUBLISHED; // ????????????
			commentEntity.setStatus(commentStatus);

			HttpServletRequest request = IPUtils.getRequest();

			String userAgent = request.getHeader("User-Agent");
			// ?????????????????????????????????????????????????????????
			userAgent = Objects.isNull(userAgent) ? "" : userAgent;
			commentEntity.setUserAgent(userAgent);

//			String ipAddress = IPUtils.getIpAddress(request);
//			commentEntity.setIpAddress(IPUtils.ipv4ToInt(ipAddress));

			// ??????HTML?????????????????????
			String content = vo.getContent()
					.replaceAll("<\\/?.+?\\/?>", "")
					.replaceAll("\n", "<br>");
			commentEntity.setContent(content);

		} else {
			commentEntity.setIsAdmin(true);
			commentEntity.setStatus(CommentStatus.PUBLISHED);
		}

		commentMapper.insert(commentEntity);

		return commentEntity.getId();
	}

	@Override
	public IPage<CommentEntity> pageBy(CommentSearchParam param) {
		Page<CommentEntity> page = new Page<>(param.getCurrent(), param.getPageSize());
		Wrapper<CommentEntity> wrapper = getCommonSearchWrapper(param);
		return commentMapper.selectPage(page, wrapper);
	}

	// ??????????????????????????????
	@Override
	public IPage<CommentEntity> pageBy(int blogId, int parentId, BasePageParam param) {
		Page<CommentEntity> page = new Page<>(param.getCurrent(), param.getPageSize());
		Wrapper<CommentEntity> wrapper = Wrappers.lambdaQuery(CommentEntity.class)
				.eq(CommentEntity::getBlogId, blogId)
				// ??????????????????id???0
				.eq(CommentEntity::getParentId, parentId)
				.eq(CommentEntity::getStatus, CommentStatus.PUBLISHED)
				.orderByDesc(CommentEntity::getId);
		return commentMapper.selectPage(page, wrapper);
	}

	@Override
	public IPage<CommentEntity> pageBy(int blogId, BasePageParam param) {
		return pageBy(blogId, 0, param);
	}

	@Override
	public CommentSimpleVO covertToSimpleVO(CommentEntity commentEntity) {
		CommentSimpleVO simpleVO = new CommentSimpleVO().convertFrom(commentEntity);

		// ???????????????
		int count = getCountByParentIdAndStatus(simpleVO.getId(), CommentStatus.PUBLISHED);
		simpleVO.setChildrenCount(count);

		return simpleVO;
	}

	@Override
	public CommentDetailVO covertToDetailVO(CommentEntity commentEntity) {
		CommentDetailVO detailVO = new CommentDetailVO().convertFrom(commentEntity);
		// ?????? ip ????????????
		Integer ipAddress = commentEntity.getIpAddress();
		if (Objects.nonNull(ipAddress)) {
			String ipv4 = IPUtils.intToIpv4(ipAddress);
			detailVO.setIpAddress(ipv4);
		}
		// ???????????????
		int count = getCountByParentIdAndStatus(detailVO.getId(), null);
		detailVO.setChildrenCount(count);

		// ?????????????????????url
		BlogSimpleVO blog = blogService.getSimpleById(commentEntity.getBlogId());
		if (Objects.nonNull(blog)) {
			detailVO.setBlogTitle(blog.getTitle());
			detailVO.setBlogUrl(blog.getUrl());
		}

		return detailVO;
	}

	@Override
	public PageResult<CommentDetailVO> covertToDetailPageResult(IPage<CommentEntity> page) {
		List<CommentEntity> records = page.getRecords();
		List<CommentDetailVO> detailVOList = covertToListDetailVO(records);
		return new PageResult<>(page.getTotal(), detailVOList);
	}

	@Override
	public PageResult<CommentSimpleVO> covertToSimplePageResult(IPage<CommentEntity> page) {
		List<CommentEntity> records = page.getRecords();
		List<CommentSimpleVO> simpleVOList = covertToListSimpleVO(records);
		return new PageResult<>(page.getTotal(), simpleVOList);
	}


	@Override
	public PageResult<CommentSimpleVO> covertToSimplePageResultByRecursively(IPage<CommentEntity> page) {
		List<CommentEntity> commentEntityList = page.getRecords();
		List<CommentSimpleVO> commentVoList = commentEntityList.stream().parallel()
				.map(e -> (CommentSimpleVO) new CommentSimpleVO().convertFrom(e))
				.collect(Collectors.toList());
		return new PageResult<>(page.getTotal(), listSimpleByRecursively(commentVoList));
	}

	@Override
	public List<CommentDetailVO> covertToListDetailVO(List<CommentEntity> commentEntityList) {
		return commentEntityList.stream().parallel()
				.map(this::covertToDetailVO)
				.collect(Collectors.toList());
	}

	@Override
	public List<CommentSimpleVO> covertToListSimpleVO(List<CommentEntity> commentEntityList) {
		return commentEntityList.stream().parallel()
				.map(this::covertToSimpleVO)
				.collect(Collectors.toList());
	}

	// ??????????????????
	private Wrapper<CommentEntity> getCommonSearchWrapper(CommentSearchParam param) {
		String author = param.getAuthor();
		String content = param.getContent();
		String email = param.getEmail();
		String keyword = param.getKeyword();

		Integer blogId = param.getBlogId();
		CommentStatus status = param.getStatus();

		boolean hasKeyword = StringUtils.hasText(keyword);

		return Wrappers.lambdaQuery(CommentEntity.class)
				// like has keyword
				.like(hasKeyword, CommentEntity::getAuthor, keyword)
				.like(hasKeyword, CommentEntity::getContent, keyword)
				.like(hasKeyword, CommentEntity::getEmail, keyword)
				// like has not keyword
				.like(!hasKeyword && StringUtils.hasText(author), CommentEntity::getAuthor, author)
				.like(!hasKeyword && StringUtils.hasText(content), CommentEntity::getContent, content)
				.like(!hasKeyword && StringUtils.hasText(email), CommentEntity::getEmail, email)
				.eq(Objects.nonNull(status), CommentEntity::getStatus, status)
				.eq(Objects.nonNull(blogId), CommentEntity::getBlogId, blogId)
				;
	}

	/**
	 * ?????????????????????????????????
	 */
	private List<CommentSimpleVO> listSimpleByRecursively(List<CommentSimpleVO> voList) {
		// ????????????
		if (CollectionUtils.isEmpty(voList)) {
			return new ArrayList<>();
		}
		voList.stream().parallel().forEach(vo -> {
			// ?????????????????????
			List<CommentEntity> childrenEntityList = commentMapper.selectList(
					Wrappers.lambdaQuery(CommentEntity.class)
							.eq(CommentEntity::getParentId, vo.getId())
							.orderByDesc(CommentEntity::getId)
			);
			List<CommentSimpleVO> childrenVoList = childrenEntityList.stream().parallel()
					.map(e -> (CommentSimpleVO) new CommentSimpleVO().convertFrom(e))
					.collect(Collectors.toList());
			vo.setChildren(listSimpleByRecursively(childrenVoList));
		});
		return voList;
	}
}
