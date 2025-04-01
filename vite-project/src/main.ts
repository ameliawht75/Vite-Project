import "bootstrap/dist/css/bootstrap.min.css";

// Define data
export type Book = {
    id: number;
    title: string;
    genreId: number;
}

export type Genre = {
    id: number;
    title: string;
}

export type Review = {
    id: number;
    author: string;
    text: string;
    stars: number;
    bookId: number;
}

// Ensure elements exist before using them
const booksContainer = document.getElementById("books-container") as HTMLElement | null;
const genresContainer = document.getElementById("genres-container") as HTMLElement | null;
const genreIdTextbox = document.getElementById("genre-id-textbox") as HTMLInputElement | null;
const reviewsContainer = document.getElementById("reviews-container") as HTMLElement | null;
const reviewIdTextbox = document.getElementById("review-id-textbox") as HTMLInputElement | null;

/*****Books*****/
async function onFetchBooksClick() {
  const response = await fetch("http://localhost:3000/books");
  const bookList = await response.json();

  booksContainer.innerHTML = bookList
      .map(
          (book) => `<div class="bg-light rounded mt-5">
              <h3>${book.title}</h3>
              <p>${book.genreId}</p>
          </div>`
      )
      .join("");
}

let lastCreatedItem = null;

async function onCreateBookClick() {
  const testBook = { title: "Test", genreId: 1 };
  const response = await fetch("http://localhost:3000/books", {
      method: "POST", // create
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testBook),
  });

  const newlyCreatedItem = await response.json();
  lastCreatedItem = newlyCreatedItem;
}

async function onDeleteBookClick() { //went with a popup instead of a textbox as I kept getting errors.
  const bookId = prompt("Enter the ID of the book you want to delete:");

  if (!bookId) { //Fetch the book by ID and delete it.  Thank you to Reddit users for help with this.
      alert("Please enter a valid Book ID.");
      return;
  }

  try {  
      const response = await fetch(`http://localhost:3000/books/${bookId}`, {
          method: "DELETE",
      });

      if (response.ok) {
          alert(`Book with ID ${bookId} deleted successfully!`); // Optionally, refresh the books list
          onFetchBooksClick();
      } else {
          alert("Failed to delete the book. Please try again.");
      }
  } catch (error) {
      console.error("Error deleting the book:", error);
      alert("An error occurred while deleting the book.");
  }
}

/***** GENRES *****/

const genresContainer = document.getElementById("genres-container");
const genreIdTextbox = document.getElementById("genre-id-textbox"); //Was able to get textbox to work in this area and in reviews.

async function onFetchGenresClick() {
  const response = await fetch("http://localhost:3000/genres");
  const genreList = await response.json();

  genresContainer.innerHTML = genreList
      .map(
          (genre) => `<div class="bg-light rounded mt-5">
              <h3>${genre.title}</h3>
              <p>id: ${genre.id}</p>
          </div>`
      )
      .join("");
}

async function onCreateGenreClick() {
  const newGenre = { title: "New Genre" };
  const response = await fetch("http://localhost:3000/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGenre),
  });

  const createdGenre = await response.json();
  console.log("Created Genre:", createdGenre);
}

async function onDeleteGenreClick() {
  const idToDelete = genreIdTextbox.value;
  if (!idToDelete) {
      console.log("Enter a genre ID to delete");
      return;
  }

  await fetch(`http://localhost:3000/genres/${idToDelete}`, {
      method: "DELETE",
  });

  genreIdTextbox.value = "";
}

/***** Reviews *****/

const reviewsContainer = document.getElementById("reviews-container");
const reviewIdTextbox = document.getElementById("reviews-id-textbox"); 

async function onFetchReviewsClick() {
  const response = await fetch("http://localhost:3000/reviews");
  const reviewsList = await response.json();

  console.log("Fetched Reviews:", reviewsList); // Debugging log because I was getting errors.

  reviewsContainer.innerHTML = reviewsList
      .map(
          (review) => `
              <div class="card p-3 shadow-sm mt-3">
                  <h4>⭐ ${review.stars}/5</h4>
                  <p><strong>${review.author} says:</strong> ${review.text}</p>
                  <p><small>Book ID: ${review.bookId}</small></p>
              </div>
          `
      )
      .join("");
}

async function onCreateReviewsClick() {
  const newReview = {
      author: "Test User", // Author of the review
      text: "This is a test review.", // Review content
      stars: 4, // Star rating (1-5)
      bookId: 1, // ID of the book being reviewed
  };

  try {
      const response = await fetch("http://localhost:3000/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
      });

      if (!response.ok) {
          throw new Error("Failed to create review");
      }

      const createdReview = await response.json();
      console.log("Created Review:", createdReview);

      onFetchReviewsClick(); // Refresh the reviews list to show the new review
  } catch (error) {
      console.error("Error creating review:", error);
  }
}

async function onDeleteReviewClick() {
  const reviewId = document.getElementById('review-id-textbox').value; // Corrected ID

  if (!reviewId) {
      alert('Please enter a Review ID.');
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          alert(`Review with ID ${reviewId} deleted successfully!`);
          onFetchReviewsClick(); // refresh the reviews list
      } else {
          alert('Failed to delete the review. Please try again.');
      }
  } catch (error) {
      console.error('Error deleting the review:', error);
      alert('An error occurred while deleting the review.');
  }
}

