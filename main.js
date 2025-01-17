
// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function
const BASE_URL = `https://resource-ghibli-api.onrender.com`
const movieSelector = document.getElementById("titles") 
const detailContainer = document.getElementById("display-info")
const commentInput = document.getElementById("review")
const form = document.querySelector("form")
const commentList = document.getElementById("reviews")
const restReviews = document.getElementById("reset-reviews")
const showPeopleButton = document.getElementById("show-people")
let peopleList = document.getElementById("names")


function run() {

    
 // Add code you want to run on page load here
 fetch(`${BASE_URL}/films`)
.then(response => response.json())
.then(response => {
    populateFormDropdown(response)
})
.catch(err => console.error(err));

// get the movies list
let populateFormDropdown = movies => {
    for (const movie of movies) {
        let newOption = document.createElement("option")
        newOption.textContent = movie.title
        newOption.value = movie.id
        movieSelector.append(newOption)
    }
    
}

//detect any change in the droplist and update the description 
let selectedMovie = null
movieSelector.addEventListener("change", (event) => {
    let movieId = event.target.value
    if (movieId !== "") {
        // fetch API for the details of selected movie
        fetch(`${BASE_URL}/films/${movieId}`)
        .then(response => response.json())
        .then(response => {
            selectedMovie = response
            console.log(response)
            updateMovieSelected(response)
        })
        .catch(err => console.error(err));
        
    } else {
        selectedMovie = null
       
        titleHeader.textContent = ""
        releaseYearparagraph.textContent = ""
        movieDescription.textContent = ""
        
    }
})

let titleHeader = null
let releaseYearparagraph = null
let movieDescription = null

//create the element and append it to the movie details section
function updateMovieSelected(movie) {
    detailContainer.textContent = ""
    const title = movie.title
    const releaseYear = movie.release_date
    const description = movie.description
    
    titleHeader = document.createElement("h3")
    releaseYearparagraph = document.createElement("p")
    movieDescription = document.createElement("p")
  
    titleHeader.textContent = title
    releaseYearparagraph.textContent = releaseYear
    movieDescription.textContent = description
    
    detailContainer.appendChild(titleHeader)
    detailContainer.appendChild(releaseYearparagraph)
    detailContainer.appendChild(movieDescription)
    // clear the previous people list if the selected movie change from droplist
    if (peopleList.innerHTML !== "")  {
        peopleList.innerHTML = ""
    } 
}

// create the comment element and append it to the reviews section
form.addEventListener("submit", event => {
    event.preventDefault()
   
    if (selectedMovie){
        let newComment = document.createElement("li")
        newComment.innerHTML += `<strong>${selectedMovie.title}</strong> -- `
        newComment.innerHTML += commentInput.value
        commentList.append(newComment)
        form.reset()

        // clear the reviews section if the rest button clicked
        restReviews.addEventListener("click", event => {
            newComment.remove()
        })
        // alert the user that movie should be selected before write a review
    } else {
        alert("Please select a movie first")
    }
     
})

// create list element and fetch the data to show  people for movie
showPeopleButton.addEventListener("click", event => {
    peopleList.innerHTML = ""
    console.log(selectedMovie)

    selectedMovie.people.forEach( element => {
        console.log(element)
        fetch(`${BASE_URL}${element}`)
        .then(response => response.json())
        .then(response => {
            if (response.name){
                let list = document.createElement("li")
                list.innerText = response.name
                peopleList.append(list)
            }
    })
    .catch(err => console.error(err));

    });
   
})

}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);
