const solve=document.querySelector('#solve');
const tags=document.querySelectorAll('#tags');
const rating=document.querySelectorAll('#rating');
const hour=document.querySelector('#hour');
const minute=document.querySelector('#minute');
const second=document.querySelector('#second');
const login=document.querySelector('#login');
const userName=document.querySelector('#uname');
const container=document.querySelector('.container');
const login_section=document.querySelector('.login-section');
const modal=document.querySelector('.modal');
const footer=document.querySelector('.footer');
const timeLeft=document.querySelector('.time-left');
const overlay=document.querySelector('.overlay');
const done=document.querySelector('#done');
const giveup=document.querySelector('#giveup');
const current=document.querySelector('.current');
const high=document.querySelector('.high');
const timeup=document.querySelector('.timeup');
const success=document.querySelector('.success');
const failure=document.querySelector('.failure');
const gaveup=document.querySelector('.gaveup');
let totalTime;
login.addEventListener('click',(e)=>{
    e.preventDefault();
    let userHandle='https://codeforces.com/api/user.info?handles=';
    userHandle+=`${userName.value}`;
    fetch(userHandle)
    .then((response) => {
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error();
        }
    })
    .then((data)=>{
//         console.log(data);
        login_section.style.display='none';
        footer.classList.remove('before');
        container.style.display='flex';
    })
    .catch(err=>{
        alert("Please enter correct username !");
    })
})

let myInterval;
let selectedRating;
let selectedTags;
let selectedProblems;
let x;
solve.addEventListener('click',(e)=>{
    e.preventDefault();
    let URL='https://codeforces.com/api/problemset.problems';
    selectedTags=[];
    selectedRating=[];
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
//     console.log(userName.value)
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
        selectedProblems=[];
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
        x=Math.floor(Math.random()*selectedProblems.length);
        let problemURL=`https://www.codeforces.com/contest/${selectedProblems[x]['contestId']}/problem/${selectedProblems[x]['index']}`;
        totalTime=(+hour.value*3600)+(+minute.value*60) + (+second.value);
//         console.log(totalTime);
        if(totalTime==0 || isNaN(totalTime)){
            alert('Please enter valid time !');
        }
        else{
            modal.style.display='grid';
            container.style.display='none';
            footer.classList.add('before');
            overlay.style.display='block';
            myInterval=setInterval(()=>{
                timeLeft.innerHTML=fancyTimeFormat(totalTime);
                totalTime--;
                if(totalTime==0){
                    check(selectedProblems,x,totalTime);
                    clearInterval(myInterval);
                    reset();
                }
            },1000);
            openProblem(problemURL);
        }
    })
    .catch(err=>{
        alert("No problems found with selected tags/ratings !");
    })
})


done.addEventListener('click',(e)=>{
    e.preventDefault();
    let previousScore=+current.innerHTML;
    check(selectedProblems,x,totalTime);
})
giveup.addEventListener('click',(e)=>{
    e.preventDefault();
    gaveup.classList.add('active');
    setTimeout(()=>{
        gaveup.classList.remove('active');
    },2000);
    reset();
    totalTime=0;
})

function check(selectedProblems,x){
    let URL=`https://codeforces.com/api/user.status?handle=${userName.value}&from=1&count=1`;
//     console.log(URL);
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
        let userContestId=data['result'][0]['problem']['contestId'];
        let userIndex=data['result'][0]['problem']['index'];
        let solvedContestId=selectedProblems[x]['contestId'];
        let solvedIndex=selectedProblems[x]['index'];
        let verdict=data['result'][0]['verdict'];
        if(userContestId==solvedContestId && userIndex==solvedIndex && verdict==="OK"){
//             console.log("Mission Successful");
            current.innerHTML++;
            clearInterval(myInterval);
            success.classList.add('active');
            setTimeout(()=>{
                success.classList.remove('active');
            },2000);
            reset();
        }
        else{
            if(totalTime==0){
                timeup.classList.add('active');
                setTimeout(()=>{
                    timeup.classList.remove('active');
                },3000);
                reset();
            }
            else{
                failure.classList.add('active');
                setTimeout(()=>{
                    failure.classList.remove('active');
                },2000);
            }
        }
    })
    .catch(err=>{
        alert("Some Error Occured !");
    })

}

function reset(){
    clearInterval(myInterval);
    modal.style.display='none';
    container.style.display='flex';
    footer.classList.remove('before');
    overlay.style.display='none';
    timeLeft.innerHTML="";
}
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




