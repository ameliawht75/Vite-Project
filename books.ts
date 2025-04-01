import {book} from "./main";

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