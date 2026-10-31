const chapters = [
  { title: '项目视觉封面', layout: 'poster', caption: '一拍即快乐。以蓝色运动角色和匹克球元素建立 PIPOP 的视觉印象。', alt: 'PIPOP 匹啵运动蓝色鼠角色与匹克球主题海报' },
  { title: '角色形象与运动延展', layout: 'portrait', caption: '展示匹啵的角色介绍、三视图、色彩及匹克球、篮球、跑步、足球等运动形象延展。', alt: '匹啵角色三视图、性格介绍、配色与四种运动形象' },
  { title: '产品机会与品牌定位', caption: '从参与门槛、社交门槛与持续动力出发，提出以匹克球为核心的轻运动社交 App 概念。', alt: 'PIPOP 产品与用户机会分析，以及友好入门、真实连接、轻松成长的品牌定位' },
  { title: '品牌文化与产品场景', caption: '以友好、坚持和分享连接运动体验，将 IP 语言应用于活动推荐、球局邀请与成长反馈。', alt: '匹啵运动品牌文化，以及发现、连接、成长三个产品应用场景' },
  { title: '用户群像分析', caption: '以校园新手、都市上班族与规律球友为概念画像，分析不同参与节奏、约球需求与设计回应。', alt: 'PIPOP 三类概念用户画像，包含行为特征、核心痛点与需求' },
  { title: '核心界面与交互说明', caption: '从开屏进入首页，延展运动日程、勋章成长与个人页面，结合界面标注说明各模块的信息层级与使用流程。', alt: 'PIPOP 开屏、首页、日程、勋章和个人页面的 UI 设计及交互说明长图' },
  { title: '场景 KV 与 H5 活动', caption: '展示场景 KV、四个核心页面与 H5 运动活动长页，将收集、打卡、好友约球和奖励兑换串联为活动体验。', alt: 'PIPOP 场景 KV、核心界面总览，以及包含运动集章、每日任务、好友约球和奖励兑换的 H5 活动设计' },
]

document.getElementById('chapter-navigation').innerHTML = '<a class="demo-nav-link" href="#interactive-demo">交互演示 ↗</a>' + chapters.map((chapter, index) => `<a href="#chapter-${index + 1}">${String(index + 1).padStart(2, '0')} ${chapter.title}</a>`).join('')

document.querySelectorAll('[data-demo-view]').forEach((button) => {
  button.addEventListener('click', () => {
    const wide = button.dataset.demoView === 'wide'
    document.getElementById('demo-layout').classList.toggle('demo-layout--wide', wide)
    document.querySelectorAll('[data-demo-view]').forEach((control) => {
      control.setAttribute('aria-pressed', String(control === button))
    })
  })
})

fetch('/assets/visual/pipop/manifest.json')
  .then((response) => { if (!response.ok) throw new Error('Image manifest unavailable'); return response.json() })
  .then((assets) => {
    document.getElementById('project-boards').innerHTML = chapters.map((chapter, index) => {
      const asset = assets[index]
      const original = `/assets/visual/pipop/page-${index + 1}-original.jpg`
      return `<section class="chapter ${chapter.layout ? `chapter--${chapter.layout}` : ''}" id="chapter-${index + 1}">
        <div class="chapter-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${chapter.title}</h2><a href="${original}" target="_blank" rel="noreferrer">查看高清原图 ↗</a></div>
        <a class="board" href="${original}" target="_blank" rel="noreferrer" aria-label="打开${chapter.title}高清原图"><img src="/assets/visual/pipop/page-${index + 1}.jpg" width="${asset.width}" height="${asset.height}" alt="${chapter.alt}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} /></a>
        <p class="caption">${chapter.caption}</p>
      </section>`
    }).join('')
  })
  .catch(() => {
    document.getElementById('project-boards').innerHTML = '<p class="caption" role="alert">图片暂时未能加载，请刷新页面。<a href="/assets/visual/pipop/page-1-original.jpg" target="_blank" rel="noreferrer">也可直接查看原图 ↗</a></p>'
  })
