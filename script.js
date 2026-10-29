function detectPlatform(u){
  u=(u||'').toLowerCase();
  if(u.includes('tiktok.com')||u.includes('vt.tiktok.com')) return 'tiktok';
  if(u.includes('youtube.com')||u.includes('youtu.be')) return 'youtube';
  if(u.includes('instagram.com')) return 'instagram';
  if(u.includes('facebook.com')||u.includes('fb.watch')) return 'facebook';
  if(u.includes('linkedin.com')) return 'linkedin';
  if(u.includes('twitter.com')||u.includes('x.com')) return 'x';
  if(u.includes('pinterest.com')||u.includes('pin.it')) return 'pinterest';
  return 'unknown';
}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]})}
function sendContact(e){
  e.preventDefault();
  var name=document.getElementById('cName').value, email=document.getElementById('cEmail').value, msg=document.getElementById('cMsg').value;
  var subject=encodeURIComponent('VideoSave contact from '+name);
  var body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\n'+msg);
  window.location.href='mailto:muhammadsanwal3620@gmail.com?subject='+subject+'&body='+body;
  document.getElementById('cNote').textContent='Opening your email app to send the message…';
}
document.querySelectorAll('#tabs button').forEach(function(b){
  b.onclick=function(){
    document.querySelectorAll('#tabs button').forEach(function(x){x.classList.remove('active')});
    b.classList.add('active');
    var p=b.dataset.p;
    var ex={tiktok:'https://www.tiktok.com/@username/video/1234567890',youtube:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',instagram:'https://www.instagram.com/reel/xxxxxxxx/',facebook:'https://www.facebook.com/reel/xxxxxxxx/',linkedin:'https://www.linkedin.com/posts/xxxxxxxx',x:'https://x.com/username/status/1234567890',pinterest:'https://www.pinterest.com/pin/1234567890/'};
    if(ex[p]) document.getElementById('urlInput').placeholder='Example: '+ex[p];
  };
});
async function handleDownload(){
  var url=document.getElementById('urlInput').value.trim();
  var status=document.getElementById('status');
  var result=document.getElementById('result');
  var btn=document.getElementById('goBtn');
  if(!url){status.className='status err';status.textContent='Please paste a link first.';return;}
  var platform=detectPlatform(url);
  if(platform==='unknown'){status.className='status err';status.textContent='Could not detect a supported platform from that link. Try a TikTok, YouTube, Instagram, Facebook, LinkedIn, X or Pinterest link.';return;}
  status.className='status ok';status.textContent='Checking '+platform+'…';btn.disabled=true;result.style.display='none';
  try{
    if(platform==='tiktok'){
      var res=await fetch('https://www.tikwm.com/api/?url='+encodeURIComponent(url));
      var data=await res.json();
      if(data.code!==0) throw new Error(data.msg||'TikTok lookup failed');
      var d=data.data||{}, a=d.author||{};
      status.textContent='Found it ✓';
      result.innerHTML='<div class="card">'
        +(d.cover?'<img class="thumb" src="'+esc(d.cover)+'" alt="Cover">':'')
        +'<div class="info"><span class="badge">TikTok</span><h2 style="margin:10px 0 6px">'+esc(d.title||'TikTok video')+'</h2>'
        +'<p style="color:#4b5563;margin:0">@'+esc(a.unique_id||'')+' • '+(a.nickname?esc(a.nickname):'')+(d.duration?' • '+esc(d.duration)+' sec':'')+'</p>'
        +'<div class="dl">'
        +(d.play?'<a class="green" href="'+esc(d.play)+'" target="_blank" rel="noopener">Download No Watermark HD ↓</a>':'')
        +(d.wmplay?'<a href="'+esc(d.wmplay)+'" target="_blank" rel="noopener">With Watermark</a>':'')
        +(d.music?'<a class="outline" href="'+esc(d.music)+'" target="_blank" rel="noopener">Audio MP3</a>':'')
        +(d.cover?'<a class="outline" href="'+esc(d.cover)+'" target="_blank" rel="noopener">Cover Image</a>':'')
        +'</div><p style="font-size:13px;color:#6b7280">If the video opens in a player instead of downloading, tap ⋮ in the player and choose Download, or long-press and Save video.</p></div></div>';
      result.style.display='block';
    } else if(platform==='youtube'){
      var o=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent(url)+'&format=json').then(function(r){return r.json()});
      var vid=''; var m=url.match(/[?&]v=([^&]+)/); if(m) vid=m[1]; else {var s=url.match(/youtu\.be\/([^?&]+)/); if(s) vid=s[1];}
      status.textContent='Found it ✓';
      result.innerHTML='<div class="card">'
        +(o.thumbnail_url?'<img class="thumb" src="'+esc(o.thumbnail_url)+'" alt="Thumbnail">':'')
        +'<div class="info"><span class="badge">YouTube</span><h2 style="margin:10px 0 6px">'+esc(o.title||'YouTube video')+'</h2>'
        +'<p style="color:#4b5563;margin:0">'+esc(o.author_name||'')+'</p>'
        +(vid?'<div style="margin-top:12px"><iframe width="100%" height="220" style="border:0;border-radius:12px" src="https://www.youtube.com/embed/'+esc(vid)+'" allowfullscreen></iframe></div>':'')
        +'<div class="dl"><a href="'+esc(url)+'" target="_blank" rel="noopener">Watch on YouTube ↗</a></div>'
        +'<p style="font-size:13px;color:#6b7280">No direct MP4 here — YouTube has no public download API. For your own video, download it from YouTube Studio.</p></div></div>';
      result.style.display='block';
    } else {
      status.textContent='Platform detected: '+platform+' ✓';
      var label={instagram:'Instagram',facebook:'Facebook',linkedin:'LinkedIn',x:'X / Twitter',pinterest:'Pinterest'}[platform]||platform;
      result.innerHTML='<div class="card"><div class="info"><span class="badge">'+esc(label)+'</span><h2 style="margin:10px 0 6px">'+esc(label)+' link detected</h2>'
        +'<p style="color:#4b5563">This platform does not offer a public no-login direct download like TikTok. Open the original post, and for your own post use that app\'s own download / export option. No login is asked here, and private posts are not supported.</p>'
        +'<div class="dl"><a href="'+esc(url)+'" target="_blank" rel="noopener">Open original post ↗</a></div></div></div>';
      result.style.display='block';
    }
  }catch(e){
    status.className='status err';status.textContent='Sorry, that link could not be checked: '+e.message+'. Check the link is public and try again.';
  }
  btn.disabled=false;
}
document.getElementById('urlInput').addEventListener('keydown',function(e){if(e.key==='Enter') handleDownload();});
