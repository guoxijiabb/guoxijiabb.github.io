(() => {
 let dialog, content, opener, loaded=false, loading=false, savedOverflow='';
 const make=(tag, cls, text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 function notify(open){document.dispatchEvent(new CustomEvent('cinema-workflow-change',{detail:open}));}
 function setup(){
  dialog=make('dialog');dialog.id='reincarnation-workflow';dialog.setAttribute('aria-labelledby','workflow-title');
  const header=make('header','workflow-header'), titles=make('div'),title=make('h2','','轮回千年 / 工作流');title.id='workflow-title';
  titles.append(title,make('p','','角色库 · 7组角色设定'));const close=make('button','workflow-close','关闭 ×');close.type='button';close.onclick=()=>dialog.close();
  header.append(titles,close);content=make('div','workflow-content');dialog.append(header,content);document.body.append(dialog);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.documentElement.style.overflow=savedOverflow;notify(false);opener?.focus();});
 }
 async function populate(){
  if(loaded||loading)return;loading=true;content.replaceChildren(make('p','','正在载入角色库…'));
  try{
   const response=await fetch('/assets/ai-video/reincarnation-characters/catalog.json');if(!response.ok)throw Error('load');const items=await response.json();
   const fragment=document.createDocumentFragment();fragment.append(make('p','workflow-intro','角色形象设定：集中展示面部特征、服装、道具及正面、侧面与背面视图。点击图片可查看原图。'));
   items.forEach((item,i)=>{const figure=make('figure','workflow-sheet'),caption=make('figcaption');caption.append(make('span','',String(i+1).padStart(2,'0')),document.createTextNode(item.title));
    const link=make('a');link.href=item.original;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label',item.title+'，查看原图（新窗口）');const img=make('img');img.src=item.src;img.alt=item.title;img.width=item.width;img.height=item.height;img.loading=i?'lazy':'eager';img.decoding='async';link.append(img);figure.append(caption,link);fragment.append(figure);});
   content.replaceChildren(fragment);loaded=true;
  }catch(e){const retry=make('button','cinema-workflow','重新载入');retry.type='button';retry.onclick=populate;content.replaceChildren(make('p','workflow-error','角色库暂时未能载入，请重试。'),retry);}finally{loading=false;}
 }
 document.addEventListener('click',e=>{const button=e.target.closest('.cinema-workflow');if(!button||button.closest('#reincarnation-workflow'))return;if(!dialog)setup();opener=button;savedOverflow=document.documentElement.style.overflow;dialog.showModal();document.documentElement.style.overflow='hidden';dialog.scrollTop=0;notify(true);populate();});
})();
