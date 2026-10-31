const chapters = [
  { title: '项目概念与主视觉', caption: '以自驾车宿为场景，提出“让一次停留，成为一段有连接的旅程”的产品概念。', alt: '泊野自驾露营 App 主视觉，包含房车、帐篷及自然治愈、安心过夜、深度社交等概念' },
  { title: '行业研究与设计洞察', caption: '从露营行业公开研究中整理自然体验、陪伴与安全议题。研究数据、统计口径与引用年份按原展板保留。', alt: '中国露营行业桌面研究展板，包含市场、营地偏好、陪伴需求和安全生态议题' },
  { title: '从研究到设计转译', caption: '将研究议题转化为待验证的设计假设：可信车宿地图、自然慢行路线与有边界的同频小团。', alt: '泊野从研究证据到可信车宿地图、自然慢行路线和同频小团的设计转译' },
  { title: '目标用户与需求', caption: '以车宿新手和进阶旅行者的概念画像，梳理可信过夜信息、轻量准备与同行边界等需求。', alt: '泊野两类概念用户画像：车宿新手与进阶旅行者的场景和需求' },
  { title: '用户旅程与设计机会', caption: '围绕两天一夜的情境旅程，整理从萌生向往到延续关系的行为、感受、阻碍与设计机会。', alt: '泊野两天一夜车宿用户旅程图，展示六个阶段与相应设计机会' },
  { title: '核心服务与产品理念', caption: '把体验转化为路线规划、车宿地图、同行匹配、共识清单和旅行手记五项服务概念。', alt: '泊野五项核心服务及自然治愈、可信信息和关系连接的产品理念' },
  { title: '信息架构与主链路', caption: '通过“探索、同行、旅程、我的”组织功能，连接偏好建立、地点发现、行前共识与旅后关系。', alt: '泊野 App 信息架构，包含探索、同行、旅程、我的四个核心入口及主链路' },
  { title: '标志设计与应用', caption: '以帐篷与路径构成品牌标记，展示主标志、App 图标、单色与深色反白版本，以及引导页应用。', alt: '泊野 PARK & WILD 标志设计、品牌含义、图标变体与 App 引导页示例' },
  { title: '设计系统与品牌场景', caption: '以天空蓝和深色文字建立视觉层级，统一图标、字体、组件状态，并延展至自然停留的品牌场景。', alt: '泊野的配色、图标、字体、UI 组件状态与露营品牌场景' },
  { title: '引导、探索与预订流程', layout: 'portrait', caption: '展示偏好引导、探索首页、独处与同行入口，以及从筛选地点、查看条件到确认车宿计划的界面流程。', alt: '泊野 App 的偏好设置、探索首页、路线及同行入口、地点筛选、详情和预订确认界面长图' },
  { title: '个性化行程与车宿地图', layout: 'portrait', caption: '把日期、自然偏好和同行节奏转化为旅程规划，展示慢路线、行程时间轴、共识分工与车宿地图界面概念。', alt: '泊野个性化行程规划、慢路线、同行共识、车宿地图及导航入口的 UI 设计长图' },
]

document.getElementById('chapter-navigation').innerHTML = '<a class="demo-nav-link" href="#interactive-demo">交互演示 ↗</a>' + chapters.map((chapter, index) => `<a href="#chapter-${index + 1}">${String(index + 1).padStart(2, '0')} ${chapter.title}</a>`).join('')

fetch('/assets/visual/boye/manifest.json')
  .then((response) => { if (!response.ok) throw new Error('Image manifest unavailable'); return response.json() })
  .then((assets) => {
    document.getElementById('project-boards').innerHTML = '<a class="demo-nav-link" href="#interactive-demo">交互演示 ↗</a>' + chapters.map((chapter, index) => {
      const asset = assets[index]
      const original = `/assets/visual/boye/page-${index + 1}-original.jpg`
      return `<section class="chapter ${chapter.layout ? `chapter--${chapter.layout}` : ''}" id="chapter-${index + 1}">
        <div class="chapter-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${chapter.title}</h2><a href="${original}" target="_blank" rel="noreferrer">查看高清原图 ↗</a></div>
        <a class="board" href="${original}" target="_blank" rel="noreferrer" aria-label="打开${chapter.title}高清原图"><img src="/assets/visual/boye/page-${index + 1}.jpg" width="${asset.width}" height="${asset.height}" alt="${chapter.alt}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} /></a>
        <p class="caption">${chapter.caption}</p>
      </section>`
    }).join('')
  })
  .catch(() => {
    document.getElementById('project-boards').innerHTML = '<p class="caption" role="alert">图片暂时未能加载，请刷新页面。<a href="/assets/visual/boye/page-1-original.jpg" target="_blank" rel="noreferrer">也可直接查看原图 ↗</a></p>'
  })
