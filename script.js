const userData = {};

const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlayText');

if(startBtn){
  startBtn.addEventListener('click',()=>{
    document.getElementById('step1').scrollIntoView({behavior:'smooth'});
  });
}

function showOverlay(message, callback){
  overlayText.innerHTML = message;
  overlay.classList.add('show');
  setTimeout(()=>{
    overlay.classList.remove('show');
    if(callback) setTimeout(callback,300);
  },1800);
}

document.querySelectorAll('#step1 .option-card').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#step1 .option-card').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    userData.step1 = btn.dataset.value;
    showOverlay(
      '新しいことへの向き合い方には、<br>人それぞれのパターンがあります。',
      ()=>{
        document.getElementById('interlude1').scrollIntoView({behavior:'smooth'});
      }
    );
  });
});

document.querySelectorAll('#step2 .option-card').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('#step2 .option-card').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    userData.step2 = btn.dataset.value;
    showOverlay('想いは、誰かに届いたときに初めて価値になることがあります。');
  });
});

window.userData = userData;
console.log('想える人。 loaded');
