/* Local-only design prototype. No requests, authentication, or school integrations. */
const KEY = 'gafa-life-demo:v1'
const screen = document.getElementById('screen')
const tabBar = document.getElementById('tab-bar')
const dialog = document.getElementById('dialog')
const toastElement = document.getElementById('toast')
if (new URLSearchParams(location.search).get('embed') === '1') document.body.classList.add('embedded')

const paths = {
  home: '<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/>',
  message: '<path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/><path d="M8 9h8M8 13h5"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
  printer: '<path d="M6 8V3h12v5M6 18H3V9h18v9h-3M6 14h12v8H6zM17 11h1"/>',
  wrench: '<path d="m14 4 3 3 4-4a6 6 0 0 1-8 8L5 21l-3-3 10-8a6 6 0 0 1 2-6Z"/>',
  box: '<path d="m3 7 9-4 9 4v11l-9 4-9-4ZM3 7l9 5 9-5M12 12v10M7 5l10 5"/>',
  book: '<path d="M12 5C8 2 3 3 3 3v17s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2ZM12 5v17"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 18 6-6 4 4 3-3 5 5"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 3 12 8 15 5-3 13-10 8-15Z"/>',
  star: '<path d="m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
  send: '<path d="m3 10 19-8-7 20-4-9-8-3ZM11 13 22 2"/>',
  check: '<path d="m4 12 5 5L20 5"/>',
  shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6ZM8 12l3 3 5-6"/>',
  flag: '<path d="M5 22V3c5-4 9 4 14 0v12c-5 4-9-4-14 0"/>',
  pencil: '<path d="m4 16 12-12 4 4L8 20l-5 1ZM13 7l4 4"/>',
  camera: '<rect x="2" y="6" width="20" height="15" rx="3"/><circle cx="12" cy="13" r="4"/><path d="m7 6 2-3h6l2 3"/>',
  leaf: '<path d="M20 3C4 2 0 16 8 20S23 14 20 3ZM5 22 16 9"/>',
  bell: '<path d="M5 17h14l-2-4V8A5 5 0 0 0 7 8v5ZM9 21h6"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-7L3 8M3 2v6h6"/>',
  run: '<circle cx="15" cy="4" r="2"/><path d="m4 9 6-2 4 5 5 1M14 12l-4 4 3 6M10 7l-2 6-5 5"/>',
}
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.grid}</svg>`
const goose = () => `<svg class="goose" viewBox="0 0 150 170" aria-hidden="true"><path d="m45 147-8 14h28l-7-15M88 148l8 13h24l-18-17" fill="#eaa24b"/><path d="M106 71c-5-9-17-15-16-33 1-14 18-15 25-8 9 9 5 23-1 32l-3 36c26 17 24 43-1 54-29 13-70 0-75-25-3-15 4-25 16-28-11 1-19-7-20-15 12 7 29 7 41 4l8-24Z" fill="#fffaf0" stroke="#e2d9c8" stroke-width="2"/><path d="M114 38c16 0 23 7 22 11-8 5-17 2-24-3" fill="#eaa24b"/><circle cx="111" cy="33" r="3.5" fill="#292524"/><path d="M86 66c8 5 19 7 28 4l-1 12c-13 3-23-1-28-5Z" fill="#a9343a"/><path d="m92 78-7 31 11-6 3-24" fill="#a9343a"/><path d="M49 111c10 16 24 20 36 14" fill="none" stroke="#e1d7c4" stroke-width="3" stroke-linecap="round"/><path d="m89 104 27 8-5 29-28-7Z" fill="#a9343a"/><path d="m93 104 4-13 17 5-2 14" fill="none" stroke="#a9343a" stroke-width="5"/><path d="m92 119 14 4" stroke="#fff6e7" stroke-width="3" stroke-linecap="round"/><path d="m69 106 12-35 5 2-9 37" fill="#c34d4e"/></svg>`
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const campuses = ['大学城校区', '昌岗校区']
const topics = ['全部', '材料交换', '创作搭子', '制作求助', '校园活动']
const seedPosts = [
  {id:'markers',title:'48色马克笔闲置转让',body:'课程练习后整理出的马克笔，仅试色，附色卡。希望材料能去往下一个创作现场。\n大学城校区，校内自取。此为演示内容，不提供真实交易。',topic:'材料交换',author:'林初',campus:'大学城校区',icon:'pencil',color:'peach',note:'演示标价 ¥28'},
  {id:'paper',title:'灰卡纸边角料，免费分享',body:'模型课剩下的灰卡纸和牛皮纸，适合做结构小样。欢迎同校同学交换材料灵感。\n本条为材料交换场景演示。',topic:'材料交换',author:'小麦',campus:'大学城校区',icon:'book',color:'sage',note:'免费 · 演示'},
  {id:'photo',title:'约拍毕业作品，一起完成记录',body:'寻找对摄影和空间装置感兴趣的同学，一起交流布光、构图和作品记录。\n在这里体验从需求到同校连接的过程。',topic:'创作搭子',author:'陈予',campus:'大学城校区',icon:'camera',color:'rose',note:'寻找搭子'},
  {id:'model',title:'模型结构小问题，想听听你的建议',body:'正在尝试纸板和木条的组合，想和做过模型的同学交流连接方式。欢迎在评论区留下想法。',topic:'制作求助',author:'阿宁',campus:'昌岗校区',icon:'box',color:'peach',note:'交流想法'},
  {id:'exhibition',title:'下课后，和大鹅一起看展',body:'从工作室到展厅，把校园里的灵感收集起来。绘画、材料与设计作品在这里相遇。\n点击收藏展讯，或在演示消息里交流观展想法。',topic:'校园活动',author:'校园发现',campus:'大学城校区',icon:'image',color:'sage',note:'校园展讯 · 演示'},
  {id:'workshop',title:'纸上漫游 · 手作交流工作坊',body:'用纸张、颜色和简单结构做一个小型创作练习。一起聊聊创作过程，而不只是最后的结果。\n此活动为交互场景示例。',topic:'校园活动',author:'创作校园',campus:'昌岗校区',icon:'leaf',color:'peach',note:'创作交流 · 演示'},
]
const defaults = () => ({campus:campuses[0],name:'林初在广美',saved:[],liked:[],followed:[],posts:[],comments:{},bookings:[],messages:[],requests:[]})
let storageAvailable = true
let data = defaults()
const cleanText = (v, max = 300) => typeof v === 'string' ? v.slice(0,max) : ''
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  if (saved?.version === 1) {
    const source = saved.data || {}
    data.campus = campuses.includes(source.campus) ? source.campus : campuses[0]
    data.name = cleanText(source.name,16) || data.name
    for (const k of ['saved','liked','followed']) data[k] = Array.isArray(source[k]) ? source[k].filter(x=>typeof x==='string').slice(0,100) : []
    data.posts = Array.isArray(source.posts) ? source.posts.slice(0,20).filter(p=>p&&typeof p==='object').map(p=>({id:cleanText(p.id,60),title:cleanText(p.title,40),body:cleanText(p.body,300),topic:topics.includes(p.topic)?p.topic:'材料交换',author:cleanText(p.author,16),campus:campuses.includes(p.campus)?p.campus:campuses[0],icon:'pencil',color:'rose',note:'我的发布 · 演示'})) : []
    data.bookings = Array.isArray(source.bookings) ? source.bookings.slice(0,30).filter(b=>b&&typeof b==='object').map(b=>({id:cleanText(b.id,60),room:cleanText(b.room,50),date:cleanText(b.date,10),time:cleanText(b.time,20),campus:cleanText(b.campus,20)})) : []
    data.messages = Array.isArray(source.messages) ? source.messages.slice(-50).filter(m=>m&&typeof m==='object').map(m=>({text:cleanText(m.text),mine:!!m.mine,post:cleanText(m.post,60)})) : []
    data.requests = Array.isArray(source.requests) ? source.requests.slice(0,20).filter(r=>r&&typeof r==='object').map(r=>({title:cleanText(r.title,30),description:cleanText(r.description),id:cleanText(r.id,60)})) : []
    if (source.comments && typeof source.comments === 'object') for (const [id,entries] of Object.entries(source.comments).slice(0,40)) {
      if (/^[a-z0-9-]+$/i.test(id) && Array.isArray(entries)) data.comments[id]=entries.filter(x=>typeof x==='string').map(x=>x.slice(0,140)).slice(-20)
    }
  }
} catch { storageAvailable = false }
function persist() { try { localStorage.setItem(KEY,JSON.stringify({version:1,data})) } catch { storageAvailable=false; toast('浏览器未允许存储，本次操作仅在当前窗口保留') } }
let route = {page:'splash'}
let trail = []
let communityMode = '互助'
let topic = '全部'
let query = ''
let campusOnly = false
let profileTab = '发布'
let draft = {title:'',body:'',topic:'材料交换'}
let toastTimer
const allPosts = () => [...data.posts,...seedPosts]
const findPost = id => allPosts().find(p=>p.id===id)
const button = (label,action,cls='',extra='') => `<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`
function toast(text) { clearTimeout(toastTimer);toastElement.textContent=text;toastElement.classList.add('show');toastTimer=setTimeout(()=>toastElement.classList.remove('show'),2800) }
function go(page,extra={}) { if (route.page!=='splash') trail.push({...route});route={page,...extra};render() }
function back() { route=trail.pop()||{page:'home'};render() }
function topBar() { return `<div class="brand-row">${goose()}<strong>广美鹅伴</strong>${button(`${icon('pin')}${escape(data.campus.replace('校区',''))}${icon('down')}`,'campus','campus-toggle','aria-label="切换校区"')}${button(icon('user'),'nav-profile','icon-button','aria-label="打开我的"')}</div>` }
function subHead(title) { return `<div class="sub-head">${button(icon('back'),'back','icon-button','aria-label="返回上一页"')}<h1 tabindex="-1">${title}</h1><small>交互演示</small></div>` }
function localNote() { return `<p class="local-note">设计演示 · 非真实校园服务${storageAvailable?' · 记录保存在本浏览器':' · 当前窗口临时记录'}</p>` }
const services = [ ['run','跑腿','request-跑腿'],['clock','预约','booking'],['printer','打印','request-打印装订'],['wrench','维修','request-宿舍报修'],['box','材料','materials'],['people','搭子','partners'],['book','闲置','materials'],['image','展览','discover'] ]
function serviceGrid(list = services) { return `<div class="service-grid">${list.map(([i,label,action])=>button(`<span class="service-icon">${icon(i)}</span>${label}`,'service-'+action,'',`aria-label="${label}服务"`)).join('')}</div>` }
function scheduleRows() { return `<button class="schedule-row" data-action="service-course"><time>14:00</time><span><strong>色彩构成</strong><small>教学楼 A · 302 / 课程示例</small></span>${icon('arrow')}</button><button class="schedule-row" data-action="service-booking"><time>16:30</time><span><strong>色装工作室</strong><small>实践交流 / 场地预约演示</small></span>${icon('arrow')}</button>` }
function home() { return `<div class="page">${topBar()}<div class="page-title"><h1 tabindex="-1">首页</h1><small>让灵感，发生在校园</small></div><form class="search" data-form="search">${icon('search')}<input name="query" aria-label="搜索校园内容" placeholder="搜索校园服务、活动、搭子…" maxlength="40"/><button type="submit">搜索</button></form>${button('<img src="/assets/visual/gafa/demo-home-banner.jpg" alt="把日常过成灵感，陪你创作一起成长"/>','service-discover','home-hero','aria-label="开启创意校园日常，查看校园发现"')}<div class="duo">${button(`<strong>互助广场</strong><small>找搭子，一起完成创作</small><span class="arrow-disc">→</span>${icon('pencil')}`,'nav-community','mini-feature')}${button(`<strong>创作校园</strong><small>作品分享与展览交流</small><span class="arrow-disc">→</span>${icon('camera')}`,'service-discover','mini-feature')}</div>${serviceGrid()}<div class="section-title"><h2>今日安排</h2>${button('查看课表 ›','service-course')}</div><div class="card">${scheduleRows()}</div>${button(`${icon('bell')}公告 · 本周校园开放安排（示例）`,'notice','notice')}${button(`${icon('leaf')}草地提醒 · 秋日已到，请注意保暖。`,'weather','notice')}${localNote()}</div>` }
function servicePage() { return `<div class="page">${topBar()}<div class="page-title"><h1 tabindex="-1">校园服务</h1><small>常用服务，一站直达</small></div><div class="lead-card"><span class="eyebrow">YOUR CAMPUS, CONNECTED</span><h2>把时间留给创作。</h2><p>课程、预约与日常办事，清楚地安排在一起。</p></div>${serviceGrid([['calendar','课表','course'],['clock','场地预约','booking'],['printer','打印装订','request-打印装订'],['wrench','宿舍报修','request-宿舍报修'],['box','材料交换','materials'],['people','创作搭子','partners'],['image','校园展讯','discover'],['run','跑腿代取','request-跑腿']])}<div class="section-title"><h2>我的服务记录</h2>${button('查看全部 ›','records')}</div>${recordCards()}${localNote()}</div>` }
function recordCards() { return data.bookings.length||data.requests.length ? `${data.bookings.map(b=>`<div class="card"><div class="row">${icon('calendar')}<strong class="grow">${escape(b.room)}</strong><span class="tag-label">演示预约</span></div><p class="muted">${escape(b.date)} · ${escape(b.time)}<br/>${escape(b.campus)}</p>${button('取消演示预约','cancel-booking','small-button',`data-id="${escape(b.id)}"`)}</div>`).join('')}${data.requests.map(r=>`<div class="card"><h3>${escape(r.title)}</h3><p class="muted">${escape(r.description)}</p><span class="tag-label">本地演示记录 · 未提交学校</span></div>`).join('')}` : `<div class="empty">${icon('calendar')}<p>暂时还没有演示记录<br/>试试预约一个创作空间。</p>${button('去预约场地','service-booking','secondary')}</div>` }
function timetable() { return `<div class="page">${subHead('我的课表')}<div class="lead-card"><span class="eyebrow">CAMPUS SCHEDULE / DEMO</span><h2>给创作留一点空白。</h2><p>以下课程及时间仅为交互场景示例。</p></div><div class="week"><span>一<br/>MON</span><span>二<br/>TUE</span><span class="active">三<br/>WED</span><span>四<br/>THU</span><span>五<br/>FRI</span></div><div class="timetable"><div class="lesson"><time>14:00 — 15:30</time><strong>色彩构成</strong><p>教学楼 A · 302<br/>准备：色卡、马克笔与画纸</p></div><div class="lesson"><time>16:30 — 18:00</time><strong>色装工作室 · 实践交流</strong><p>工作室 B · 201<br/>把想法变成一个材料小样。</p></div></div><div class="section-title"><h2>课后创作</h2></div>${button('预约一个工作空间 →','service-booking','primary')}${localNote()}</div>` }
function booking() { const today=new Date();const date=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;return `<div class="page">${subHead('场地预约')}<div class="lead-card"><span class="eyebrow">SPACE FOR YOUR IDEAS</span><h2>找一个地方，一起创作。</h2><p>选择空间和时间，体验预约与记录流程。</p></div><form data-form="booking"><label class="field">选择空间<select name="room"><option>色装工作室 B201</option><option>摄影工作室 A305</option><option>小组讨论室 C102</option></select></label><label class="field">预约日期<input type="date" name="date" required min="${date}" value="${date}"/></label><label class="field">预约时段<select name="time"><option>09:00 — 11:00</option><option>14:00 — 16:00</option><option>16:30 — 18:00</option></select></label><label class="field">使用说明<input name="reason" maxlength="50" placeholder="例如：小组模型制作" required/></label><div class="form-note">${icon('shield')}当前校区：${escape(data.campus)}。此操作仅保存演示记录，不占用真实场地。</div><p></p><button class="primary" type="submit">确认演示预约 ${icon('arrow')}</button></form>${localNote()}</div>` }
function requestPage() { const kind=route.kind||'打印装订';return `<div class="page">${subHead(escape(kind))}<div class="lead-card"><span class="eyebrow">CAMPUS SERVICE / DEMO</span><h2>${kind==='宿舍报修'?'让小问题，及时被看见。':kind==='跑腿'?'日常小事，一起分担。':'让想法，有纸上的样子。'}</h2><p>填写需求，体验服务登记流程。</p></div><form data-form="request"><label class="field">需求标题<input name="title" required maxlength="30" placeholder="${kind==='宿舍报修'?'例如：台灯无法正常使用':kind==='跑腿'?'例如：校内代取材料':'例如：A3 作品集彩色打印'}"/></label><label class="field">需求说明<textarea name="description" required maxlength="200" placeholder="请输入演示需求，请勿填写真实手机号、学号或住址。"></textarea></label><div class="form-note">${icon('shield')}仅用于本地界面演示，不发送给学校、商家或其他同学。</div><p></p><button class="primary" type="submit">保存演示需求 ${icon('check')}</button></form></div>` }
function postArt(post) { return `<div class="post-art ${escape(post.color)}">${icon(post.icon)}</div>` }
function postCard(post) { return `<button class="post-card" data-action="post" data-id="${escape(post.id)}">${postArt(post)}<div class="post-body"><small>${escape(post.topic)}</small><strong>${escape(post.title)}</strong><p>${escape(post.campus)} · ${escape(post.author)}</p><div class="post-footer"><span>${escape(post.note)}</span><span>${data.saved.includes(post.id)?'★ 已收藏':'↗'}</span></div></div></button>` }
function community() { const matches=allPosts().filter(p=>(communityMode==='发现'?p.topic==='校园活动':true)&&(topic==='全部'||p.topic===topic)&&(!campusOnly||p.campus===data.campus)&&(!query||`${p.title}${p.body}${p.topic}`.includes(query)));return `<div class="page">${topBar()}<div class="page-title"><h1 tabindex="-1">${communityMode==='发现'?'校园发现':'鹅伴互助'}</h1><small>让需求被看见</small>${button(icon('plus'),'publish','icon-button','aria-label="发布新内容"')}</div><form class="search" data-form="search">${icon('search')}<input name="query" aria-label="搜索互助与展讯" value="${escape(query)}" placeholder="找材料、找搭子、找灵感…" maxlength="40"/><button type="submit">搜索</button></form><div class="segment" role="group" aria-label="校园内容类型">${['互助','发现'].map(m=>button(m,'community-mode','',`data-value="${m}" aria-pressed="${m===communityMode}"`)).join('')}</div><div class="chips" role="group" aria-label="话题筛选">${(communityMode==='发现'?['全部','校园活动']:topics).map(t=>button(t,'topic','',`data-value="${t}" aria-pressed="${topic===t}"`)).join('')}${button('仅看本校区','campus-only','',`aria-pressed="${campusOnly}"`)}</div><div class="section-title"><h2>${query?`“${escape(query)}”的结果`:communityMode==='发现'?'值得去看看':'同校需求'}</h2><span class="muted">${matches.length} 条演示内容</span></div>${matches.length?`<div class="post-grid">${matches.map(postCard).join('')}</div>`:`<div class="empty">${icon('search')}<p>还没有匹配的内容<br/>换个关键词或试试全部校区。</p>${button('清除筛选','clear-filter','secondary')}</div>`}${localNote()}</div>` }
function postDetail() { const p=findPost(route.id);if(!p)return `<div class="page">${subHead('内容已移除')}<div class="empty"><p>这条演示内容已不存在。</p>${button('返回互助广场','nav-community','secondary')}</div></div>`;const replies=data.comments[p.id]||[];return `<div class="page">${subHead('帖子详情')}<div class="row" style="margin-bottom:16px"><span class="avatar">${escape(p.author.slice(0,1))}</span><div class="grow"><h3>${escape(p.author)}</h3><p class="muted">${escape(p.campus)} · 演示内容</p></div>${button(data.followed.includes(p.author)?'已关注':'关注','follow','small-button',`data-author="${escape(p.author)}" aria-pressed="${data.followed.includes(p.author)}"`)}</div><div class="detail-art">${postArt(p)}</div><h1 class="detail-title" tabindex="-1">${escape(p.title)}</h1><span class="tag-label">${escape(p.topic)}</span><span class="tag-label"># 校园创作</span><p class="detail-copy">${escape(p.body)}</p><div class="actions">${button(`${icon('heart')}${data.liked.includes(p.id)?'已点赞':'点赞'}`,'like','',`aria-pressed="${data.liked.includes(p.id)}"`)}${button(`${icon('star')}${data.saved.includes(p.id)?'已收藏':'收藏'}`,'save','',`aria-pressed="${data.saved.includes(p.id)}"`)}${button(`${icon('message')}聊一聊`,'contact')}</div><div class="section-title"><h2>同校评论 <span class="muted">${replies.length}</span></h2></div>${replies.length?replies.map(text=>`<div class="reply"><small>${escape(data.name)} · 本地演示</small><p>${escape(text)}</p></div>`).join(''):'<p class="muted">还没有评论，留下你的第一个想法。</p>'}<form class="comment-form" data-form="comment"><input name="comment" aria-label="评论内容" placeholder="友好交流，让创作有回应" maxlength="140" required/><button type="submit">发送</button></form>${localNote()}</div>` }
function publish() { return `<div class="page">${subHead('发布内容')}<div class="lead-card"><span class="eyebrow">SHARE YOUR LIFE, CONNECT YOUR CAMPUS</span><h2>校园日常，一起有回应。</h2><p>分享一个想法，或发出一个创作邀请。</p></div><form data-form="publish"><label class="field">选择话题<select name="topic">${topics.slice(1).map(t=>`<option ${draft.topic===t?'selected':''}>${t}</option>`).join('')}</select></label><label class="field">标题<input name="title" required maxlength="40" value="${escape(draft.title)}" placeholder="例如：寻找一起做模型的搭子"/></label><label class="field">内容<textarea name="body" required maxlength="300" placeholder="描述材料、需求或想分享的校园灵感。">${escape(draft.body)}</textarea><span class="field-hint">最多 300 字；草稿仅在当前演示窗口中暂存。</span></label><p class="muted">${icon('pin')} ${escape(data.campus)} · 同校交流</p><div class="form-note">${icon('shield')}这是本地原型，不会真实发布。请勿输入真实手机号、学号或其他隐私信息。</div><p></p><button type="submit" class="primary">${icon('send')}发布到演示广场</button></form></div>` }
function profile() { const posts=profileTab==='收藏'?allPosts().filter(p=>data.saved.includes(p.id)):data.posts;return `<div class="page">${topBar()}<div class="page-title"><h1 tabindex="-1">我的</h1><small>记录每一份创作与成长</small></div><div class="profile-card"><div class="row"><span class="avatar">${escape(data.name.slice(0,1))}</span><div class="grow"><h2>${escape(data.name)}</h2><p class="muted">视觉传达 · 设计类在校生（示例）</p></div>${button('编辑','edit-profile','small-button')}</div><div class="profile-meta"><span>大三 · 示例</span><span>${escape(data.campus)}</span><span>设计共创</span></div><div class="profile-stats"><div><strong>${data.posts.length}</strong><span>演示发布</span></div><div><strong>${data.saved.length}</strong><span>我的收藏</span></div><div><strong>${data.bookings.length}</strong><span>演示预约</span></div></div></div><div class="notice">${icon('shield')}校园身份展示 · 概念原型，未经真实认证</div>${button(`${icon('calendar')}我的预约与服务记录 ${icon('arrow')}`,'records','list-button')}${button(`${icon('bell')}校园消息 ${icon('arrow')}`,'nav-messages','list-button')}<div class="segment" role="group" aria-label="个人内容">${['发布','收藏'].map(t=>button(t,'profile-tab','',`data-value="${t}" aria-pressed="${profileTab===t}"`)).join('')}</div>${posts.length?`<div class="post-grid">${posts.map(postCard).join('')}</div>`:`<div class="empty">${icon(profileTab==='收藏'?'star':'pencil')}<p>${profileTab==='收藏'?'收藏一条内容，留住校园灵感。':'发布一条演示需求，开始同校连接。'}</p>${button(profileTab==='收藏'?'去发现内容':'发布演示内容',profileTab==='收藏'?'nav-community':'publish','secondary')}</div>`}<div class="section-title"><h2>演示设置</h2></div>${button(`${icon('reset')}清空本地演示记录 ${icon('arrow')}`,'reset','list-button danger')}${localNote()}</div>` }
function messages() { const ids=[...new Set(data.messages.map(m=>m.post))];return `<div class="page">${topBar()}<div class="page-title"><h1 tabindex="-1">消息</h1><small>让每一份回应，都被看见</small></div><div class="form-note">${icon('shield')}消息仅作本地流程演示，不会发送给其他用户。</div><button class="message-card" data-action="notice"><span class="avatar">${icon('bell')}</span><div><strong>校园服务通知</strong><p>${data.bookings.length?`你有 ${data.bookings.length} 条演示预约记录`:'欢迎来到广美鹅伴交互演示'}</p></div><small>演示</small></button>${ids.map(id=>{const p=findPost(id),last=data.messages.filter(m=>m.post===id).at(-1);return p?`<button class="message-card" data-action="chat" data-id="${escape(id)}"><span class="avatar sage">${escape(p.author.slice(0,1))}</span><div><strong>${escape(p.author)}</strong><p>${escape(last.text)}</p></div><small>本地</small></button>`:''}).join('')}${!ids.length?`<div class="empty" style="margin-top:20px">${icon('message')}<p>还没有演示会话<br/>打开感兴趣的帖子，试试“聊一聊”。</p>${button('去互助广场','nav-community','secondary')}</div>`:''}${localNote()}</div>` }
function chat() { const p=findPost(route.id);if(!p)return messages();const thread=data.messages.filter(m=>m.post===p.id);return `<div class="page">${subHead(escape(p.author))}<div class="form-note">${icon('shield')}模拟会话，不会真实发送。请勿输入隐私信息。</div><div class="card" style="margin-top:14px"><span class="muted">正在交流</span><h3>${escape(p.title)}</h3></div><div class="chat-feed">${thread.length?thread.map(m=>`<div class="bubble ${m.mine?'mine':''}">${escape(m.text)}</div>`).join(''):'<div class="bubble">你好！可以在这里体验校园内容的沟通流程。此为模拟会话。</div>'}</div><form class="comment-form" data-form="chat"><input name="message" required maxlength="200" aria-label="演示消息" placeholder="输入一条演示消息…"/><button type="submit">发送</button></form></div>` }
const views={splash:()=>`<section class="splash"><div class="splash-brand">${goose()}<span>GAFA CAMPUS LIFE</span></div><span class="eyebrow" style="margin-top:16px">FOR THE CREATIVE EVERYDAY</span><h1 tabindex="-1">广美<em>鹅伴</em></h1><p class="muted">陪你走过每一个广美时光。<br/>生活、学习与创作，一站连接。</p><div class="splash-art">${goose()}<span class="art-chip chip-left">${icon('calendar')}今天也有好灵感</span><span class="art-chip chip-right">${icon('pencil')}找搭子，一起创作</span></div><button type="button" class="primary" data-action="start">开启校园日常 ${icon('arrow')}</button>${localNote()}</section>`,home,services:servicePage,community,post:postDetail,publish,profile,messages,chat,timetable,booking,request:requestPage,records:()=>`<div class="page">${subHead('我的预约与服务记录')}${recordCards()}${localNote()}</div>`}
function render(focus=true) {
  screen.innerHTML=(views[route.page]||home)()
  const current=['timetable','booking','request','records'].includes(route.page)?'services':['post','publish','community'].includes(route.page)?'community':route.page==='chat'?'messages':route.page
  tabBar.hidden=route.page==='splash'
  tabBar.innerHTML=[['home','首页','home'],['services','服务','grid'],['community','互助','people'],['messages','消息','message'],['profile','我的','user']].map(([p,label,i])=>button(`${icon(i)}${label}`,'nav-'+p,'',`aria-current="${p===current?'page':'false'}"`)).join('')
  if(focus){screen.scrollTop=0;screen.querySelector('h1')?.focus({preventScroll:true})}
}
function openDialog(title,content) { dialog.innerHTML=`<h2 id="dialog-title">${title}</h2>${content}`;dialog.showModal() }
function closeDialog() { dialog.close() }
function toggle(key,value) { data[key]=data[key].includes(value)?data[key].filter(v=>v!==value):[...data[key],value];persist();const top=screen.scrollTop;render(false);screen.scrollTop=top }
document.addEventListener('click',(event)=>{
  const control=event.target.closest('[data-action]');if(!control)return
  const action=control.dataset.action
  if(action==='start'){trail=[];route={page:'home'};render();return}
  if(action.startsWith('nav-')){trail=[];route={page:action.slice(4)};if(route.page==='community'){query='';topic='全部';communityMode='互助'}render();return}
  if(action==='back'){back();return}
  if(action==='close-dialog'){closeDialog();return}
  if(action==='campus'){openDialog('选择校区',`<p>切换首页与发布的校区。互助中可使用“仅看本校区”筛选。</p>${campuses.map(c=>button(c,'choose-campus','campus-option',`data-value="${c}" aria-pressed="${data.campus===c}"`)).join('')}<div class="dialog-actions">${button('关闭','close-dialog','secondary')}</div>`);return}
  if(action==='choose-campus'){data.campus=control.dataset.value;persist();closeDialog();render(false);toast('已切换至'+data.campus);return}
  if(action.startsWith('service-')){const type=action.slice(8);if(type==='course')go('timetable');else if(type==='booking')go('booking');else if(type.startsWith('request-'))go('request',{kind:type.slice(8)});else {topic=type==='materials'?'材料交换':type==='partners'?'创作搭子':'全部';communityMode=type==='discover'?'发现':'互助';query='';go('community')}return}
  if(action==='records'){go('records');return}
  if(action==='cancel-booking'){data.bookings=data.bookings.filter(b=>b.id!==control.dataset.id);persist();render(false);toast('演示预约已取消');return}
  if(action==='community-mode'){communityMode=control.dataset.value;topic='全部';query='';render(false);return}
  if(action==='topic'){topic=control.dataset.value;render(false);return}
  if(action==='campus-only'){campusOnly=!campusOnly;render(false);return}
  if(action==='clear-filter'){query='';topic='全部';campusOnly=false;render(false);return}
  if(action==='post'){go('post',{id:control.dataset.id});return}
  if(action==='publish'){go('publish');return}
  if(action==='like'||action==='save'){toggle(action==='like'?'liked':'saved',route.id);return}
  if(action==='follow'){toggle('followed',control.dataset.author);return}
  if(action==='contact'){go('chat',{id:route.id});return}
  if(action==='chat'){go('chat',{id:control.dataset.id});return}
  if(action==='profile-tab'){profileTab=control.dataset.value;render(false);return}
  if(action==='edit-profile'){openDialog('编辑演示昵称',`<form data-form="profile"><label class="field">昵称<input name="name" required maxlength="16" value="${escape(data.name)}"/></label><p>仅更改本地演示昵称，不进行真实校园身份认证。</p><div class="dialog-actions">${button('取消','close-dialog','secondary')}<button class="primary" type="submit">保存昵称</button></div></form>`);return}
  if(action==='reset'){openDialog('清空演示记录？',`<p>将清空此浏览器中的鹅伴演示发布、收藏、评论、消息和预约，并恢复默认校区与昵称。不会影响作品集、原图或其他网站。</p><div class="dialog-actions">${button('保留记录','close-dialog','secondary')}${button('确认清空','confirm-reset','primary')}</div>`);return}
  if(action==='confirm-reset'){data=defaults();draft={title:'',body:'',topic:'材料交换'};query='';topic='全部';communityMode='互助';campusOnly=false;profileTab='发布';persist();closeDialog();trail=[];route={page:'home'};render();toast('本地演示记录已清空');return}
  if(action==='notice'){openDialog('校园公告 · 演示',`<p>欢迎探索广美鹅伴。你可以查看课表、预约创作空间、寻找材料与搭子，也可以发布一条演示内容。</p><p>公告内容为设计示例，不代表学校实际通知。</p><div class="dialog-actions">${button('我知道了','close-dialog','primary')}</div>`);return}
  if(action==='weather'){toast('秋日创作也别忘了照顾自己。本条为提醒样式演示。')}
})
document.addEventListener('input',event=>{
  if(event.target.form?.dataset.form==='publish')draft={title:event.target.form.elements.title.value,body:event.target.form.elements.body.value,topic:event.target.form.elements.topic.value}
})
document.addEventListener('change',event=>{
  if(event.target.form?.dataset.form==='publish')draft.topic=event.target.form.elements.topic.value
})
document.addEventListener('submit',event=>{
  const form=event.target;if(!form.dataset.form)return;event.preventDefault()
  const values=Object.fromEntries(new FormData(form));const kind=form.dataset.form
  if(kind==='search'){query=String(values.query||'').trim();topic='全部';communityMode='互助';if(route.page==='community')render(false);else go('community');return}
  if(kind==='booking'){
    if(!values.reason.trim()){form.elements.reason.setCustomValidity('请填写使用说明');form.elements.reason.reportValidity();form.elements.reason.addEventListener('input',()=>form.elements.reason.setCustomValidity(''),{once:true});return}
    if(data.bookings.some(b=>b.room===values.room&&b.date===values.date&&b.time===values.time&&b.campus===data.campus)){toast('这个时段已在你的演示记录中，请换个时间');return}
    if(data.bookings.length>=30){toast('演示预约已达上限，请先取消旧记录');return}
    data.bookings.unshift({id:'booking-'+Date.now(),room:values.room,date:values.date,time:values.time,campus:data.campus});persist();go('records');toast('演示预约已保存，不占用真实场地');return
  }
  if(kind==='request'){
    if(!values.title.trim()||!values.description.trim()){toast('请填写有效的标题和需求说明');return}
    data.requests.unshift({id:'request-'+Date.now(),title:`${route.kind} · ${values.title.trim()}`,description:values.description.trim()});data.requests=data.requests.slice(0,20);persist();go('records');toast('已保存演示需求，未发送给学校');return
  }
  if(kind==='publish'){
    if(!values.title.trim()||!values.body.trim()){toast('请填写有效的标题和内容');return}
    if(data.posts.length>=20){toast('演示发布最多保留 20 条，可在“我的”清空记录后重试');return}
    const id='post-'+Date.now();data.posts.unshift({id,title:values.title.trim(),body:values.body.trim(),topic:values.topic,author:data.name,campus:data.campus,icon:'pencil',color:'rose',note:'我的发布 · 演示'});persist();draft={title:'',body:'',topic:'材料交换'};profileTab='发布';go('post',{id});toast('已发布到本地演示广场');return
  }
  if(kind==='comment'){
    const comment=values.comment.trim();if(!comment){toast('请输入评论内容');return}
    data.comments[route.id]=[...(data.comments[route.id]||[]),comment].slice(-20);persist();const top=screen.scrollTop;render(false);screen.scrollTop=top;toast('评论已保存，仅在本地可见');return
  }
  if(kind==='chat'){
    const text=values.message.trim();if(!text){toast('请输入演示消息');return}
    data.messages.push({text,mine:true,post:route.id},{text:'收到你的演示消息啦！这里是模拟回应，可以继续返回帖子或探索其他校园内容。',mine:false,post:route.id});data.messages=data.messages.slice(-50);persist();render(false);screen.scrollTop=screen.scrollHeight;return
  }
  if(kind==='profile'){const name=values.name.trim();if(!name){toast('请填写昵称');return}data.name=name;persist();closeDialog();render(false);toast('演示昵称已更新')}
})
render(false)
