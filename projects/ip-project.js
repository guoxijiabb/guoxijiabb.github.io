const projects = {
  tuerye: {
    name: '兔儿爷', english: 'TUERYE', subtitle: '北京城市文化 IP 设计',
    introduction: '从传统民俗走进当代北京。以兔儿爷为文化原点，将祈福守护的寓意与都市青年生活连接，围绕“守护、行动、连接”，构建角色形象、故事和视觉应用。',
    type: '城市文化 IP 形象设计', keywords: '传统文化 · 都市生活 · 陪伴',
    scope: '角色设定 · 三视图 · 表情包 · 潮玩<br />文创应用 · 展陈场景 · IP 小故事',
    next: 'lulu', nextLabel: '下一个项目：鹭鹭 LULU',
    video: { title: 'IP 故事短片', src: '/assets/visual/tuerye/story.mp4', width: 966, height: 720 },
    chapters: [
      { title: '项目背景与文化定位', caption: '从北京传统文化、都市青年生活与松弛运动精神出发，将兔儿爷转化为当代城市生活中的陪伴者。', alt: '兔儿爷在北京胡同吃炸酱面的场景及项目背景说明' },
      { title: '设计过程与角色形象', caption: '展示角色草图、基础档案、色彩、三视图与不同动作，将高耸兔耳、黄色头套与彩色装饰转化为鲜明的形象特征。', alt: '兔儿爷设计草图、形象介绍、色彩体系、三视图与角色动作' },
      { title: '表情包与潮玩延展', caption: '以日常情绪为线索设计表情包，结合北京地标延展潮玩盲盒，并呈现冰场与胡同中的生活场景。', alt: '兔儿爷十二款表情包、北京地标潮玩及滑冰场景' },
      { title: '文创物料与展陈应用', caption: '将角色应用于帆布包、水杯、徽章、文具、礼袋等文创物料，并延展至线下展示空间。', alt: '兔儿爷帆布包、杯子、徽章、文具等文创产品及粉色展位' },
      { title: 'IP 小故事与场景叙事', caption: '以兔儿爷和胡同伙伴构建角色关系，展示小故事中的配角形象与场景组织。原展板中的二维码完整保留。', alt: '兔儿爷与胡同伙伴的三视图、故事场景流程及原展板二维码' },
    ],
  },
  lulu: {
    name: '鹭鹭', english: 'LULU', subtitle: '社区医院 IP 形象与导视设计',
    introduction: '让健康服务更亲切，让每一次就医都少一点迷茫。以白鹭为原型，将蓝白色彩、听诊器和友好的角色语言融入社区健康服务，延展至表情包、服务物料与医院导视。',
    type: '社区健康服务 IP 形象设计', keywords: '健康 · 亲和 · 清晰 · 陪伴',
    scope: '角色设定 · 三视图 · 表情包<br />志愿物料 · 健康宣传 · 医院导视',
    next: 'tuerye', nextLabel: '另一个项目：兔儿爷',
    chapters: [
      { title: '角色定位与形象设定', caption: '以白鹭为社区健康守护者，通过蓝白色彩、听诊器和亲切的姿态，建立专业且友好的角色识别。', alt: '鹭鹭 LULU 社区医院 IP 介绍、形象档案、色彩及三视图' },
      { title: '表情包与服务物料', caption: '从健康服务的沟通场景出发，延展角色表情包、志愿者马甲、笔记本、便携急救包、水杯和帆布包。', alt: '鹭鹭九款表情包、志愿者服装、笔记本、急救包、杯子及健康服务场景' },
      { title: '健康传播与医院导视', caption: '以“让每一次就医，都少一点迷茫”为核心，将角色融入健康宣传与社区医院导视，覆盖入口标识、人行导向和停车指引。', alt: '鹭鹭健康宣传设计及社区医院入口标识、人行导向牌、停车导视系统' },
    ],
  },
}

const projectId = document.body.dataset.project
const project = projects[projectId]
if (project) {
  const assetRoot = `/assets/visual/${projectId}`
  document.getElementById('project-content').innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">${project.english} / CHARACTER DESIGN / ${project.chapters.length} PAGES${project.video ? ' / 1 FILM' : ''}</p>
        <h1>${project.name}</h1>
        <h2 class="subtitle">${project.subtitle}</h2>
        <p class="lead">${project.introduction}</p>
      </div>
      <dl class="facts">
        <div><dt>项目类型</dt><dd>${project.type}</dd></div>
        <div><dt>设计者</dt><dd>郭喜嘉 / GUO XIJIA</dd></div>
        <div><dt>设计内容</dt><dd>${project.scope}</dd></div>
        <div><dt>关键词</dt><dd>${project.keywords}</dd></div>
      </dl>
    </section>
    <nav class="chapter-nav" aria-label="项目章节">${project.chapters.map((chapter, index) => `<a href="#chapter-${index + 1}">${String(index + 1).padStart(2, '0')} ${chapter.title}</a>`).join('')}${project.video ? `<a href="#story-video">${String(project.chapters.length + 1).padStart(2, '0')} ${project.video.title}</a>` : ''}</nav>
    ${project.chapters.map((chapter, index) => `
      <section class="chapter" id="chapter-${index + 1}">
        <div class="chapter-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${chapter.title}</h2><a href="${assetRoot}/page-${index + 1}-original.jpg" target="_blank" rel="noreferrer">查看高清原图 ↗</a></div>
        <a class="board" href="${assetRoot}/page-${index + 1}-original.jpg" target="_blank" rel="noreferrer" aria-label="打开${chapter.title}高清原图"><img src="${assetRoot}/page-${index + 1}.jpg" alt="${chapter.alt}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} /></a>
        <p class="caption">${chapter.caption}</p>
      </section>`).join('')}
    ${project.video ? `
      <section class="chapter story-video" id="story-video" aria-labelledby="story-video-title">
        <div class="chapter-heading"><span>${String(project.chapters.length + 1).padStart(2, '0')}</span><h2 id="story-video-title">${project.video.title}</h2><a href="${project.video.src}" target="_blank" rel="noopener noreferrer">新窗口播放 ↗</a></div>
        <video class="story-video__player" controls playsinline preload="metadata" width="${project.video.width}" height="${project.video.height}" aria-label="${project.name} IP 故事短片" aria-describedby="story-video-caption">
          <source src="${project.video.src}" type="video/mp4" />
          您的浏览器暂不支持视频播放，可<a href="${project.video.src}" target="_blank" rel="noopener noreferrer">打开视频文件观看</a>。
        </video>
        <p class="caption" id="story-video-caption">点击播放，可暂停、拖动进度或切换全屏观看。</p>
      </section>` : ''}
    <footer class="closing">
      <p>${project.name} ${project.english} / 郭喜嘉作品集</p>
      <div class="footer-links"><a class="return" href="./${project.next}.html">${project.nextLabel} ↗</a><a class="return return--primary" href="/?category=ip#work">返回 IP 形象列表 ↗</a></div>
    </footer>`
}
