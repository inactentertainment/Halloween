/* Keep the approved art menu intact. Each inner route gets its own cropped cinematic vignette. */
(function(){
const scenes={about:['2%','25%'],costumes:['2%','43%'],masks:['98%','43%'],decor:['2%','60%'],party:['98%','60%'],movies:['2%','76%'],music:['98%','76%'],games:['2%','91%'],downloads:['98%','91%'],events:['98%','61%'],recipes:['2%','60%'],books:['2%','76%'],shop:['98%','91%'],privacy:['50%','50%'],terms:['50%','50%'],affiliate:['50%','50%'],history:['50%','50%'],story:['50%','50%']};
function sync(){
const route=location.hash.replace(/^#/,'').split('/')[0]||'home',scene=scenes[route];
document.body.classList.toggle('ht-inner-route',!!scene);if(scene){document.body.style.setProperty('--ht-banner-url','url("./assets/banner-'+(['privacy','terms','affiliate'].includes(route)?'about':route)+'.svg")')}
if(scene){document.body.style.setProperty('--ht-banner-x',scene[0]);document.body.style.setProperty('--ht-banner-y',scene[1])}
}
window.addEventListener('hashchange',sync);document.addEventListener('DOMContentLoaded',sync);sync();
})();