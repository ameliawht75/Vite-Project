import "bootstrap/dist/css/bootstrap.min.css";

// Ensure elements exist before using them
const booksContainer = document.getElementById("books-container") as HTMLElement | null;
const genresContainer = document.getElementById("genres-container") as HTMLElement | null;
const genreIdTextbox = document.getElementById("genre-id-textbox") as HTMLInputElement | null;
const reviewsContainer = document.getElementById("reviews-container") as HTMLElement | null;
const reviewIdTextbox = document.getElementById("review-id-textbox") as HTMLInputElement | null;

// Define Interfaces for Data Models
interface Book {
    id: number;
    title: string;
    genreId: number;
}

interface Genre {
    id: number;
    title: string;
}

interface Review {
    id: number;
    author: string;
    text: string;
    stars: number;
    bookId: number;
}

/***** Books *****/
async function onFetchBooksClick(): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/books");
        const bookList: Book[] = await response.json();

        if (!booksContainer) {
            console.error("Error: booksContainer element not found in the DOM.");
            return;
        }

        booksContainer.innerHTML = bookList.length
            ? bookList
                  .map(
                      (book) => `<div class="bg-light rounded mt-5 p-3">
                          <h3>${book.title}</h3>
                          <p>Genre ID: ${book.genreId}</p>
                      </div>`
                  )
                  .join("")
            : "<p>No books available.</p>";
    } catch (error) {
        console.error("Error fetching books:", error);
        if (booksContainer) {
            booksContainer.innerHTML = "<p>Error fetching books. Please try again later.</p>";
        }
    }
}

let lastCreatedItem: Book | null = null;

async function onCreateBookClick(): Promise<void> {
    const testBook: Partial<Book> = { title: "Test", genreId: 1 };

    try {
        const response = await fetch("http://localhost:3000/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testBook),
        });

        if (!response.ok) throw new Error("Failed to create book");

        lastCreatedItem = await response.json();
    } catch (error) {
        console.error("Error creating book:", error);
    }
}

async function onDeleteBookClick(): Promise<void> {
    const bookId = prompt("Enter the ID of the book you want to delete:");

    if (!bookId || isNaN(Number(bookId))) {
        alert("Please enter a valid numeric Book ID.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/books/${bookId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert(`Book with ID ${bookId} deleted successfully!`);
            onFetchBooksClick();
        } else {
            alert("Failed to delete the book. Please try again.");
        }
    } catch (error) {
        console.error("Error deleting the book:", error);
        alert("An error occurred while deleting the book.");
    }
}

/***** Genres *****/
async function onFetchGenresClick(): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/genres");
        const genreList: Genre[] = await response.json();

        if (genresContainer) {
            genresContainer.innerHTML = genreList
                .map(
                    (genre) => `<div class="bg-light rounded mt-5 p-3">
                        <h3>${genre.title}</h3>
                        <p>ID: ${genre.id}</p>
                    </div>`
                )
                .join("");
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

async function onCreateGenreClick(): Promise<void> {
    const newGenre: Partial<Genre> = { title: "New Genre" };

    try {
        const response = await fetch("http://localhost:3000/genres", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGenre),
        });

        if (!response.ok) throw new Error("Failed to create genre");

        const createdGenre = await response.json();
        console.log("Created Genre:", createdGenre);
    } catch (error) {
        console.error("Error creating genre:", error);
    }
}

async function onDeleteGenreClick(): Promise<void> {
    if (!genreIdTextbox) return;

    const idToDelete = genreIdTextbox.value;
    if (!idToDelete || isNaN(Number(idToDelete))) {
        alert("Please enter a valid numeric Genre ID.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/genres/${idToDelete}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert(`Genre with ID ${idToDelete} deleted successfully!`);
            genreIdTextbox.value = "";
            onFetchGenresClick();
        } else {
            alert("Failed to delete genre.");
        }
    } catch (error) {
        console.error("Error deleting genre:", error);
    }
}

/***** Reviews *****/
async function onFetchReviewsClick(): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/reviews");
        const reviewsList: Review[] = await response.json();

        if (reviewsContainer) {
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
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

async function onCreateReviewsClick(): Promise<void> {
    const newReview: Partial<Review> = {
        author: "Test User",
        text: "This is a test review.",
        stars: 4,
        bookId: 1,
    };

    try {
        const response = await fetch("http://localhost:3000/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReview),
        });

        if (!response.ok) throw new Error("Failed to create review");

        console.log("Created Review:", await response.json());
        onFetchReviewsClick();
    } catch (error) {
        console.error("Error creating review:", error);
    }
}

async function onDeleteReviewClick(): Promise<void> {
    if (!reviewIdTextbox) return;

    const reviewId = reviewIdTextbox.value;
    if (!reviewId || isNaN(Number(reviewId))) {
        alert("Please enter a valid numeric Review ID.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert(`Review with ID ${reviewId} deleted successfully!`);
            onFetchReviewsClick();
        } else {
            alert("Failed to delete the review.");
        }
    } catch (error) {
        console.error("Error deleting the review:", error);
        alert("An error occurred while deleting the review.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fetch-books")?.addEventListener("click", onFetchBooksClick);
  document.getElementById("create-book")?.addEventListener("click", onCreateBookClick);
  document.getElementById("delete-book")?.addEventListener("click", onDeleteBookClick);

  document.getElementById("fetch-genres")?.addEventListener("click", onFetchGenresClick);
  document.getElementById("create-genre")?.addEventListener("click", onCreateGenreClick);
  document.getElementById("delete-genre")?.addEventListener("click", onDeleteGenreClick);

  document.getElementById("fetch-reviews")?.addEventListener("click", onFetchReviewsClick);
  document.getElementById("create-review")?.addEventListener("click", onCreateReviewsClick);
  document.getElementById("delete-review")?.addEventListener("click", onDeleteReviewClick);
});

