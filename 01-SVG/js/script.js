
function domForEach(selector, callback) {
    document.querySelectorAll(selector).forEach(callback);
}
function domOn(selector, event, callback) {
    domForEach(selector, ele => ele.addEventListener(event, callback));
}

domOn('#rect', 'click', evt => {
    let rect = document.getElementById('rect');
    if(rect.getAttribute('fill') == 'transparent'){
    rect.setAttribute('fill', 'blue');
    } else {
      rect.setAttribute('fill', 'transparent');
    }
  });

  domOn('#donut', 'mouseover', evt => {
    let donut = document.querySelector('#donut');
       let rayon = donut.getAttribute('r');
        if(rayon == 60){
            donut.setAttribute('r', rayon*2);
        } else {
            console.log('oui');
            donut.setAttribute('r', rayon/2);
        }
    });

 
