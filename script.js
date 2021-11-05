const btn=document.querySelector('button');
const tags=document.querySelectorAll('#tags');
const rating=document.querySelectorAll('#rating');
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
    })
    .catch(err=>{
        alert("No problems found with selected tags/ratings !");
    })
})

function openProblem(URL){
    window.open(URL,'_blank');
}
