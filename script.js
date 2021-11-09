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
const footer=document.querySelector('.footer');

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
        console.log(data);
        login_section.style.display='none';
        footer.classList.remove('before');
        container.style.display='flex';
    })
    .catch(err=>{
        alert("Please enter correct username !");
    })
})

solve.addEventListener('click',(e)=>{
    e.preventDefault();
    let URL='https://codeforces.com/api/problemset.problems';
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
    console.log(userName.value)
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
        let totalTime=(+hour.value*3600)+(+minute.value*60) + (+second.value);
        if(totalTime==0){
            alert('Please enter valid time !');
        }
        else{
            openProblem(problemURL);
            console.log(totalTime);
            if(totalTime>0){
                setTimeout(() => {
                    let sound=new Audio('audio/audio1.mp3');
                    sound.play();
                },totalTime*1000);
            }
        }
    })
    .catch(err=>{
        alert("No problems found with selected tags/ratings !");
    })
})

function openProblem(URL){
    window.open(URL,'_blank');
}


