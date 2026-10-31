const chapters = [
  { title: '清晨阅读主视觉', caption: '以晨光、音乐与阅读构成松弛的居家场景，呈现“把清晨调成喜欢的频道”的视觉主题。', alt: '天猫角色戴耳机坐在秋日居家客厅中阅读，搭配咖啡、吐司与暖色晨光的主视觉' },
  { title: '系列主题与设计思路', caption: '以“把理想生活过成秋天”为系列主题，围绕三个生活时刻探索情景叙事与品牌符号化表达。', alt: '天猫秋日理想生活系列 KV 的主题与整体设计思路' },
  { title: '项目介绍与开屏应用', caption: '梳理清晨阅读、黄昏野餐与夜晚露营的情境，并展示主视觉向手机开屏的应用方式。', alt: '天猫秋日理想生活项目背景、三种场景及清晨阅读手机开屏效果展示' },
  { title: '关键词与场景转译', caption: '从品牌语境、用户洞察和场景梳理出发，将秋日生活情绪转化为角色、道具与视觉叙事。', alt: '秋日理想生活的品牌关键词、角色识别、传播延展与清晨黄昏夜晚三种场景分析' },
  { title: '画面元素与传播延展', caption: '通过统一的毛绒角色与生活道具连接三种场景，延展分享弹窗和领券弹窗的视觉应用。', alt: '天猫角色、听歌阅读、咖啡织物、秋日穿搭、野餐和露营元素拆解及分享领券应用' },
  { title: '清晨 KV 与手机开屏', caption: '完整展示清晨阅读场景的横版主视觉与竖版开屏适配。', alt: '把清晨调成喜欢的频道：天猫秋日居家阅读横版 KV 与手机开屏应用' },
  { title: '秋夜 KV 与手机开屏', caption: '以湖畔、星空、帐篷和暖光构成秋夜露营场景，展示“把夜晚过成星光假期”的主视觉及开屏应用。', alt: '把夜晚过成星光假期：天猫角色在湖畔帐篷旁烧烤露营的横版 KV 与手机开屏应用' },
]

document.getElementById('chapter-navigation').innerHTML = chapters.map((chapter, index) => `<a href="#chapter-${index + 1}">${String(index + 1).padStart(2, '0')} ${chapter.title}</a>`).join('')

fetch('/assets/visual/tmall-autumn/manifest.json')
  .then((response) => { if (!response.ok) throw new Error('Image manifest unavailable'); return response.json() })
  .then((assets) => {
    if (assets.length !== chapters.length) throw new Error('Incomplete image manifest')
    document.getElementById('project-boards').innerHTML = chapters.map((chapter, index) => {
      const asset = assets[index]
      const original = `/assets/visual/tmall-autumn/page-${index + 1}-original.jpg`
      return `<section class="chapter" id="chapter-${index + 1}">
        <div class="chapter-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${chapter.title}</h2><a href="${original}" target="_blank" rel="noreferrer">查看高清原图 ↗</a></div>
        <a class="board" href="${original}" target="_blank" rel="noreferrer" aria-label="打开${chapter.title}高清原图"><img src="/assets/visual/tmall-autumn/page-${index + 1}.jpg" width="${asset.width}" height="${asset.height}" alt="${chapter.alt}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'} /></a>
        <p class="caption">${chapter.caption}</p>
      </section>`
    }).join('')
  })
  .catch(() => {
    document.getElementById('project-boards').innerHTML = '<p class="caption" role="alert">图片暂时未能加载，请刷新页面。<a href="/assets/visual/tmall-autumn/page-1-original.jpg" target="_blank" rel="noreferrer">也可直接查看原图 ↗</a></p>'
  })
