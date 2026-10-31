const chapters = [
  { title: '端午主题主视觉', caption: '以龙舟、粽子与江面场景营造端午氛围，让天猫角色参与节日叙事。', alt: '天猫端午好物季主视觉，天猫角色与粽子乘龙舟，背景为山水与竹叶' },
  { title: '项目介绍与关键词', caption: '以“把日子过成节”为主题，梳理品牌锚点、节日识别、情绪转译和平台承接之间的视觉关系。', alt: '天猫节日开屏系列的项目介绍与关键词提取展板' },
  { title: '六种节日叙事', caption: '围绕端午、七夕、五一、春节、元宵和中秋，组织不同的情绪、文化道具与生活场景。原展板内容按提供版本保留。', alt: '天猫六种节日开屏视觉与节日情绪、文化符号和商品关联的设计分析' },
  { title: '角色、道具与画面元素', caption: '以统一角色为识别核心，通过节日装扮、文化道具、环境与动态细节建立系列差异。', alt: '天猫节日开屏的角色、节日装扮、动态细节、文化道具、环境叙事与商品关联分析' },
  { title: '色彩字体与开屏结构', caption: '固定品牌识别与搜索入口，随节日调整主题色、角色动作与场景，并梳理主视觉层级及延展方式。', alt: '天猫节日系列的配色、字体、开屏布局标注及设计延展规则' },
  { title: '系列开屏完整展示', layout: 'portrait', caption: '完整展示六张竖版开屏设计。点击图片或“查看高清原图”可在新标签页查看细节。', alt: '天猫端午、七夕、五一、中秋、元宵和春节六款完整开屏设计长图' },
]

document.getElementById('chapter-navigation').innerHTML = chapters.map((chapter, index) => `<a href="#chapter-${index + 1}">${String(index + 1).padStart(2, '0')} ${chapter.title}</a>`).join('')

fetch('/assets/visual/tmall-festival/manifest.json')
  .then((response) => { if (!response.ok) throw new Error('Image manifest unavailable'); return response.json() })
  .then((assets) => {
    if (assets.length !== chapters.length) throw new Error('Incomplete image manifest')
    document.getElementById('project-boards').innerHTML = chapters.map((chapter, index) => {
      const asset = assets[index]
      const original = `/assets/visual/tmall-festival/page-${index + 1}-original.jpg`
      return `<section class="chapter ${chapter.layout ? `chapter--${chapter.layout}` : ''}" id="chapter-${index + 1}">
        <div class="chapter-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${chapter.title}</h2><a href="${original}" target="_blank" rel="noreferrer">查看高清原图 ↗</a></div>
        <a class="board" href="${original}" target="_blank" rel="noreferrer" aria-label="打开${chapter.title}高清原图"><img src="/assets/visual/tmall-festival/page-${index + 1}.jpg" width="${asset.width}" height="${asset.height}" alt="${chapter.alt}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} /></a>
        <p class="caption">${chapter.caption}</p>
      </section>`
    }).join('')
  })
  .catch(() => {
    document.getElementById('project-boards').innerHTML = '<p class="caption" role="alert">图片暂时未能加载，请刷新页面。<a href="/assets/visual/tmall-festival/page-1-original.jpg" target="_blank" rel="noreferrer">也可直接查看原图 ↗</a></p>'
  })
