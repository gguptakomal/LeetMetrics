document.addEventListener("DOMContentLoaded", function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");


    function validateUserName(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching)
            alert("Invalid username");
        return isMatching;
    }

    async function fetchUserDetails(username){
        const url = `https://leetcode-api-pied.vercel.app/user/${username}`;
        const urlForQuestions = `https://leetcode-api-pied.vercel.app/stats`;
        try{

            searchButton.textContent = "Searching..";
            searchButton.disabled = true;


            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }

            const parsedData = await response.json();

            const response2 = await fetch(urlForQuestions);
            const questionsData = await response2.json();

            console.log(parsedData);
            console.log(questionsData);

            displayDetails(parsedData, questionsData)

            

        }

        catch(error){
            console.log(error);
        }

        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }

    }

    function displayDetails(parsedData, questionsData){

        const easySolved = parsedData.submitStats.acSubmissionNum.find(
            item => item.difficulty === "Easy"
        ).count;
        
        const mediumSolved = parsedData.submitStats.acSubmissionNum.find(
            item => item.difficulty === "Medium"
        ).count;
        
        const hardSolved = parsedData.submitStats.acSubmissionNum.find(
            item => item.difficulty === "Hard"
        ).count;
        
        console.log(easySolved);   // 125
        console.log(mediumSolved); // 403
        console.log(hardSolved);   // 146


        const easyTotal = questionsData.by_difficulty.easy;
        const mediumTotal = questionsData.by_difficulty.medium;
        const hardTotal = questionsData.by_difficulty.hard;


        updateProgress(easySolved, easyTotal, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, mediumTotal, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, hardTotal, hardLabel, hardProgressCircle);

    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }




    searchButton.addEventListener('click', function(){
        const username = usernameInput.value;
        console.log("login username: ", username);

        if(validateUserName(username)){
            fetchUserDetails(username);
        }

    })
})
