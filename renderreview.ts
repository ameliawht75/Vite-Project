import { Review } from "./main";


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