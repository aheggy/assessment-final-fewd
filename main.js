





// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function
const movieSelector = document.getElementById("titles") 
const detailContainer = document.getElementById("display-info")

const commentInput = document.getElementById("review")

const form = document.querySelector("form")

const commentList = document.getElementById("reviews")

const restReviews = document.getElementById("reset-reviews")

const showPeopleButton = document.getElementById("show-people")

function run() {

    
 // Add code you want to run on page load here
 fetch(`https://resource-ghibli-api.onrender.com/films`)
.then(response => response.json())
.then(response => {
    populateFormDropdown(response)
})
.catch(err => console.error(err));


let populateFormDropdown = movies => {
    for (const movie of movies) {
        // if (counter <= 13) {
        //     episodeList.push(episode)
        let newOption = document.createElement("option")
        newOption.textContent = movie.title
        newOption.value = movie.id
        movieSelector.append(newOption)
    }
    
}
//detect any change in the drop menu and update the description 
let selectedMovie = null
movieSelector.addEventListener("change", (event) => {
    let movieId = event.target.value
    if (movieId !== "") {
        // get the details of selected movie using the API
        fetch(`https://resource-ghibli-api.onrender.com/films/${movieId}`)
        .then(response => response.json())
        .then(response => {
            selectedMovie = response
            console.log(response)
            updateMovieSelected(response)
        })
        .catch(err => console.error(err));
        
    } else {
        selectedMovie = null
    }
})

function updateMovieSelected(movie) {
    detailContainer.textContent = ""
    const title = movie.title
    const releaseYear = movie.release_date
    const description = movie.description
    
    let titleHeader = document.createElement("h3")
    let releaseYearparagraph = document.createElement("p")
    let movieDescription = document.createElement("p")
    
    titleHeader.textContent = title
    releaseYearparagraph.textContent = releaseYear
    movieDescription.textContent = description
    
    detailContainer.append(titleHeader)
    detailContainer.append(releaseYearparagraph)
    detailContainer.append(movieDescription)
}

form.addEventListener("submit", event => {
    event.preventDefault()
   
    if (selectedMovie){
        let newComment = document.createElement("li")
        newComment.innerHTML += `<strong>${selectedMovie.title}</strong> -- `
        newComment.innerHTML += commentInput.value
        commentList.append(newComment)
        form.reset()

        restReviews.addEventListener("click", event => {
            newComment.remove()
        })



        

        showPeopleButton.addEventListener("click", event => {
            const peopleList = document.getElementById("names")
            peopleList.innerHTML = ""
        
            console.log(selectedMovie)
        
            selectedMovie.people.forEach( element => {
                let list = document.createElement("li")
                fetch(`https://resource-ghibli-api.onrender.com${element}`)
                .then(response => response.json())
                .then(response => {
                    if (response.name){
                        list.innerText = response.name
                    } else {
                        list.innerText = "No People"   
                    }
                    peopleList.append(list)
            })
            .catch(err => console.error(err));
        
            });
           
        })








        
    } else {
        alert("Please select a movie first.")
    }
    
})




selectedMovie = ""

}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);
