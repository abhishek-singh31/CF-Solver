const btn=document.querySelector('button');
const tags=document.querySelectorAll('#tags');
const rating=document.querySelectorAll('#rating');
const hour=document.querySelector('#hour');
const minute=document.querySelector('#minute');
const second=document.querySelector('#second');

let URL='https://codeforces.com/api/problemset.problems';
let defaultURL='https://codeforces.com/api/problemset.problems';
btn.addEventListener('click',(e)=>{
    e.preventDefault();
    URL=defaultURL;
    let selectedTags=[];
    let selectedRating=[];
    for(let r of rating){
        if(r.checked==true){
            selectedRating.push(+r.name);
        }
    }
    for(let t of tags){
        if(t.checked==true){
            selectedTags.push(t.name);
        }
    }
    if(selectedTags.length){
        URL+='?tags=';
        for(let t of selectedTags)
            URL+=`${t};`;
    }
    fetch(URL)
    .then((response) => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error();
        }
    })
    .then((data)=>{
        const problems=data['result']['problems'];
        const selectedProblems=[];
        for(const problem of problems){
            if(problem.hasOwnProperty('rating')){
                if(selectedRating.length==0 || selectedRating.includes(problem['rating'])){
                    selectedProblems.push(problem);
                }
            }
        }
        if(selectedProblems.length==0){
            throw new Error();
        }
        let x=Math.floor(Math.random()*selectedProblems.length);
        let problemURL=`https://www.codeforces.com/contest/${selectedProblems[x]['contestId']}/problem/${selectedProblems[x]['index']}`;
        openProblem(problemURL);
        let totalTime=(+hour.value*3600)+(+minute.value*60) + (+second.value);
        console.log(totalTime);
        if(totalTime>0){
            setTimeout(() => {
                let sound=new Audio('audio/audio1.mp3');
                sound.play();
            },totalTime*1000);
        }
    })
    .catch(err=>{
        alert("No problems found with selected tags/ratings !");
    })
})

function openProblem(URL){
    window.open(URL,'_blank');
}

function fancyTimeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
